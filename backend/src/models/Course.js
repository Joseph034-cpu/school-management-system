const pool = require('../config/database');

class Course {
    static async getAll() {
        const result = await pool.query('SELECT * FROM courses ORDER BY id DESC');
        return result.rows;
    }

    static async create(courseData) {
        const { name, code, description } = courseData;
        const result = await pool.query(
            'INSERT INTO courses (name, code, description) VALUES ($1, $2, $3) RETURNING *',
            [name, code, description]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    }
}

module.exports = Course;