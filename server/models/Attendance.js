import pool from '../config/db.js';

export const createCheckIn = async (userId, date, time) => {
  // Check if already checked in
  const [existing] = await pool.execute(
    'SELECT id FROM attendance WHERE user_id = ? AND date = ?',
    [userId, date]
  );

  if (existing.length > 0) {
    throw new Error('Already checked in for today');
  }

  const [result] = await pool.execute(
    `INSERT INTO attendance (user_id, date, check_in, status) VALUES (?, ?, ?, 'Present')`,
    [userId, date, time]
  );
  return result.insertId;
};

export const updateCheckOut = async (userId, date, time) => {
  const [result] = await pool.execute(
    `UPDATE attendance SET check_out = ? WHERE user_id = ? AND date = ?`,
    [time, userId, date]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('No check-in record found for today');
  }
  return true;
};

export const findAttendanceByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC`,
    [userId]
  );
  return rows;
};

export const getTodayAttendance = async (userId, date) => {
  const [rows] = await pool.execute(
    `SELECT * FROM attendance WHERE user_id = ? AND date = ?`,
    [userId, date]
  );
  return rows[0];
};
