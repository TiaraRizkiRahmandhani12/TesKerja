const express = require('express');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// Gunakan express.json() untuk parsing JSON body
app.use(express.json()); // Middleware untuk parsing JSON

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

module.exports = app;
