const pool = require('../config/database');

class User {
    static async findByUsername(username) {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query(
            'SELECT id, username, role, full_name, department, email FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async create(userData) {
        const { username, password, role, full_name, department, email, security_question, security_answer } = userData;
        const result = await pool.query(
            `INSERT INTO users (username, password, role, full_name, department, email, security_question, security_answer)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, username, role, full_name`,
            [username, password, role, full_name, department, email, security_question, security_answer]
        );
        return result.rows[0];
    }

    static async getAll() {
        const result = await pool.query(
            'SELECT id, username, role, full_name, department, email, created_at FROM users ORDER BY id DESC'
        );
        return result.rows;
    }

    static async updatePassword(username, newPassword) {
        await pool.query(
            'UPDATE users SET password = $1 WHERE username = $2',
            [newPassword, username]
        );
    }

    static async deleteByUsername(username) {
        await pool.query('DELETE FROM users WHERE username = $1', [username]);
    }

    static async getSecurityQuestion(username) {
        const result = await pool.query(
            'SELECT security_question, security_answer FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0];
    }

    static async checkExists(username) {
        const result = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0];
    }
}

module.exports = User;