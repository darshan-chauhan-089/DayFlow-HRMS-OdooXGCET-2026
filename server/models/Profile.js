import pool from '../config/db.js';

export const upsertProfile = async (userId, profileData) => {
  const { 
    address = null, 
    phone = null, 
    jobTitle = null, 
    department = null, 
    salaryBase = null, 
    dateOfBirth = null, 
    joiningDate = null 
  } = profileData;
  
  // Check if profile exists
  const [existing] = await pool.execute('SELECT id FROM profiles WHERE user_id = ?', [userId]);

  if (existing.length > 0) {
    // Update
    await pool.execute(
      `UPDATE profiles 
       SET address = ?, phone = ?, job_title = ?, department = ?, salary_base = ?, date_of_birth = ?, joining_date = ?
       WHERE user_id = ?`,
      [address, phone, jobTitle, department, salaryBase, dateOfBirth, joiningDate, userId]
    );
    return { id: existing[0].id, userId, ...profileData };
  } else {
    // Insert
    const [result] = await pool.execute(
      `INSERT INTO profiles (user_id, address, phone, job_title, department, salary_base, date_of_birth, joining_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, address, phone, jobTitle, department, salaryBase, dateOfBirth, joiningDate]
    );
    return { id: result.insertId, userId, ...profileData };
  }
};

export const getProfileByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT p.*, u.name, u.email, u.role, u.emp_id 
     FROM profiles p 
     RIGHT JOIN users u ON p.user_id = u.id 
     WHERE u.id = ?`,
    [userId]
  );
  return rows[0];
};
