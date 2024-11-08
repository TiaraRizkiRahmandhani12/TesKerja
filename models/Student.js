// Student Model
const db = require('../config/db');

const Student = {
    create: (studentData, callback) => {
        const sql = 'INSERT INTO students SET ?';
        db.query(sql, studentData, callback);
    },
    // Fungsi lain untuk mengelola data siswa
};

module.exports = Student;
