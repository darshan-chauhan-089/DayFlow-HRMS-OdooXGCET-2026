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
  // Get the check-in record
  const [records] = await pool.execute(
    `SELECT check_in FROM attendance WHERE user_id = ? AND date = ?`,
    [userId, date]
  );
  
  if (records.length === 0) {
    throw new Error('No check-in record found for today');
  }

  // Calculate working hours (excluding break)
  const checkInTime = new Date(`2000-01-01 ${records[0].check_in}`);
  const checkOutTime = new Date(`2000-01-01 ${time}`);
  const totalMinutes = (checkOutTime - checkInTime) / (1000 * 60);
  
  const [breakData] = await pool.execute(
    `SELECT break_duration_minutes FROM attendance WHERE user_id = ? AND date = ?`,
    [userId, date]
  );

  const breakDuration = breakData[0]?.break_duration_minutes || 0;
  const workingMinutes = Math.max(0, totalMinutes - breakDuration);
  const workingHours = parseFloat((workingMinutes / 60).toFixed(2));

  // Determine status based on working hours
  let status = 'Present';
  if (workingHours < 4) {
    status = 'Absent';
  } else if (workingHours < 7.5) {
    status = 'Half Day';
  }

  const [result] = await pool.execute(
    `UPDATE attendance SET check_out = ?, working_hours = ?, status = ?, updated_at = NOW() WHERE user_id = ? AND date = ?`,
    [time, workingHours, status, userId, date]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('No check-in record found for today');
  }
  return true;
};

export const recordBreak = async (userId, date, breakStart, breakEnd) => {
  const breakStartTime = new Date(`2000-01-01 ${breakStart}`);
  const breakEndTime = new Date(`2000-01-01 ${breakEnd}`);
  const breakDurationMinutes = Math.max(0, (breakEndTime - breakStartTime) / (1000 * 60));

  const [result] = await pool.execute(
    `UPDATE attendance SET break_start = ?, break_end = ?, break_duration_minutes = ?, updated_at = NOW() WHERE user_id = ? AND date = ?`,
    [breakStart, breakEnd, Math.round(breakDurationMinutes), userId, date]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('No attendance record found for today');
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

export const findAttendanceByUserAndMonth = async (userId, year, month) => {
  const [rows] = await pool.execute(
    `SELECT * FROM attendance WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ? ORDER BY date ASC`,
    [userId, year, month]
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

export const getAllTodayAttendance = async (date) => {
  const [rows] = await pool.execute(
    `SELECT a.*, u.name, u.emp_id, p.job_title, p.department 
     FROM attendance a 
     JOIN users u ON a.user_id = u.id 
     LEFT JOIN profiles p ON u.id = p.user_id 
     WHERE a.date = ? AND a.check_in IS NOT NULL
     ORDER BY u.name ASC`,
    [date]
  );
  return rows;
};

export const getMonthlyStats = async (userId, year, month) => {
  const [rows] = await pool.execute(
    `SELECT 
      COUNT(*) as total_days,
      SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_days,
      SUM(CASE WHEN status = 'Half Day' THEN 1 ELSE 0 END) as half_days,
      SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent_days,
      SUM(CASE WHEN status = 'On Leave' THEN 1 ELSE 0 END) as leave_days,
      ROUND(SUM(working_hours), 2) as total_working_hours
     FROM attendance 
     WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?`,
    [userId, year, month]
  );
  return rows[0];
};

