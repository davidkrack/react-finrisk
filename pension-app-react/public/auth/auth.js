const express = require('express');
const router = express.Router();

// Credenciales simples para testing
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

// Ruta de login
router.post('/login', async (req, res) => {
    console.log('=== INTENTO DE LOGIN ===');
    console.log('Body recibido:', req.body);
    console.log('Headers:', req.headers);
    
    const { username, password } = req.body;
    
    // Validar que lleguen los datos
    if (!username || !password) {
        console.log('Faltan credenciales');
        return res.status(400).json({ 
            success: false, 
            message: 'Usuario y contraseña son requeridos' 
        });
    }
    
    console.log('Credenciales recibidas:', { username, password });
    
    // Buscar usuario en la lista de usuarios válidos
    const user = VALID_USERS.find(u => 
        u.username === username && u.password === password
    );
    
    if (user) {
        // Si las credenciales son correctas, establecer la sesión
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

// Ruta de logout
router.get('/logout', (req, res) => {
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

// Ruta para verificar sesión
router.get('/check-session', (req, res) => {
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

// Ruta para obtener información del usuario actual
router.get('/user-info', (req, res) => {
    console.log('=== USER INFO ===');
    
    if (req.session && req.session.userId) {
        const user = VALID_USERS.find(u => u.id === req.session.userId);
        if (user) {
            console.log('✅ Información de usuario encontrada:', user.username);
            res.json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name
                }
            });
        } else {
            console.log('❌ Usuario no encontrado en BD');
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } else {
        console.log('❌ No hay sesión activa');
        res.status(401).json({ success: false, message: 'No hay sesión activa' });
    }
});

// Ruta de test para verificar que las rutas de auth funcionan
router.get('/test', (req, res) => {
    console.log('=== AUTH TEST ===');
    res.json({ 
        message: 'Rutas de autenticación funcionando correctamente',
        timestamp: new Date().toISOString(),
        availableUsers: VALID_USERS.map(u => ({ username: u.username, name: u.name }))
    });
});

module.exports = router;