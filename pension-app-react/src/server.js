const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Puerto de Vite
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de la carpeta public
app.use('/downloads', express.static(path.join(__dirname, '../public/downloads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// Configuración de sesión
app.use(session({
    secret: '6d66e52c1f00758541befbd0583ef670088e30a0612caa39428f62648e29f14a7c66bf72b04581132abbea0a6901275e19c8124f2144400955aefc4aad5600de',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    },
    name: 'finrisk.session'
}));

// Credenciales válidas
const VALID_USERS = [
    {
        username: "admin",
        password: "admin", 
        id: 1,
        name: "Administrador"
    },
    {
        username: "agente",
        password: "agente123",
        id: 2,
        name: "Agente de Ventas"
    },
    {
        username: "demo",
        password: "demo",
        id: 3,
        name: "Usuario Demo"
    }
];

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas de autenticación
app.post('/auth/login', async (req, res) => {
    console.log('=== INTENTO DE LOGIN ===');
    console.log('Body recibido:', req.body);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
        console.log('Faltan credenciales');
        return res.status(400).json({ 
            success: false, 
            message: 'Usuario y contraseña son requeridos' 
        });
    }
    
    const user = VALID_USERS.find(u => 
        u.username === username && u.password === password
    );
    
    if (user) {
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.name = user.name;
        
        console.log('✅ Login exitoso para:', user.username);
        console.log('Sesión creada:', req.session);
        
        res.json({ 
            success: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name
            }
        });
    } else {
        console.log('❌ Credenciales incorrectas para:', username);
        res.status(401).json({ 
            success: false, 
            message: 'Usuario o contraseña incorrectos' 
        });
    }
});

app.get('/auth/logout', (req, res) => {
    console.log('=== LOGOUT ===');
    console.log('Usuario saliendo:', req.session?.username);
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        } else {
            res.clearCookie('finrisk.session');
            console.log('✅ Sesión cerrada correctamente');
            res.json({ success: true, message: 'Sesión cerrada correctamente' });
        }
    });
});

app.get('/auth/check-session', (req, res) => {
    console.log('=== CHECK SESSION ===');
    console.log('Sesión actual:', req.session);
    
    if (req.session && req.session.userId) {
        console.log('✅ Sesión válida para:', req.session.username);
        res.json({ 
            loggedIn: true, 
            userId: req.session.userId,
            username: req.session.username,
            name: req.session.name
        });
    } else {
        console.log('❌ No hay sesión activa');
        res.json({ loggedIn: false });
    }
});

// Función para generar datos simulados de clientes
function generateMockClientData() {
    const nombres = [
        'Juan Pérez García', 'María Carmen López', 'Carlos Eduardo Santos', 
        'Ana Isabel Martínez', 'Pedro Alfonso Rodríguez', 'Laura Beatriz Fernández'
    ];
    
    const emails = [
        'juan.perez@gmail.com', 'maria.lopez@hotmail.com', 'carlos.santos@yahoo.com',
        'ana.martinez@outlook.com', 'pedro.rodriguez@gmail.com', 'laura.fernandez@hotmail.com'
    ];

    const telefonos = [
        '+51 987 654 321', '+51 956 789 123', '+51 912 345 678', 
        '+51 987 321 654', '+51 945 678 912', '+51 923 456 789'
    ];

    const monedas = ['Soles', 'Dolares'];
    
    return Array.from({ length: 50 }, (_, i) => ({
        ID_USUARIO: i + 1,
        ID_SIMULACION: i + 1,
        NOMBRE: nombres[i % nombres.length],
        EMAIL: emails[i % emails.length],
        TELEFONO: telefonos[i % telefonos.length],
        PRIMA_TOT: (Math.random() * 400000 + 50000).toFixed(2),
        MONEDA_PAGO_PENSION: monedas[Math.floor(Math.random() * monedas.length)],
        DESEA_SER_CONTACTADO: Math.random() > 0.5 ? 'S' : 'N',
        FECHA_CALCULO: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
}

// API para obtener datos de clientes
app.get('/api/client-data', (req, res) => {
    console.log('Solicitando datos de clientes');
    
    try {
        const mockData = generateMockClientData();
        res.json(mockData);
    } catch (error) {
        console.error('Error al obtener datos de clientes:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener datos de clientes' 
        });
    }
});

// API para obtener información de descargas
app.get('/api/download-info', (req, res) => {
    try {
        const downloadsPath = path.join(__dirname, '../public/downloads');
        const files = [];
        
        // Verificar si existe la carpeta downloads
        if (fs.existsSync(downloadsPath)) {
            const fileList = fs.readdirSync(downloadsPath);
            
            fileList.forEach(file => {
                const filePath = path.join(downloadsPath, file);
                const stats = fs.statSync(filePath);
                
                if (stats.isFile() && file.endsWith('.exe')) {
                    files.push({
                        name: file,
                        size: (stats.size / (1024 * 1024)).toFixed(1) + ' MB', // Tamaño en MB
                        date: stats.mtime.toLocaleDateString('es-PE'),
                        downloadUrl: `/downloads/${file}`,
                        version: extractVersionFromFilename(file)
                    });
                }
            });
        }
        
        res.json({
            success: true,
            files: files,
            totalFiles: files.length,
            latestVersion: files.length > 0 ? files[0].version : '1.0.0'
        });
        
    } catch (error) {
        console.error('Error al obtener información de descargas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener información de descargas'
        });
    }
});

// API para registrar descarga
app.post('/api/download-track', (req, res) => {
    const { filename, userId } = req.body;
    
    // Aquí podrías registrar la descarga en una base de datos
    console.log(`📥 Descarga registrada: ${filename} por usuario ${userId || 'anónimo'}`);
    
    res.json({
        success: true,
        message: 'Descarga registrada correctamente'
    });
});

// Función para extraer versión del nombre del archivo
function extractVersionFromFilename(filename) {
    const match = filename.match(/v?(\d+\.\d+\.\d+)/);
    return match ? match[1] : '1.0.0';
}

// Ruta de test
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error en la aplicación:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Ocurrió un error en el servidor'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express iniciado en puerto ${PORT}`);
    console.log(`🔐 API disponible en: http://localhost:${PORT}`);
    console.log(`📊 Test endpoint: http://localhost:${PORT}/test`);
});

module.exports = app;