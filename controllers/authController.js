const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Tambahkan ini untuk mengimpor database

exports.login = (req, res) => {
    const { username, password } = req.body;

    // Cek user di database
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0 || !bcrypt.compareSync(password, results[0].password)) {
            return res.status(401).json({ message: "Username atau password salah" });
        }

        // Generate JWT
        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};
