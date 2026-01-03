-- Database Schema for DayFlow HRMS

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    company_logo VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'HR', 'Employee') DEFAULT 'Employee',
    reset_token VARCHAR(255),
    reset_token_expire DATETIME,
    otp VARCHAR(10),
    otp_expire DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Profiles Table (Employee Details)
CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    avatar VARCHAR(255),
    salary_base DECIMAL(10, 2) DEFAULT 0.00,
    date_of_birth DATE,
    joining_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    break_start TIME,
    break_end TIME,
    break_duration_minutes INT DEFAULT 0,
    working_hours DECIMAL(5, 2) DEFAULT 0.00,
    status ENUM('Present', 'Absent', 'Late', 'Half Day', 'On Leave') DEFAULT 'Absent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (user_id, date)
);

-- Leaves Table
CREATE TABLE IF NOT EXISTS leaves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    leave_type ENUM('Paid', 'Sick', 'Unpaid', 'Casual') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    remarks TEXT,
    admin_comments TEXT,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payroll Table
CREATE TABLE IF NOT EXISTS payroll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    basic_salary DECIMAL(10, 2) NOT NULL,
    total_working_days INT DEFAULT 0,
    present_days INT DEFAULT 0,
    half_days INT DEFAULT 0,
    absent_days INT DEFAULT 0,
    paid_leave_days INT DEFAULT 0,
    unpaid_leave_days INT DEFAULT 0,
    payable_days DECIMAL(5, 2) DEFAULT 0.00,
    per_day_rate DECIMAL(10, 2) DEFAULT 0.00,
    allowances DECIMAL(10, 2) DEFAULT 0.00,
    deductions DECIMAL(10, 2) DEFAULT 0.00,
    gross_salary DECIMAL(10, 2) NOT NULL,
    net_salary DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Generated', 'Paid') DEFAULT 'Pending',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_payroll (user_id, year, month)
);
