const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = 'clave_secreta_universidad'; // En producción, esto va en un .env

// Base de datos en memoria
const users = [{ username: 'admin', password: '123' }];
let productos = [
    { id: 'QR-001', nombre: 'Laptop HP ProBook', stock: 15 },
    { id: 'QR-002', nombre: 'Monitor Dell 24"', stock: 8 },
    { id: 'QR-003', nombre: 'Teclado Mecánico', stock: 20 }
];

// 1. Endpoint: Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
    }
});

// Middleware de Autenticación
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Formato: Bearer <token>
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ error: 'Acceso no autorizado. Token requerido.' });
    }
};

// 2. Endpoint: Obtener todos los productos
app.get('/productos', authenticateJWT, (req, res) => {
    res.json(productos);
});

// 3. Endpoint: Obtener un producto por ID (Escaneo QR)
app.get('/productos/:id', authenticateJWT, (req, res) => {
    const product = productos.find(p => p.id === req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ error: 'Producto no encontrado' });
});

// 4. Endpoint: Actualizar inventario (Restar stock)
app.put('/productos/:id', authenticateJWT, (req, res) => {
    const { cantidad, accion } = req.body; // accion puede ser 'sumar' o 'restar'
    const productIndex = productos.findIndex(p => p.id === req.params.id);

    if (productIndex !== -1) {
        if (accion === 'restar') {
            if (productos[productIndex].stock - cantidad < 0) {
                return res.status(400).json({ error: 'No se permite stock negativo' });
            }
            productos[productIndex].stock -= cantidad;
        } else if (accion === 'sumar') {
            productos[productIndex].stock += cantidad;
        }

        res.json({ message: 'Stock actualizado', producto: productos[productIndex] });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`API corriendo en el puerto ${PORT}`);
});