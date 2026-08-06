// src/config/db.js
// Production-Ready MySQL2 Connection Pool setup using Promises
const mysql = require('mysql2/promise');

// Create MySQL Pool Instance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Mahesh@11',
  database: process.env.DB_NAME || 'chargeup_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test Connection Pool Health
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ mysql2/promise Connection Pool successfully established.');
    connection.release();
  } catch (error) {
    console.error('⚠️ Warning: mysql2 pool connection failure:', error.message);
  }
})();

module.exports = pool;
