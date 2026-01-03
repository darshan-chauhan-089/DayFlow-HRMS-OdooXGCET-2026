import mysql from 'mysql2/promise';
import env from './env.js';

// Debug: log environment variables
console.log('🔍 DB Config:', {
  host: env.DB_HOST,
  port: env.DB_PORT || 3306,
  user: env.DB_USER,
  database: env.DB_NAME,
  hasPassword: !!env.DB_PASS
});

// Create and export a MySQL connection pool (promise-based)
const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT || 3306,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Optional helper to verify connectivity at startup
export const verifyConnection = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    console.log('✅ MySQL connection verified');
  } finally {
    connection.release();
  }
};

export default pool;