# ⚡ Quick Reference Cheatsheet

## 🚀 Getting Started (5 Minutes)

```bash
# 1. Install Backend Dependencies
cd server
npm install

# 2. Install Frontend Dependencies  
cd ../client
npm install

# 3. Set up .env files (see below)

# 4. Start Backend (Terminal 1)
cd server
npm run dev

# 5. Start Frontend (Terminal 2)
cd client
npm run dev

# 6. Open browser
# http://localhost:5173
```

---

## 📝 Environment Variables

### Root `.env`
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=<generate-random-32-char-string>
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔌 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/profile` | Private | Get profile |
| GET | `/api/health` | Public | Health check |

---

## 🗺️ Routes

| Path | Component | Protected | Description |
|------|-----------|-----------|-------------|
| `/` | Landing | ❌ | Home page |
| `/login` | Login | ❌ | Login form |
| `/signup` | Signup | ❌ | Registration |
| `/dashboard` | Dashboard | ✅ | User dashboard |
| `/profile` | Profile | ✅ | User profile |

---

## 📂 File Locations

### Frontend
```
client/src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── context/           # Context API (state)
├── services/          # API calls
└── App.jsx           # Main app + routes
```

### Backend
```
server/
├── controllers/       # Business logic
├── models/           # Database schemas
├── routes/           # API routes
├── middleware/       # Middleware functions
├── config/           # Configuration
└── server.js         # Entry point
```

---

## 🔧 Common Commands

### Development
```bash
# Backend
cd server
npm run dev          # Start with nodemon
npm start           # Start production

# Frontend
cd client
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview build
```

### Database
```bash
# Test MongoDB connection
mongosh "mongodb+srv://..."

# Check if running locally
mongosh
```

### Debugging
```bash
# Check what's running on ports
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill process by port (Windows)
taskkill /PID <PID> /F

# Kill process by port (Mac/Linux)
lsof -ti:5000 | xargs kill
```

---

## 🎯 Adding New Features

### 1. New Database Model
```javascript
// server/models/YourModel.js
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  field: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('YourModel', schema);
```

### 2. New Controller
```javascript
// server/controllers/yourController.js
export const getItems = async (req, res) => {
  try {
    const items = await YourModel.find({ owner: req.user.id });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### 3. New Route
```javascript
// server/routes/yourRoutes.js
import express from 'express';
import { getItems } from '../controllers/yourController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', authMiddleware, getItems);
export default router;

// Add to server/app.js
import yourRoutes from './routes/yourRoutes.js';
app.use('/api/your-resource', yourRoutes);
```

### 4. New Frontend Page
```javascript
// client/src/pages/NewPage.jsx
const NewPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold">New Page</h1>
    </div>
  );
};
export default NewPage;

// Add to client/src/App.jsx
import NewPage from './pages/NewPage';
<Route path="/new" element={<NewPage />} />
```

### 5. New API Call
```javascript
// client/src/services/api.js
export const yourAPI = {
  getAll: () => api.get('/your-resource'),
  create: (data) => api.post('/your-resource', data),
  update: (id, data) => api.put(`/your-resource/${id}`, data),
  delete: (id) => api.delete(`/your-resource/${id}`)
};
```

---

## 🎨 Tailwind CSS Quick Reference

### Colors
```jsx
className="text-primary-600 bg-primary-50"
className="text-gray-700 bg-gray-100"
```

### Spacing
```jsx
className="p-4 m-4"           // padding, margin
className="px-6 py-4"         // horizontal, vertical
className="mt-8 mb-4"         // top, bottom
```

### Layout
```jsx
className="flex items-center justify-between"
className="grid grid-cols-3 gap-4"
className="w-full h-screen"
```

### Typography
```jsx
className="text-3xl font-bold"
className="text-sm text-gray-500"
```

### Responsive
```jsx
className="hidden md:block"   // Hide on mobile
className="grid md:grid-cols-2 lg:grid-cols-3"
```

---

## 🔐 Authentication Code Snippets

### Frontend - Login
```javascript
const { login } = useAuth();

const handleLogin = async () => {
  const result = await login(email, password);
  if (result.success) {
    navigate('/dashboard');
  } else {
    setError(result.message);
  }
};
```

### Frontend - Check Auth
```javascript
const { user, isAuthenticated } = useAuth();

if (isAuthenticated) {
  // User is logged in
  console.log(user.name);
}
```

### Frontend - Logout
```javascript
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate('/');
};
```

### Backend - Protected Route
```javascript
import authMiddleware from '../middleware/authMiddleware.js';

router.get('/protected', authMiddleware, (req, res) => {
  // req.user contains { id, email }
  res.json({ user: req.user });
});
```

---

## 🐛 Quick Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| Can't connect to MongoDB | Check MONGODB_URI, IP whitelist |
| Frontend can't reach backend | Check VITE_API_URL, ensure backend running |
| Token expired | Login again, or increase JWT_EXPIRE |
| Port in use | Kill process or change PORT |
| Styles not working | Restart dev server |
| Module not found | `npm install` again |

---

## 📊 Project Structure (Visual)

```
Odoo-basic-structure/
│
├── client/              ← Frontend (React)
│   ├── src/
│   │   ├── components/  ← Navbar, Footer, ProtectedRoute
│   │   ├── pages/       ← Landing, Login, Signup, Dashboard, Profile
│   │   ├── context/     ← AuthContext (state management)
│   │   └── services/    ← api.js (Axios config)
│   └── package.json
│
├── server/              ← Backend (Express)
│   ├── controllers/     ← Business logic
│   ├── models/          ← Database schemas
│   ├── routes/          ← API endpoints
│   ├── middleware/      ← Auth verification
│   └── config/          ← Database connection
│
└── Documentation files
```

---

## 🔑 Important Files

| File | Purpose |
|------|---------|
| `client/src/App.jsx` | Routes & app structure |
| `client/src/context/AuthContext.jsx` | Auth state management |
| `client/src/services/api.js` | API configuration |
| `server/server.js` | Server entry point |
| `server/models/User.js` | User schema |
| `server/controllers/authController.js` | Auth logic |
| `server/middleware/authMiddleware.js` | JWT verification |

---

## 💡 Code Snippets

### Custom Hook
```javascript
// client/src/hooks/useApi.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export const useApi = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(endpoint);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};
```

### Loading Spinner
```javascript
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);
```

### Error Alert
```javascript
{error && (
  <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {error}
  </div>
)}
```

---

## 🎯 Hackathon Tips

1. ✅ **Test early, test often** - Don't wait till the end
2. ✅ **Commit frequently** - `git commit -m "feature: ..."` 
3. ✅ **Keep backups** - Push to GitHub regularly
4. ✅ **Focus on your unique value** - Auth is handled
5. ✅ **Make it look good** - Use Tailwind components
6. ✅ **Demo practice** - Prepare a 3-minute demo
7. ✅ **Document changes** - Update README with your features

---

## 📚 Documentation Links

- 📖 [README.md](README.md) - Full documentation
- 🚀 [SETUP.md](SETUP.md) - Setup guide
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture
- 🔧 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
- 📋 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete summary

---

## ⚡ Express Commands

```bash
# Quick start both servers
cd server && npm run dev &
cd client && npm run dev

# Install new backend package
cd server && npm install package-name

# Install new frontend package
cd client && npm install package-name

# Check for errors
npm run build
```

---

**Print this out or keep it handy during your hackathon! 🚀**
