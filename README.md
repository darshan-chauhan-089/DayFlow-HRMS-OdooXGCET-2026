# 🚀 DayFlow Human Resources Management System

A production-ready DayFlow HRMS starter designed for HR workflows. Features JWT authentication, protected routes, modern UI with Tailwind CSS, and a scalable architecture.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Frontend Routes](#-frontend-routes)
- [How Frontend & Backend Connect](#-how-frontend--backend-connect)
- [Extending for Your Hackathon](#-extending-for-your-hackathon)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

- ✅ **Complete Authentication System** (Signup, Login, JWT)
- ✅ **OTP-based Password Reset** with email delivery
- ✅ **Email Integration** with Nodemailer & HTML templates
- ✅ **Protected Routes** with middleware
- ✅ **Modern UI** with Tailwind CSS & gradient designs
- ✅ **Responsive Design** (Mobile-first)
- ✅ **Context API** for state management
- ✅ **MongoDB Atlas** integration
- ✅ **MVC Architecture** on backend
- ✅ **Component-based** frontend structure
- ✅ **Password Hashing** with bcrypt
- ✅ **Password Strength Validation** with real-time feedback
- ✅ **Error Handling** & validation
- ✅ **Loading States** & user feedback
- ✅ **Dashboard Portal** with sidebar
- ✅ **Profile Page** with user data
- ✅ **React Icons** throughout the application

---

## 🛠️ Tech Stack

### Frontend
- **React** 18 (with Vite)
- **React Router** v6
- **Context API** for state management
- **Axios** for HTTP requests
- **Tailwind CSS** for styling

### Backend
- **Node.js** with ES6 modules
- **Express.js** framework
- **MongoDB** (Mongoose ODM)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email delivery
- **Crypto** for OTP generation

---

## 📁 Project Structure

```
project-root/
│
├── client/                          # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   ├── Footer.jsx          # Footer component
│   │   │   └── ProtectedRoute.jsx  # Route protection HOC
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Landing/home page
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Signup.jsx          # Signup page
│   │   │   ├── Dashboard.jsx       # Protected dashboard
│   │   │   └── Profile.jsx         # User profile page
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Authentication context
│   │   │
│   │   ├── services/
│   │   │   └── api.js              # Axios instance & API calls
│   │   │
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── server/                          # Backend (Express)
│   ├── controllers/
│   │   └── authController.js       # Auth logic with OTP
│   │
│   ├── models/
│   │   └── User.js                 # User schema with OTP fields
│   │
│   ├── routes/
│   │   └── authRoutes.js           # Auth routes
│   │
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification
│   │
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   └── email.js                # Nodemailer configuration
│   │
│   ├── utils/
│   │   └── emailTemplates.js       # HTML email templates
│   │
│   ├── app.js                      # Express app setup
│   ├── server.js                   # Server entry point
│   ├── EMAIL_SETUP.md              # Email configuration guide
│   └── package.json
│
├── .env.example                     # Environment variables template
├── .gitignore
└── README.md
```

---

## ✅ Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Set Up MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier M0)
3. Create a database user with username and password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

### 3. Environment Variables

#### Backend (.env in root)

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your values:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/mern_hackathon?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_random_secret_key_generate_this
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (for OTP functionality)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=MERN App
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Email Setup:**
See [server/EMAIL_SETUP.md](server/EMAIL_SETUP.md) for detailed email configuration instructions.

Quick Gmail setup:
1. Enable 2-Step Verification on your Google Account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Use the 16-character password in EMAIL_PASSWORD

#### Frontend (.env in client/)

Create a `.env` file in the `client/` directory:

```bash
cd client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Install Dependencies

#### Install Backend Dependencies

```bash
cd server
npm install
```

#### Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## ▶️ Running the Application

You need to run both frontend and backend simultaneously in separate terminals.

### Terminal 1: Start Backend Server

```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster.mongodb.net
🚀 Server running in development mode on port 5000
📍 API Base URL: http://localhost:5000/api
```

### Terminal 2: Start Frontend

```bash
cd client
npm run dev
```

You should see:
```
  VITE ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

Open your browser and navigate to **http://localhost:5173/**

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/signup` | Public | Register new user |
| POST | `/auth/login` | Public | Login user |
| GET | `/auth/profile` | Private | Get user profile |

### Request/Response Examples

#### Signup
```json
POST /api/auth/signup

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```json
POST /api/auth/login

Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Profile (Protected)
```json
GET /api/auth/profile
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🗺️ Frontend Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | Landing | Public | Home page with hero section |
| `/login` | Login | Public | User login form |
| `/signup` | Signup | Public | User registration form |
| `/dashboard` | Dashboard | Protected | User dashboard with sidebar |
| `/profile` | Profile | Protected | User profile page |

---

## 🔄 How Frontend & Backend Connect

### 1. API Service Layer (`client/src/services/api.js`)

The frontend uses Axios to communicate with the backend:

```javascript
// Base configuration
const API_URL = 'http://localhost:5000/api'

// Request interceptor adds JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 2. Authentication Flow

```
User Action (Login) 
    ↓
AuthContext.login() 
    ↓
API call to /api/auth/login 
    ↓
Backend validates credentials 
    ↓
Backend returns JWT token 
    ↓
Frontend stores token in localStorage 
    ↓
User state updated in Context 
    ↓
Redirect to Dashboard
```

### 3. Protected Routes

```javascript
// ProtectedRoute checks authentication
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### 4. Backend Middleware

```javascript
// JWT verification on protected routes
router.get('/profile', authMiddleware, getProfile)

// Middleware extracts user from token
authMiddleware: (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.verify(token, JWT_SECRET)
  req.user = decoded
  next()
}
```

---

## 🎯 Extending for Your Hackathon

This boilerplate is designed to be easily extended with your hackathon idea. Here's where to plug in your features:

### 1. Add New Database Models

Create new models in `server/models/`:

```javascript
// server/models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Add your fields here
});

export default mongoose.model('Project', projectSchema);
```

### 2. Add New API Routes

Create controllers and routes:

```javascript
// server/controllers/projectController.js
export const createProject = async (req, res) => {
  // Your business logic
};

// server/routes/projectRoutes.js
import express from 'express';
import { createProject } from '../controllers/projectController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', authMiddleware, createProject);
export default router;

// Add to server/app.js
import projectRoutes from './routes/projectRoutes.js';
app.use('/api/projects', projectRoutes);
```

### 3. Add New Frontend Pages

Create new pages in `client/src/pages/`:

```javascript
// client/src/pages/Projects.jsx
const Projects = () => {
  // Your component logic
  return <div>Projects Page</div>
};
export default Projects;

// Add route in client/src/App.jsx
<Route path="/projects" element={
  <ProtectedRoute>
    <Projects />
  </ProtectedRoute>
} />
```

### 4. Update Dashboard Sidebar

Edit `client/src/pages/Dashboard.jsx` to add your menu items.

### 5. API Integration

Add new API functions in `client/src/services/api.js`:

```javascript
export const projectAPI = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  // Add more endpoints
};
```

---

## 🌐 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
```bash
cd client
npm run build
```

2. Update environment variable:
```env
VITE_API_URL=https://your-backend-url.com/api
```

3. Deploy to Vercel:
```bash
npm install -g vercel
vercel --prod
```

### Backend (Railway/Render/Heroku)

1. Push to GitHub
2. Connect your repository to hosting platform
3. Set environment variables in platform dashboard
4. Deploy

### Database

MongoDB Atlas is already cloud-hosted, just update the connection string in production.

---

## 🐛 Troubleshooting

### Backend won't start

- Check MongoDB connection string
- Ensure all environment variables are set
- Verify MongoDB Atlas IP whitelist

### Frontend can't connect to backend

- Check VITE_API_URL in client/.env
- Ensure backend is running on correct port
- Check browser console for CORS errors

### Authentication not working

- Verify JWT_SECRET is set in backend .env
- Check token is being stored in localStorage
- Inspect network tab for API responses

### "Cannot find module" errors

- Delete node_modules and package-lock.json
- Run `npm install` again

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [JWT.io](https://jwt.io/)

---

## 🎉 Ready for Your Hackathon!

This boilerplate provides a solid foundation. Focus on:

1. **Understanding the flow** - trace a request from frontend to backend
2. **Identifying extension points** - models, controllers, pages
3. **Building your unique features** on top of this structure

### What Judges Love:

✅ Clean, professional UI (already provided)  
✅ Working authentication system (already provided)  
✅ Scalable architecture (already provided)  
✅ **Your innovative solution to the problem statement** (your part!)

---

## 📝 License

MIT License - Feel free to use this for your hackathon!

---

## 🤝 Contributing

This is a hackathon boilerplate. Fork it, customize it, make it yours!

---

**Good luck with your hackathon! 🚀**
