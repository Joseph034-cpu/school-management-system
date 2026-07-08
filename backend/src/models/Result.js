const pool = require('../config/database');

class Result {
    static async getAll() {
        const result = await pool.query(`
            SELECT r.*, s.name as student_name, c.name as course_name 
            FROM results r 
            JOIN students s ON r.student_id = s.id 
            JOIN courses c ON r.course_id = c.id 
            ORDER BY r.created_at DESC
        `);
        return result.rows;
    }

    static async getByStudent(studentId) {
        const result = await pool.query(`
            SELECT r.*, c.name as course_name 
            FROM results r 
            JOIN courses c ON r.course_id = c.id 
            WHERE r.student_id = $1 
            ORDER BY r.created_at DESC
        `, [studentId]);
        return result.rows;
    }

    static async create(resultData) {
        const { student_id, course_id, marks, grade } = resultData;
        const result = await pool.query(
            'INSERT INTO results (student_id, course_id, marks, grade) VALUES ($1, $2, $3, $4) RETURNING *',
            [student_id, course_id, marks, grade]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM results WHERE id = $1', [id]);
    }

    static async checkDuplicate(studentId, courseId) {
        const result = await pool.query(
            'SELECT * FROM results WHERE student_id = $1 AND course_id = $2',
            [studentId, courseId]
        );
        return result.rows[0];
    }
}

module.exports = Result;