const pool = require('../config/database');

class Student {
    static async getAll() {
        const result = await pool.query('SELECT * FROM students ORDER BY id DESC');
        return result.rows;
    }

    static async create(studentData) {
        const { name, admission, course } = studentData;
        const result = await pool.query(
            'INSERT INTO students (name, admission, course) VALUES ($1, $2, $3) RETURNING *',
            [name, admission, course]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM students WHERE id = $1', [id]);
    }

    static async search(query) {
        const result = await pool.query(
            "SELECT * FROM students WHERE name ILIKE $1 OR admission ILIKE $1",
            [`%${query}%`]
        );
        return result.rows;
    }
}

module.exports = Student;