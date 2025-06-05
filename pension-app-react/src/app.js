const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

// Importar rutas de autenticación
const authRoutes = require('./../public/auth/auth');

const app = express();

// Middleware básico
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de sesión
app.use(session({
    secret: '6d66e52c1f00758541befbd0583ef670088e30a0612caa39428f62648e29f14a7c66bf72b04581132abbea0a6901275e19c8124f2144400955aefc4aad5600de',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // En producción debería ser true con HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    },
    name: 'finrisk.session'
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// IMPORTANTE: Registrar las rutas de autenticación ANTES que las rutas protegidas
app.use('/auth', authRoutes);

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Usuario: ${req.session?.username || 'No autenticado'}`);
    next();
});

// Middleware de autenticación
function isAuthenticated(req, res, next) {
    console.log('Verificando autenticación para:', req.path);
    console.log('Sesión actual:', {
        userId: req.session?.userId,
        username: req.session?.username
    });
    
    if (req.session && req.session.userId) {
        console.log('Usuario autenticado:', req.session.username);
        next();
    } else {
        console.log('Usuario no autenticado, redirigiendo al login');
        
        // Si es una petición AJAX, devolver JSON
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.status(401).json({ 
                success: false, 
                message: 'No autenticado',
                redirect: '/login'
            });
        } else {
            res.redirect('/login');
        }
    }
}

// Rutas públicas
app.get('/', (req, res) => {
    console.log('Acceso a página principal');
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

app.get('/login', (req, res) => {
    console.log('Acceso a página de login');
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Ruta principal de React (para todas las rutas de la SPA)
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.get('/cotizador', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/cotizador.html'));
});

// Rutas protegidas legacy (mantener para compatibilidad)
app.get('/pension/calculo-pension', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pension.html'));
});

app.get('/control-panel', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/panel.html'));
});

app.get('/web-quote', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/web-quote.html'));
});

app.get('/commercial-quote', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/commercial-quote.html'));
});

// Función para generar datos simulados
function generateMockClientData() {
    const nombres = [
        'Juan Pérez García', 'María Carmen López', 'Carlos Eduardo Santos', 
        'Ana Isabel Martínez', 'Pedro Alfonso Rodríguez', 'Laura Beatriz Fernández',
        'Miguel Ángel Torres', 'Carmen Rosa Herrera', 'José Luis González', 
        'Isabel Victoria Ruiz', 'Francisco Javier Moreno', 'Pilar Mercedes Vargas',
        'Antonio Manuel Jiménez', 'Rosa Elena Álvarez', 'Manuel Enrique Castro'
    ];
    
    const emails = [
        'juan.perez@gmail.com', 'maria.lopez@hotmail.com', 'carlos.santos@yahoo.com',
        'ana.martinez@outlook.com', 'pedro.rodriguez@gmail.com', 'laura.fernandez@hotmail.com',
        'miguel.torres@yahoo.com', 'carmen.herrera@outlook.com', 'jose.gonzalez@gmail.com',
        'isabel.ruiz@hotmail.com', 'francisco.moreno@yahoo.com', 'pilar.vargas@outlook.com',
        'antonio.jimenez@gmail.com', 'rosa.alvarez@hotmail.com', 'manuel.castro@yahoo.com'
    ];

    const telefonos = [
        '+51 987 654 321', '+51 956 789 123', '+51 912 345 678', '+51 987 321 654',
        '+51 945 678 912', '+51 923 456 789', '+51 967 891 234', '+51 934 567 891',
        '+51 978 912 345', '+51 989 123 456', '+51 912 678 345', '+51 945 321 987',
        '+51 956 234 678', '+51 967 345 912', '+51 978 456 123'
    ];

    const monedas = ['Soles', 'Dolares'];
    
    return Array.from({ length: 75 }, (_, i) => ({
        ID_USUARIO: i + 1,
        ID_SIMULACION: i + 1,
        NOMBRE: nombres[i % nombres.length],
        EMAIL: emails[i % emails.length],
        TELEFONO: telefonos[i % telefonos.length],
        PRIMA_TOT: (Math.random() * 400000 + 50000).toFixed(2),
        MONEDA_PAGO_PENSION: monedas[Math.floor(Math.random() * monedas.length)],
        DESEA_SER_CONTACTADO: Math.random() > 0.5 ? 'S' : 'N',
        FECHA_CALCULO: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        SEXO: Math.random() > 0.5 ? 'M' : 'F',
        FECHA_NACIMIENTO: `${1940 + Math.floor(Math.random() * 60)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    }));
}

// API para obtener datos de clientes
app.get('/api/client-data', isAuthenticated, async (req, res) => {
    console.log('Solicitando datos de clientes para usuario:', req.session.username);
    
    try {
        // Por ahora usar datos simulados
        console.log('Usando datos simulados');
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

// Ruta de debug para verificar sesión
app.get('/debug/session', (req, res) => {
    res.json({
        session: req.session,
        sessionID: req.sessionID
    });
});

// Ruta de test para verificar que el servidor funciona
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores 404
app.use((req, res, next) => {
    console.log(`Ruta no encontrada: ${req.method} ${req.path}`);
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.path}`
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error en la aplicación:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Ocurrió un error en el servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Finrisk Systems servidor iniciado en puerto ${PORT}`);
    console.log(`📱 Accede a: http://localhost:${PORT}`);
    console.log(`🔐 Login en: http://localhost:${PORT}/login`);
    console.log(`📊 Dashboard en: http://localhost:${PORT}/dashboard`);
});

module.exports = app;