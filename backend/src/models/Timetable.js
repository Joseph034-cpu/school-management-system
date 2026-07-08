const pool = require('../config/database');

class Timetable {
    static async getAll() {
        const result = await pool.query(`
            SELECT t.*, c.name as course_name 
            FROM timetable t 
            JOIN courses c ON t.course_id = c.id 
            ORDER BY t.day, t.time_slot
        `);
        return result.rows;
    }

    static async create(data) {
        const { day, course_id, time_slot } = data;
        const result = await pool.query(
            'INSERT INTO timetable (day, course_id, time_slot) VALUES ($1, $2, $3) RETURNING *',
            [day, course_id, time_slot]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM timetable WHERE id = $1', [id]);
    }
}

module.exports = Timetable;