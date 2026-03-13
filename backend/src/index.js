
// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const settingsRoutes = require('./routes/settings');
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const searchRoutes = require('./routes/search');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/search', searchRoutes);


// SERVE FRONTEND
const path = require('path');
const rootDir = path.join(__dirname, '../../');

// Serve specific static folders from root for security
app.use('/admin', express.static(path.join(rootDir, 'admin')));
app.use('/images', express.static(path.join(rootDir, 'images')));
app.use('/js', express.static(path.join(rootDir, 'js')));
app.use('/produtos', express.static(path.join(rootDir, 'produtos')));
app.use('/categorias', express.static(path.join(rootDir, 'categorias')));
app.use('/css', express.static(path.join(rootDir, 'css'))); // if it exists

// Serve index.html specifically
app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
});

// Fallback to index.html for SPA-like behavior (except for /api)
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    const targetFile = path.join(rootDir, 'index.html');
    res.sendFile(targetFile);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Root Dir: ${rootDir}`);
    console.log(`=================================`);
});
