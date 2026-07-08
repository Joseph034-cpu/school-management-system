const pool = require('../config/database');

class Attendance {
    static async getAll() {
        const result = await pool.query(`
            SELECT a.*, s.name as student_name 
            FROM attendance a 
            JOIN students s ON a.student_id = s.id 
            ORDER BY a.date DESC
        `);
        return result.rows;
    }

    static async getByStudent(studentId) {
        const result = await pool.query(
            'SELECT * FROM attendance WHERE student_id = $1 ORDER BY date DESC',
            [studentId]
        );
        return result.rows;
    }

    static async create(attendanceData) {
        const { student_id, date, status } = attendanceData;
        const result = await pool.query(
            'INSERT INTO attendance (student_id, date, status) VALUES ($1, $2, $3) RETURNING *',
            [student_id, date, status]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM attendance WHERE id = $1', [id]);
    }

    static async checkDuplicate(studentId, date) {
        const result = await pool.query(
            'SELECT * FROM attendance WHERE student_id = $1 AND date = $2',
            [studentId, date]
        );
        return result.rows[0];
    }
}

module.exports = Attendance;