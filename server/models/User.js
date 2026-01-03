import pool from '../config/db.js';

const mapUserRow = (row) => ({
  id: row.id,
  empId: row.emp_id,
  name: row.name,
  companyName: row.company_name,
  companyLogo: row.company_logo,
  email: row.email,
  passwordHash: row.password_hash,
  role: row.role,
  resetToken: row.reset_token,
  resetTokenExpire: row.reset_token_expire,
  otp: row.otp,
  otpExpire: row.otp_expire,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const createUser = async ({ empId, name, companyName, companyLogo, email, passwordHash, role }) => {
  const [result] = await pool.execute(
    `INSERT INTO users (emp_id, name, company_name, company_logo, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [empId, name, companyName, companyLogo, email, passwordHash, role || 'Employee']
  );

  return {
    id: result.insertId,
    empId,
    name,
    companyName,
    companyLogo,
    email,
    role: role || 'Employee',
  };
};

export const countUsersByYear = async (year) => {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) as count FROM users WHERE YEAR(created_at) = ?`,
    [year]
  );
  return rows[0].count;
};

export const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    `SELECT id, emp_id, name, company_name, company_logo, email, password_hash, role, reset_token, reset_token_expire, otp, otp_expire, created_at, updated_at
     FROM users WHERE email = ? LIMIT 1`,
    [email]
  );

  if (!rows.length) return null;
  return mapUserRow(rows[0]);
};

export const findByEmailOrEmpId = async (identifier) => {
  const [rows] = await pool.execute(
    `SELECT id, emp_id, name, company_name, company_logo, email, password_hash, role, reset_token, reset_token_expire, otp, otp_expire, created_at, updated_at
     FROM users WHERE email = ? OR emp_id = ? LIMIT 1`,
    [identifier, identifier]
  );

  if (!rows.length) return null;
  return mapUserRow(rows[0]);
};

export const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, emp_id, name, company_name, company_logo, email, password_hash, role, reset_token, reset_token_expire, otp, otp_expire, created_at, updated_at
     FROM users WHERE id = ? LIMIT 1`,
    [id]
  );

  if (!rows.length) return null;
  return mapUserRow(rows[0]);
};

export const findByResetToken = async (hashedToken) => {
  const [rows] = await pool.execute(
    `SELECT id, name, email, password_hash, reset_token, reset_token_expire, otp, otp_expire, created_at, updated_at
     FROM users
     WHERE reset_token = ? AND reset_token_expire IS NOT NULL AND reset_token_expire > NOW()
     LIMIT 1`,
    [hashedToken]
  );

  if (!rows.length) return null;
  return mapUserRow(rows[0]);
};

export const findByEmailAndOTP = async (email, hashedOtp) => {
  const [rows] = await pool.execute(
    `SELECT id, name, email, password_hash, reset_token, reset_token_expire, otp, otp_expire, created_at, updated_at
     FROM users
     WHERE email = ? AND otp = ? AND otp_expire IS NOT NULL AND otp_expire > NOW()
     LIMIT 1`,
    [email, hashedOtp]
  );

  if (!rows.length) return null;
  return mapUserRow(rows[0]);
};

export const updatePassword = async (id, passwordHash) => {
  await pool.execute(
    `UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expire = NULL, otp = NULL, otp_expire = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [passwordHash, id]
  );
};

export const setResetToken = async (id, hashedToken, expireAt) => {
  await pool.execute(
    `UPDATE users SET reset_token = ?, reset_token_expire = ? WHERE id = ?`,
    [hashedToken, expireAt, id]
  );
};

export const clearResetToken = async (id) => {
  await pool.execute(
    `UPDATE users SET reset_token = NULL, reset_token_expire = NULL WHERE id = ?`,
    [id]
  );
};

export const setOtp = async (id, hashedOtp, expireAt) => {
  await pool.execute(
    `UPDATE users SET otp = ?, otp_expire = ? WHERE id = ?`,
    [hashedOtp, expireAt, id]
  );
};

export const clearOtp = async (id) => {
  await pool.execute(
    `UPDATE users SET otp = NULL, otp_expire = NULL WHERE id = ?`,
    [id]
  );
};

export const getAllUsersWithStatus = async () => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const [users] = await pool.execute(`
    SELECT
      u.id,
      u.emp_id,
      u.name,
      u.email,
      u.role,
      p.job_title,
      p.avatar,
      CASE
        WHEN l.status = 'Approved' AND ? BETWEEN l.start_date AND l.end_date THEN 'On Leave'
        WHEN a.id IS NOT NULL AND a.check_out IS NULL THEN 'Present'
        ELSE 'Absent'
      END AS attendance_status
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
    LEFT JOIN (
      SELECT * FROM attendance WHERE date = ?
    ) a ON u.id = a.user_id
    LEFT JOIN (
      SELECT * FROM leaves WHERE status = 'Approved'
    ) l ON u.id = l.user_id AND ? BETWEEN l.start_date AND l.end_date
    WHERE u.role != 'Admin'
  `, [today, today, today]);

  return users;
};
