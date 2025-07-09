const express = require('express');
const https = require('https');
const http = require('http');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Configuración SSL automática
const DOMAIN = process.env.DOMAIN || 'finrisk.tuempresa.com';
const SSL_PATH = `C:\\Certbot\\live\\${DOMAIN}`;
const USE_HTTPS = process.env.NODE_ENV === 'production' && fs.existsSync(SSL_PATH);

console.log(`🔍 Modo: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔒 HTTPS habilitado: ${USE_HTTPS}`);
if (USE_HTTPS) {
    console.log(`📄 Certificados en: ${SSL_PATH}`);
}

// Middleware CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    `http://ec2-54-177-111-101.us-west-1.compute.amazonaws.com:3000`,
    `https://ec2-54-177-111-101.us-west-1.compute.amazonaws.com`,
    `http://${DOMAIN}`,
    `https://${DOMAIN}`
  ],
  credentials: true
}));

// Redirección HTTP a HTTPS solo en producción
if (USE_HTTPS) {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https' && !req.secure) {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/downloads', express.static(path.join(__dirname, '../public/downloads')));
app.use(express.static(path.join(__dirname, '../dist')));

// Configuración de sesión
app.use(session({
    secret: '6d66e52c1f00758541befbd0583ef670088e30a0612caa39428f62648e29f14a7c66bf72b04581132abbea0a6901275e19c8124f2144400955aefc4aad5600de',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: USE_HTTPS, // Secure solo con HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    },
    name: 'finrisk.session'
}));

// Headers de seguridad
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  if (USE_HTTPS) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
});

// Credenciales válidas
const VALID_USERS = [
    { username: "admin", password: "admin", id: 1, name: "Administrador" },
    { username: "agente", password: "agente123", id: 2, name: "Agente de Ventas" },
    { username: "demo", password: "demo", id: 3, name: "Usuario Demo" }
];

// Logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.secure ? 'HTTPS' : 'HTTP'}`);
    next();
});

// API Routes
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
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
        
        res.json({ 
            success: true,
            user: { id: user.id, username: user.username, name: user.name }
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
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        } else {
            res.clearCookie('finrisk.session');
            res.json({ success: true, message: 'Sesión cerrada correctamente' });
        }
    });
});

app.get('/auth/check-session', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ 
            loggedIn: true, 
            userId: req.session.userId,
            username: req.session.username,
            name: req.session.name
        });
    } else {
        res.json({ loggedIn: false });
    }
});

// Mock data function
function generateMockClientData() {
    const nombres = ['Juan Pérez García', 'María Carmen López', 'Carlos Eduardo Santos'];
    const emails = ['juan.perez@gmail.com', 'maria.lopez@hotmail.com', 'carlos.santos@yahoo.com'];
    const telefonos = ['+51 987 654 321', '+51 956 789 123', '+51 912 345 678'];
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

app.get('/api/client-data', (req, res) => {
    try {
        const mockData = generateMockClientData();
        res.json(mockData);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener datos de clientes' });
    }
});

app.get('/api/download-info', (req, res) => {
    try {
        const downloadsPath = path.join(__dirname, '../public/downloads');
        const files = [];
        
        if (fs.existsSync(downloadsPath)) {
            const fileList = fs.readdirSync(downloadsPath);
            
            fileList.forEach(file => {
                const filePath = path.join(downloadsPath, file);
                const stats = fs.statSync(filePath);
                
                if (stats.isFile() && file.endsWith('.exe')) {
                    files.push({
                        name: file,
                        size: (stats.size / (1024 * 1024)).toFixed(1) + ' MB',
                        date: stats.mtime.toLocaleDateString('es-PE'),
                        downloadUrl: `/downloads/${file}`,
                        version: file.match(/v?(\d+\.\d+\.\d+)/) ? file.match(/v?(\d+\.\d+\.\d+)/)[1] : '1.0.0'
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
        res.status(500).json({ success: false, message: 'Error al obtener información de descargas' });
    }
});

app.post('/api/download-track', (req, res) => {
    const { filename, userId } = req.body;
    console.log(`📥 Descarga registrada: ${filename} por usuario ${userId || 'anónimo'}`);
    res.json({ success: true, message: 'Descarga registrada correctamente' });
});

app.get('/test', (req, res) => {
    res.json({ 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        https: req.secure,
        protocol: req.protocol,
        host: req.get('host'),
        ssl_enabled: USE_HTTPS
    });
});

// Catch-all para React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Configuración de servidores
const HTTP_PORT = 80;
const HTTPS_PORT = 443;
const DEV_PORT = 3000;

if (USE_HTTPS) {
    console.log('🔒 Iniciando en modo HTTPS...');
    
    try {
        const privateKey = fs.readFileSync(path.join(SSL_PATH, 'privkey.pem'), 'utf8');
        const certificate = fs.readFileSync(path.join(SSL_PATH, 'cert.pem'), 'utf8');
        const ca = fs.readFileSync(path.join(SSL_PATH, 'chain.pem'), 'utf8');

        const credentials = { key: privateKey, cert: certificate, ca: ca };

        // Servidor HTTPS
        https.createServer(credentials, app).listen(HTTPS_PORT, '0.0.0.0', () => {
            console.log(`🔒 Servidor HTTPS iniciado en puerto ${HTTPS_PORT}`);
            console.log(`🌐 Aplicación disponible en: https://${DOMAIN}`);
        });

        // Servidor HTTP para redirección
        const httpApp = express();
        httpApp.use((req, res) => {
            res.redirect(301, `https://${req.headers.host}${req.url}`);
        });
        
        http.createServer(httpApp).listen(HTTP_PORT, '0.0.0.0', () => {
            console.log(`🔄 Servidor HTTP (redirección) en puerto ${HTTP_PORT}`);
        });

    } catch (error) {
        console.error('❌ Error cargando certificados SSL:', error.message);
        console.log('🔄 Iniciando en modo HTTP...');
        startHttpServer();
    }
} else {
    startHttpServer();
}

function startHttpServer() {
    app.listen(DEV_PORT, '0.0.0.0', () => {
        console.log(`🚀 Servidor HTTP iniciado en puerto ${DEV_PORT}`);
        console.log(`🌐 Aplicación disponible en: http://ec2-54-177-111-101.us-west-1.compute.amazonaws.com:${DEV_PORT}`);
        if (process.env.NODE_ENV === 'production') {
            console.log(`⚠️  Para HTTPS, configura un dominio y ejecuta setup-ssl.bat`);
        }
    });
}

module.exports = app;