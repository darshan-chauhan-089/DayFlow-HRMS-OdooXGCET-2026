import pool from '../config/db.js';

const mapLeaveRow = (row) => ({
  id: row.id,
  userId: row.user_id,
  leaveType: row.leave_type,
  startDate: row.start_date,
  endDate: row.end_date,
  remarks: row.remarks,
  adminComments: row.admin_comments,
  status: row.status,
  appliedAt: row.applied_at,
  updatedAt: row.updated_at,
  // Optional: Include user details if joined
  userName: row.user_name,
  userEmail: row.user_email,
});

export const createLeave = async ({ userId, leaveType, startDate, endDate, remarks }) => {
  const [result] = await pool.execute(
    `INSERT INTO leaves (user_id, leave_type, start_date, end_date, remarks) VALUES (?, ?, ?, ?, ?)`,
    [userId, leaveType, startDate, endDate, remarks]
  );
  return result.insertId;
};

export const findLeavesByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT l.*, u.name as user_name, u.email as user_email 
     FROM leaves l 
     JOIN users u ON l.user_id = u.id 
     WHERE l.user_id = ? 
     ORDER BY l.applied_at DESC`,
    [userId]
  );
  return rows.map(mapLeaveRow);
};

export const findLeaveById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT l.*, u.name as user_name, u.email as user_email 
     FROM leaves l 
     JOIN users u ON l.user_id = u.id 
     WHERE l.id = ?`,
    [id]
  );
  return rows.length > 0 ? mapLeaveRow(rows[0]) : null;
};

export const findAllLeaves = async () => {
  const [rows] = await pool.execute(
    `SELECT l.*, u.name as user_name, u.email as user_email 
     FROM leaves l 
     JOIN users u ON l.user_id = u.id 
     ORDER BY l.applied_at DESC`
  );
  return rows.map(mapLeaveRow);
};

export const updateLeaveStatus = async (id, status, adminComments = null) => {
  const [result] = await pool.execute(
    `UPDATE leaves SET status = ?, admin_comments = ?, updated_at = NOW() WHERE id = ?`,
    [status, adminComments, id]
  );
  return result.affectedRows > 0;
};

export const addAdminComment = async (id, comment) => {
  const [result] = await pool.execute(
    `UPDATE leaves SET admin_comments = ? WHERE id = ?`,
    [comment, id]
  );
  return result.affectedRows > 0;
};
