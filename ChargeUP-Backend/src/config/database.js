// src/config/database.js
// NOTE: dotenv is loaded once with override:true in app.js before this module is required.
// Do NOT add require('dotenv').config() here — it would inject 0 vars on nodemon restarts.
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'chargeup_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Mahesh@11',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set to console.log to see raw SQL queries
  }
);

// Test database connection
sequelize.authenticate()
  .then(() => console.log('✅ Sequelize MySQL connected successfully.'))
  .catch((err) => console.error('❌ Unable to connect to database:', err.message));

module.exports = sequelize; // Export instance directly