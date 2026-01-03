# 🚀 Quick Start Guide

## Complete Setup Instructions

### Step 1: Install Dependencies

Open **two terminals** in the project root directory.

#### Terminal 1 - Backend Setup
```bash
cd server
npm install
```

#### Terminal 2 - Frontend Setup
```bash
cd client
npm install
```

---

### Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

---

### Step 3: Configure Environment Variables

#### Backend Configuration

Create `.env` file in the **root directory**:

```bash
cp .env.example .env
```

Edit the `.env` file and replace with your actual values:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/mern_hackathon?retryWrites=true&w=majority
JWT_SECRET=use_the_command_below_to_generate_this
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

**Generate a secure JWT_SECRET:**
```bash
# Run this command in terminal to generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Frontend Configuration

Create `.env` file in the **client/** directory:

```bash
cd client
cp .env.example .env
```

The `client/.env` file should contain:

```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 4: Start the Application

You need to keep both terminals running.

#### Terminal 1 - Start Backend
```bash
cd server
npm run dev
```

✅ You should see:
```
✅ MongoDB Connected: cluster.mongodb.net
🚀 Server running in development mode on port 5000
```

#### Terminal 2 - Start Frontend
```bash
cd client
npm run dev
```

✅ You should see:
```
  VITE ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

---

### Step 5: Open the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## ✅ Verify Everything Works

### Test the Application:

1. **Landing Page** - You should see the hero section
2. **Click "Sign Up"** - Create a new account
3. **After signup** - You'll be redirected to the Dashboard
4. **Check Profile** - Click on "Profile" in the navbar
5. **Logout** - Click logout button
6. **Login** - Try logging in with your credentials

---

## 🎯 Project Structure Overview

```
Odoo-basic-structure/
│
├── client/              # React frontend (Port 5173)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Global state (Auth)
│   │   ├── services/    # API calls
│   │   └── App.jsx      # Main app with routes
│   └── package.json
│
├── server/              # Express backend (Port 5000)
│   ├── controllers/     # Business logic
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── config/          # DB connection
│   └── server.js        # Entry point
│
├── .env                 # Backend environment variables
└── README.md            # Full documentation
```

---

## 🔧 Available Scripts

### Backend (server/)
```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
```

### Frontend (client/)
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Check your MONGODB_URI in `.env`
- Verify database username and password
- Ensure IP address is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for development)

### Issue: "Cannot find module"
**Solution:**
```bash
# Delete node_modules and reinstall
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

### Issue: Frontend can't reach backend
**Solution:**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `client/.env`
- Look for CORS errors in browser console

### Issue: "JWT must be provided"
**Solution:**
- Check that JWT_SECRET is set in `.env`
- Try logging out and logging in again
- Clear browser localStorage

---

## 📦 What's Included

✅ Complete authentication system (signup, login, logout)  
✅ JWT token-based authorization  
✅ Protected routes on frontend and backend  
✅ Password hashing with bcrypt  
✅ MongoDB integration with Mongoose  
✅ Modern UI with Tailwind CSS  
✅ Responsive design  
✅ Dashboard with sidebar layout  
✅ Profile page with user data  
✅ Error handling and validation  
✅ Loading states  
✅ API service layer with Axios  

---

## 🎨 Customization Ideas for Your Hackathon

Now that the boilerplate is set up, you can:

1. **Add new database models** in `server/models/`
2. **Create new API endpoints** in `server/routes/` and `server/controllers/`
3. **Build new pages** in `client/src/pages/`
4. **Add features to Dashboard** - modify `Dashboard.jsx`
5. **Customize the theme** - edit `client/tailwind.config.js`

---

## 🚀 Next Steps

1. ✅ Complete the setup above
2. ✅ Test all features (signup, login, dashboard, profile)
3. ✅ Understand the code structure
4. ✅ Plan your hackathon feature
5. ✅ Start building on top of this foundation!

---

## 📚 Important Files to Understand

### Frontend Core Files:
- `client/src/App.jsx` - Routes and app structure
- `client/src/context/AuthContext.jsx` - Authentication state management
- `client/src/services/api.js` - API calls and Axios setup

### Backend Core Files:
- `server/server.js` - Server entry point
- `server/app.js` - Express app configuration
- `server/models/User.js` - User database schema
- `server/controllers/authController.js` - Authentication logic
- `server/middleware/authMiddleware.js` - JWT verification

---

## 💡 Pro Tips for Hackathon

1. **Commit Early**: After setting up, commit to Git
   ```bash
   git add .
   git commit -m "Initial MERN boilerplate setup"
   ```

2. **Branch for Features**: Create branches for new features
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Use the README**: Reference the main README.md for detailed API documentation

4. **Test Frequently**: Keep both servers running and test after each change

---

## 🎉 You're Ready!

Your MERN stack boilerplate is now set up and ready for development. Focus on building your unique hackathon solution on top of this solid foundation!

**Questions?** Check the main [README.md](../README.md) for detailed documentation.

**Good luck! 🚀**
