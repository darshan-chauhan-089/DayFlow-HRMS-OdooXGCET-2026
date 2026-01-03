import pool from '../config/db.js';

const formatDateForDB = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
};

export const upsertProfile = async (userId, profileData) => {
  const {
    address = null,
    phone = null,
    jobTitle = null,
    department = null,
    salaryBase = null,
    dateOfBirth = null,
    joiningDate = null,
    nationality = null,
    personalEmail = null,
    gender = null,
    maritalStatus = null,
    bankAccountNo = null,
    bankName = null,
    ifscCode = null,
    panNo = null,
    uanNo = null,
    about = null,
    whatILoveAboutMyJob = null,
    interestsAndHobbies = null,
    skills = [],
    certifications = [],
    workingDays = null,
    breakTime = null,
    manager = null,
    workLocation = null
  } = profileData;

  const formattedDateOfBirth = formatDateForDB(dateOfBirth);
  const formattedJoiningDate = formatDateForDB(joiningDate);

  const skillsStr = Array.isArray(skills) ? JSON.stringify(skills) : skills;
  const certificationsStr = Array.isArray(certifications) ? JSON.stringify(certifications) : certifications;

  // Check if profile exists
  const [existing] = await pool.execute('SELECT id FROM profiles WHERE user_id = ?', [userId]);

  if (existing.length > 0) {
    // Update
    await pool.execute(
      `UPDATE profiles 
       SET address = ?, phone = ?, job_title = ?, department = ?, salary_base = ?, date_of_birth = ?, joining_date = ?,
           nationality = ?, personal_email = ?, gender = ?, marital_status = ?, 
           bank_account_no = ?, bank_name = ?, ifsc_code = ?, pan_no = ?, uan_no = ?,
           about = ?, what_i_love_about_my_job = ?, interests_and_hobbies = ?, skills = ?, certifications = ?,
           working_days = ?, break_time = ?, manager = ?, work_location = ?
       WHERE user_id = ?`,
      [address, phone, jobTitle, department, salaryBase, formattedDateOfBirth, formattedJoiningDate,
        nationality, personalEmail, gender, maritalStatus,
        bankAccountNo, bankName, ifscCode, panNo, uanNo,
        about, whatILoveAboutMyJob, interestsAndHobbies, skillsStr, certificationsStr,
        workingDays, breakTime, manager, workLocation,
        userId]
    );
    return { id: existing[0].id, userId, ...profileData };
  } else {
    // Insert
    const [result] = await pool.execute(
      `INSERT INTO profiles (user_id, address, phone, job_title, department, salary_base, date_of_birth, joining_date,
           nationality, personal_email, gender, marital_status, 
           bank_account_no, bank_name, ifsc_code, pan_no, uan_no,
           about, what_i_love_about_my_job, interests_and_hobbies, skills, certifications, working_days, break_time, manager, work_location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, address, phone, jobTitle, department, salaryBase, formattedDateOfBirth, formattedJoiningDate,
        nationality, personalEmail, gender, maritalStatus,
        bankAccountNo, bankName, ifscCode, panNo, uanNo,
        about, whatILoveAboutMyJob, interestsAndHobbies, skillsStr, certificationsStr, workingDays, breakTime, manager, workLocation]
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

export const updateProfileAvatar = async (userId, avatarPath) => {
  // Check if profile exists
  const [existing] = await pool.execute('SELECT id FROM profiles WHERE user_id = ?', [userId]);

  if (existing.length > 0) {
    // Update existing profile
    await pool.execute(
      `UPDATE profiles SET avatar = ? WHERE user_id = ?`,
      [avatarPath, userId]
    );
  } else {
    // Insert new profile with avatar
    await pool.execute(
      `INSERT INTO profiles (user_id, avatar) VALUES (?, ?)`,
      [userId, avatarPath]
    );
  }

  // Return updated profile
  return await getProfileByUserId(userId);
};
