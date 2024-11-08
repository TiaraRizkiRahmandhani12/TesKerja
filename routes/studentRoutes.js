const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Route untuk mendaftarkan siswa
router.post('/register', studentController.registerStudent);

// Route lainnya terkait siswa...

module.exports = router;
