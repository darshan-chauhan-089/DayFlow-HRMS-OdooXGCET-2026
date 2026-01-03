import pool from '../config/db.js';
import { findAttendanceByUserAndMonth, getMonthlyStats } from './Attendance.js';
import { getProfileByUserId } from './Profile.js';

// Calculate payroll based on attendance and leaves
export const generatePayroll = async (userId, year, month) => {
  try {
    // Get user profile and salary info
    const profile = await getProfileByUserId(userId);
    if (!profile) {
      throw new Error('User profile not found');
    }

    const basicSalary = profile.salary_base || 0;
    if (basicSalary === 0) {
      throw new Error('Basic salary not configured for this employee');
    }

    // Get monthly attendance stats
    const stats = await getMonthlyStats(userId, year, month);
    
    // Get leave records for the month
    const [leaveRecords] = await pool.execute(
      `SELECT 
        SUM(CASE WHEN leave_type = 'Paid' AND status = 'Approved' THEN DATEDIFF(end_date, start_date) + 1 ELSE 0 END) as paid_leave_days,
        SUM(CASE WHEN leave_type = 'Unpaid' AND status = 'Approved' THEN DATEDIFF(end_date, start_date) + 1 ELSE 0 END) as unpaid_leave_days
       FROM leaves 
       WHERE user_id = ? AND YEAR(start_date) = ? AND MONTH(start_date) = ?`,
      [userId, year, month]
    );

    const paidLeaveDays = leaveRecords[0]?.paid_leave_days || 0;
    const unpaidLeaveDays = leaveRecords[0]?.unpaid_leave_days || 0;

    // Calculate payable days
    // Formula: Present days + (Half days * 0.5) + Paid leave days - Unpaid leave days
    const presentDays = stats?.present_days || 0;
    const halfDays = stats?.half_days || 0;
    const workingDays = presentDays + (halfDays * 0.5) + paidLeaveDays;
    
    // Assuming standard working days per month is 22
    const totalWorkingDays = 22;
    const payableDays = Math.max(0, workingDays - unpaidLeaveDays);
    const perDayRate = basicSalary / totalWorkingDays;
    const grossSalary = perDayRate * payableDays;

    // Check if payroll already exists
    const [existing] = await pool.execute(
      'SELECT id FROM payroll WHERE user_id = ? AND year = ? AND month = ?',
      [userId, year, month]
    );

    let payrollId;
    if (existing.length > 0) {
      // Update existing payroll
      payrollId = existing[0].id;
      await pool.execute(
        `UPDATE payroll 
         SET total_working_days = ?, present_days = ?, half_days = ?, absent_days = ?, 
             paid_leave_days = ?, unpaid_leave_days = ?, payable_days = ?, 
             per_day_rate = ?, gross_salary = ?, net_salary = ?, status = 'Generated', updated_at = NOW()
         WHERE id = ?`,
        [
          totalWorkingDays,
          presentDays,
          halfDays,
          stats?.absent_days || 0,
          paidLeaveDays,
          unpaidLeaveDays,
          payableDays.toFixed(2),
          perDayRate.toFixed(2),
          grossSalary.toFixed(2),
          grossSalary.toFixed(2),
          payrollId
        ]
      );
    } else {
      // Create new payroll
      const [result] = await pool.execute(
        `INSERT INTO payroll 
         (user_id, month, year, basic_salary, total_working_days, present_days, half_days, 
          absent_days, paid_leave_days, unpaid_leave_days, payable_days, per_day_rate, 
          gross_salary, net_salary, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Generated')`,
        [
          userId,
          month,
          year,
          basicSalary,
          totalWorkingDays,
          presentDays,
          halfDays,
          stats?.absent_days || 0,
          paidLeaveDays,
          unpaidLeaveDays,
          payableDays.toFixed(2),
          perDayRate.toFixed(2),
          grossSalary.toFixed(2),
          grossSalary.toFixed(2)
        ]
      );
      payrollId = result.insertId;
    }

    return {
      id: payrollId,
      userId,
      month,
      year,
      basicSalary,
      totalWorkingDays,
      presentDays,
      halfDays,
      absentDays: stats?.absent_days || 0,
      paidLeaveDays,
      unpaidLeaveDays,
      payableDays: parseFloat(payableDays.toFixed(2)),
      perDayRate: parseFloat(perDayRate.toFixed(2)),
      grossSalary: parseFloat(grossSalary.toFixed(2)),
      netSalary: parseFloat(grossSalary.toFixed(2)),
    };
  } catch (error) {
    throw new Error(`Failed to generate payroll: ${error.message}`);
  }
};

export const getPayrollByUserAndMonth = async (userId, year, month) => {
  const [rows] = await pool.execute(
    `SELECT * FROM payroll WHERE user_id = ? AND year = ? AND month = ?`,
    [userId, year, month]
  );
  return rows[0];
};

export const getUserPayrollHistory = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM payroll WHERE user_id = ? ORDER BY year DESC, month DESC`,
    [userId]
  );
  return rows;
};

export const getAllPayrollByMonth = async (year, month) => {
  const [rows] = await pool.execute(
    `SELECT p.*, u.name, u.emp_id, pr.department, pr.job_title
     FROM payroll p
     JOIN users u ON p.user_id = u.id
     LEFT JOIN profiles pr ON u.id = pr.user_id
     WHERE p.year = ? AND p.month = ?
     ORDER BY u.name ASC`,
    [year, month]
  );
  return rows;
};

export const updatePayrollStatus = async (payrollId, status) => {
  const [result] = await pool.execute(
    `UPDATE payroll SET status = ?, updated_at = NOW() WHERE id = ?`,
    [status, payrollId]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Payroll record not found');
  }
  return true;
};

export const updatePayrollDeductions = async (payrollId, allowances, deductions) => {
  const [payroll] = await pool.execute(
    `SELECT gross_salary FROM payroll WHERE id = ?`,
    [payrollId]
  );

  if (payroll.length === 0) {
    throw new Error('Payroll record not found');
  }

  const netSalary = payroll[0].gross_salary + allowances - deductions;

  const [result] = await pool.execute(
    `UPDATE payroll SET allowances = ?, deductions = ?, net_salary = ?, updated_at = NOW() WHERE id = ?`,
    [allowances, deductions, netSalary, payrollId]
  );

  if (result.affectedRows === 0) {
    throw new Error('Payroll record not found');
  }
  
  return { allowances, deductions, netSalary };
};
