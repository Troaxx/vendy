const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'your_own_user',
    password: 'your_own_password',
    database: 'vending_machine',
};

// Create a pool instead of a single connection
const db = mysql.createPool(dbConfig);

// Test the connection
async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log('Connected to database.');
        connection.release();
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

testConnection();

module.exports = db;

