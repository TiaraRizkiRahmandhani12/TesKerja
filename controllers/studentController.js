const db = require('../config/db'); // Sesuaikan dengan konfigurasi database Anda

// Fungsi untuk mendaftarkan siswa
exports.registerStudent = (req, res) => {
    const { name, phone, address, gender, subject_id, extracurricular_id } = req.body;

    // Validasi setiap field secara terpisah untuk memberikan pesan error yang spesifik
    if (!name) {
        return res.status(400).json({ message: "Nama wajib diisi." });
    }
    if (!phone) {
        return res.status(400).json({ message: "Telepon wajib diisi." });
    }
    if (!address) {
        return res.status(400).json({ message: "Alamat rumah wajib diisi." });
    }
    if (!gender) {
        return res.status(400).json({ message: "Jenis kelamin wajib diisi." });
    }
    // Validasi gender untuk memastikan nilainya 'L' atau 'P'
    if (gender !== 'L' && gender !== 'P') {
        return res.status(400).json({ message: "Jenis kelamin harus diisi dengan 'L' atau 'P'." });
    }
    // Validasi subject_id dan extracurricular_id untuk memastikan siswa memilih masing-masing satu
    if (!subject_id) {
        return res.status(400).json({ message: "Setiap siswa wajib memilih 1 pelajaran." });
    }
    if (!extracurricular_id) {
        return res.status(400).json({ message: "Setiap siswa wajib memilih 1 ekstra kurikuler." });
    }

    // Cek kuota untuk subject_id
    const checkQuotaQuery = 'SELECT COUNT(*) AS studentCount, quota FROM courses WHERE id = ?';
    db.query(checkQuotaQuery, [subject_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Terjadi kesalahan saat mengecek kuota", error: err });
        }
        const studentCount = result[0].studentCount;
        const quota = result[0].quota;

        // Jika kuota sudah terpenuhi
        if (studentCount >= quota) {
            return res.status(400).json({ message: "Kuota untuk pelajaran ini sudah terpenuhi." });
        }

        // Cek kuota untuk extracurricular_id
        const checkExtracurricularQuotaQuery = 'SELECT COUNT(*) AS studentCount, quota FROM extracurriculars WHERE id = ?';
        db.query(checkExtracurricularQuotaQuery, [extracurricular_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Terjadi kesalahan saat mengecek kuota ekstra kurikuler", error: err });
            }
            const extracurricularCount = result[0].studentCount;
            const extracurricularQuota = result[0].quota;

            // Jika kuota ekstra kurikuler sudah terpenuhi
            if (extracurricularCount >= extracurricularQuota) {
                return res.status(400).json({ message: "Kuota untuk ekstra kurikuler ini sudah terpenuhi." });
            }

            // Jika semua pengecekan berhasil, lanjutkan dengan pendaftaran siswa
            const query = `
                INSERT INTO students (name, phone, address, gender, subject_id, extracurricular_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const values = [name, phone, address, gender, subject_id, extracurricular_id];

            db.query(query, values, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Error mendaftarkan siswa", error: err });
                }
                res.status(201).json({ message: "Siswa berhasil didaftarkan", studentId: result.insertId });
            });
        });
    });
};
