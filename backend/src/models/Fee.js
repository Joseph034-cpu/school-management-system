const pool = require('../config/database');

class Fee {
    static async getAll() {
        const result = await pool.query(`
            SELECT f.*, s.name as student_name 
            FROM fees f 
            JOIN students s ON f.student_id = s.id 
            ORDER BY f.payment_date DESC
        `);
        return result.rows;
    }

    static async getByStudent(studentId) {
        const result = await pool.query(
            'SELECT * FROM fees WHERE student_id = $1 ORDER BY payment_date DESC',
            [studentId]
        );
        return result.rows;
    }

    static async create(feeData) {
        const { student_id, amount, payment_date, receipt_id } = feeData;
        const result = await pool.query(
            'INSERT INTO fees (student_id, amount, payment_date, receipt_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [student_id, amount, payment_date, receipt_id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM fees WHERE id = $1', [id]);
    }

    static async getTotal(studentId) {
        const result = await pool.query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM fees WHERE student_id = $1',
            [studentId]
        );
        return result.rows[0].total;
    }
}

module.exports = Fee;