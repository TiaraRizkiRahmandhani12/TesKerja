const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.header('Authorization').split(' ')[1];

    if (!token) return res.status(403).json({ message: "Akses ditolak!" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token tidak valid!" });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
