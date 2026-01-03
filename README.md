# DayFlow – Human Resources Management System  
### Odoo × GCET Hackathon 2026  

🎥 **Project Demo Video**  
👉 https://youtu.be/wj3qPYcLyAg  

---

## 📌 Project Overview

**DayFlow** is a role-based **Human Resources Management System (HRMS)** developed as part of the **Odoo × GCET Hackathon 2026**.  
The objective of this project is to **digitize and streamline daily HR operations** such as employee onboarding, attendance tracking, leave management, payroll visibility, and approval workflows.

The system strictly follows the **problem statement and wireframes provided during the hackathon**, focusing on:
- Clean workflows
- Role-based access control
- Secure authentication
- Real-time updates for HR operations

---

## 🧰 Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Token)
- **Email Service:** SMTP (Gmail App Password)

---

## 🚀 Features & Functionality

### 🔐 Authentication & Authorization
- Secure Sign Up and Sign In
- JWT-based authentication
- Role-based access:
  - **Admin / HR**
  - **Employee**

---

### 🧑‍💼 Employee Module
- View personal profile
- Edit limited profile details (address, phone, profile picture)
- Check-in / Check-out attendance
- View daily and weekly attendance records
- Apply for leave (Paid, Sick, Unpaid)
- Track leave status:
  - Pending
  - Approved
  - Rejected
- View payroll details (read-only)

---

### 🛠️ Admin / HR Module
- Manage employee records
- View and edit all employee profiles
- Monitor attendance of all employees
- Approve or reject leave requests with comments
- Manage payroll and salary structure
- Switch between employee views from the dashboard

---

### 📊 Attendance & Leave Management
- Attendance status types:
  - Present
  - Absent
  - Half-Day
  - Leave
- Daily and weekly attendance views
- Real-time updates after admin approval/rejection

---

### 💰 Payroll Management
- Employees can view salary details (read-only)
- Admin has full payroll control
- Clear separation of payroll access permissions

---

## 🧩 Project Structure

```text
DayFlow-HRMS-OdooXGCET-2026
│
├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── .env
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   ├── .env
│   └── vite.config.js
│
└── README.md

```
---

## 🗄️ MySQL Database (Backend Data Layer)

### Database Used

* **MySQL**
* Database Name: `Dayflow_HRMS`

### Key Tables (Logical Design)

* `users` – authentication & roles
* `employees` – profile & job details
* `attendance` – daily attendance records
* `leaves` – leave requests & status
* `payroll` – salary information

The database follows **relational design**, ensuring:

* One-to-many relationships (Employee → Attendance, Leaves)
* Role-based filtering at API level
* Data integrity and security

---

## ⚙️ Local Installation & Setup Guide

### 🧩 Prerequisites

Ensure the following are installed:

* Node.js (v18 or above)
* Git
* MySQL Server

👉 If MySQL is not installed, follow this tutorial:
[https://www.youtube.com/watch?v=hiS_mWZmmI0](https://www.youtube.com/watch?v=hiS_mWZmmI0)

---

## 📥 Clone the Repository

```bash
git clone https://github.com/darshan-chauhan-089/DayFlow-HRMS-OdooXGCET-2026.git
cd DayFlow-HRMS-OdooXGCET-2026
```

---

## 🗄️ MySQL Setup (From Scratch)

1. Open MySQL Workbench or CLI
2. Create the database:

```sql
CREATE DATABASE Dayflow_HRMS;
```

3. Ensure MySQL is running on:

* Host: `localhost`
* Port: `3306`

---

## 🔧 Backend Setup (Node + Express)

### Step 1: Go to Backend Folder

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create `.env` File (Backend)

```env
# JWT Configuration
JWT_SECRET=20204da8cfd2263cbab951c2380bda0b
JWT_EXPIRE=7d

# Server Configuration
PORT=5000

# Email Configuration (Gmail)
# Enable 2-Step Verification and use App Password
# https://myaccount.google.com/apppasswords
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=darshanchauhan089@gmail.com
EMAIL_PASSWORD=klzt qlxg kbcj elei
EMAIL_FROM=darshanchauhan089@gmail.com
EMAIL_FROM_NAME=DayFlow HRMS

NODE_ENV=development

# MySQL Database Connection
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=<Your-Connection-Password>
DB_NAME=Dayflow_HRMS
```

> ⚠️ Replace credentials with your own values.

---

### Step 4: Start Backend Server

```bash
npm run dev
```

Backend will run at:

```
http://localhost:5000
```

---

## 🎨 Frontend Setup (React + Vite)

### Step 1: Go to Frontend Folder

```bash
cd ../frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create `.env` File (Frontend)

```env
# Client Environment Variables
VITE_API_URL=http://localhost:5000/api
```

---

### Step 4: Run Frontend

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## 👥 Team Members

| Name                  | Role        | LinkedIn                                                                                                             | GitHub                                                                             |
| --------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Darshan Chauhan**   | Team Leader | [https://www.linkedin.com/in/darshan-chauhan-5b9023276/](https://www.linkedin.com/in/darshan-chauhan-5b9023276/)     | [https://github.com/darshan-chauhan-089/](https://github.com/darshan-chauhan-089/) |
| **Nirdesh Bhesaniya** | Team Member | [https://www.linkedin.com/in/nirdesh-bhesaniya-387b67284/](https://www.linkedin.com/in/nirdesh-bhesaniya-387b67284/) | [https://github.com/nirdeshbhesaniya](https://github.com/nirdeshbhesaniya)         |
| **Madhav Shukla**     | Team Member | [https://www.linkedin.com/in/madhav-shukla-201776291/](https://www.linkedin.com/in/madhav-shukla-201776291/)         | [https://github.com/shuklamadhav2005](https://github.com/shuklamadhav2005)         |
| **Diya Patel**        | Team Member | [https://www.linkedin.com/in/diya-patel-aa7ab4327/](https://www.linkedin.com/in/diya-patel-aa7ab4327/)               | [https://github.com/Diya-patel111](https://github.com/Diya-patel111)               |


