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

const initDb = async () => {
  const connection = await pool.getConnection();
  try {
    // Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        emp_id VARCHAR(50) UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'HR', 'Employee') DEFAULT 'Employee',
        reset_token VARCHAR(255),
        reset_token_expire DATETIME,
        otp VARCHAR(10),
        otp_expire DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Migration: Add emp_id and role if they don't exist (for existing tables)
    try {
      const [columns] = await connection.query("SHOW COLUMNS FROM users LIKE 'emp_id'");
      if (columns.length === 0) {
        console.log('⚠️ Migrating users table: Adding emp_id and role columns...');
        await connection.query(`
          ALTER TABLE users 
          ADD COLUMN emp_id VARCHAR(50) UNIQUE AFTER id,
          ADD COLUMN role ENUM('Admin', 'HR', 'Employee') DEFAULT 'Employee' AFTER password_hash
        `);
        console.log('✅ Migration successful');
      }

      // Migration: Add company_name if it doesn't exist
      const [companyCol] = await connection.query("SHOW COLUMNS FROM users LIKE 'company_name'");
      if (companyCol.length === 0) {
        console.log('⚠️ Migrating users table: Adding company_name column...');
        await connection.query(`
          ALTER TABLE users 
          ADD COLUMN company_name VARCHAR(255) AFTER name
        `);
        console.log('✅ Migration successful: company_name added');
      }

      // Migration: Add company_logo if it doesn't exist
      const [logoCol] = await connection.query("SHOW COLUMNS FROM users LIKE 'company_logo'");
      if (logoCol.length === 0) {
        console.log('⚠️ Migrating users table: Adding company_logo column...');
        await connection.query(`
          ALTER TABLE users 
          ADD COLUMN company_logo VARCHAR(255) AFTER company_name
        `);
        console.log('✅ Migration successful: company_logo added');
      }
    } catch (err) {
      console.error('Migration warning:', err.message);
    }

    // Profiles Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        address TEXT,
        phone VARCHAR(20),
        job_title VARCHAR(100),
        department VARCHAR(100),
        salary_base DECIMAL(10, 2) DEFAULT 0.00,
        date_of_birth DATE,
        joining_date DATE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Attendance Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE NOT NULL,
        check_in TIME,
        check_out TIME,
        status ENUM('Present', 'Absent', 'Late', 'Half Day', 'On Leave') DEFAULT 'Absent',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_attendance (user_id, date)
      )
    `);

    // Leaves Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS leaves (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        leave_type ENUM('Paid', 'Sick', 'Unpaid', 'Casual') NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        remarks TEXT,
        status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Payroll Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payroll (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        month VARCHAR(20) NOT NULL,
        year INT NOT NULL,
        basic_salary DECIMAL(10, 2) NOT NULL,
        allowances DECIMAL(10, 2) DEFAULT 0.00,
        deductions DECIMAL(10, 2) DEFAULT 0.00,
        net_salary DECIMAL(10, 2) NOT NULL,
        status ENUM('Pending', 'Paid') DEFAULT 'Pending',
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables checked/created');
  } catch (error) {
    console.error('❌ Error initializing database tables:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Optional helper to verify connectivity at startup
export const verifyConnection = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    console.log('✅ MySQL connection verified');
    await initDb();
  } finally {
    connection.release();
  }
};

export default pool;