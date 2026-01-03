# 🔧 Troubleshooting & FAQ

## Common Issues and Solutions

---

## 🐛 Installation Issues

### Issue: `npm install` fails

**Symptoms:**
- Error messages during package installation
- Dependency conflicts

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete and reinstall:**
   ```bash
   # Backend
   cd server
   rm -rf node_modules package-lock.json
   npm install

   # Frontend
   cd client
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Use compatible Node version:**
   ```bash
   node --version  # Should be v16 or higher
   ```

---

## 🔌 Connection Issues

### Issue: Frontend can't connect to backend

**Symptoms:**
- Network errors in browser console
- "Failed to fetch" errors
- API calls timeout

**Solutions:**

1. **Verify backend is running:**
   ```bash
   # Check if server is running on port 5000
   curl http://localhost:5000/api/health
   ```

2. **Check environment variable:**
   ```bash
   # client/.env should have:
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Restart both servers:**
   ```bash
   # Kill all processes and restart
   # Terminal 1
   cd server
   npm run dev

   # Terminal 2
   cd client
   npm run dev
   ```

4. **Check firewall/antivirus:**
   - Temporarily disable and test
   - Add exception for ports 5000 and 5173

---

### Issue: CORS errors

**Symptoms:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions:**

1. **Verify CORS is enabled in backend:**
   Check [server/app.js](server/app.js):
   ```javascript
   app.use(cors());
   ```

2. **For production, specify origins:**
   ```javascript
   app.use(cors({
     origin: 'https://your-frontend-domain.com'
   }));
   ```

---

## 💾 Database Issues

### Issue: Cannot connect to MongoDB

**Symptoms:**
```
❌ MongoDB Connection Error: connection refused
```

**Solutions:**

1. **Check MongoDB URI:**
   - Verify `.env` file exists in root directory
   - Ensure no spaces in MONGODB_URI
   - Check username/password are correct

2. **Verify IP whitelist in MongoDB Atlas:**
   - Go to MongoDB Atlas dashboard
   - Navigate to Network Access
   - Add IP address or use `0.0.0.0/0` for development

3. **Test connection string:**
   ```bash
   # Replace with your URI
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/test"
   ```

4. **Common URI mistakes:**
   ```bash
   # ❌ Wrong
   MONGODB_URI=mongodb+srv://user:pass word@cluster.net/db

   # ✅ Correct
   MONGODB_URI=mongodb+srv://user:password@cluster.net/db
   ```

---

### Issue: Database connection is slow

**Symptoms:**
- Timeout errors
- Long wait times

**Solutions:**

1. **Choose nearest region:**
   - In MongoDB Atlas, select cluster region closest to you

2. **Use connection pooling:**
   Already configured in [server/config/db.js](server/config/db.js)

3. **Check network:**
   ```bash
   ping atlas.mongodb.com
   ```

---

## 🔐 Authentication Issues

### Issue: Login fails with correct credentials

**Symptoms:**
- "Invalid credentials" message
- Login returns 401 error

**Solutions:**

1. **Check JWT_SECRET is set:**
   ```bash
   # In .env file
   JWT_SECRET=your_secret_here
   ```

2. **Generate new JWT secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Clear existing tokens:**
   - Open browser DevTools
   - Go to Application > Local Storage
   - Clear `token` and `user` items
   - Try login again

4. **Check password hashing:**
   Verify User model has bcrypt pre-save hook in [server/models/User.js](server/models/User.js)

---

### Issue: "Token expired" error

**Symptoms:**
- Redirected to login unexpectedly
- 401 errors on API calls

**Solutions:**

1. **Token has expired (default: 7 days):**
   - This is expected behavior
   - User needs to login again

2. **Change expiration time:**
   ```bash
   # In .env
   JWT_EXPIRE=30d  # For 30 days
   ```

3. **Implement refresh tokens** (advanced):
   - Add refresh token logic to authController
   - Store refresh tokens in database

---

### Issue: Protected routes redirect to login immediately

**Symptoms:**
- Can't access dashboard or profile
- Always redirected to login

**Solutions:**

1. **Check token in localStorage:**
   ```javascript
   // In browser console
   localStorage.getItem('token')
   ```

2. **Verify ProtectedRoute logic:**
   Check [client/src/components/ProtectedRoute.jsx](client/src/components/ProtectedRoute.jsx)

3. **Check AuthContext initialization:**
   Ensure token is loaded on app start in [client/src/context/AuthContext.jsx](client/src/context/AuthContext.jsx)

---

## 🎨 Frontend Issues

### Issue: Tailwind styles not working

**Symptoms:**
- No styling applied
- Plain HTML appearance

**Solutions:**

1. **Rebuild Tailwind:**
   ```bash
   cd client
   npm run dev
   ```

2. **Check Tailwind config:**
   Verify [client/tailwind.config.js](client/tailwind.config.js) has correct content paths:
   ```javascript
   content: ["./index.html", "./src/**/*.{js,jsx}"]
   ```

3. **Ensure CSS is imported:**
   Check [client/src/main.jsx](client/src/main.jsx) imports `index.css`

---

### Issue: React Router not working

**Symptoms:**
- 404 on page refresh
- Routes don't work

**Solutions:**

1. **Development server:**
   This should work automatically with Vite

2. **Production build:**
   Configure server to handle client-side routing:
   ```javascript
   // For Express server
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
   });
   ```

---

### Issue: Environment variables not loading

**Symptoms:**
- `undefined` in `import.meta.env.VITE_API_URL`

**Solutions:**

1. **Prefix with VITE_:**
   ```bash
   # In client/.env
   VITE_API_URL=http://localhost:5000/api
   ```

2. **Restart dev server:**
   ```bash
   # Kill and restart
   cd client
   npm run dev
   ```

3. **Check file location:**
   - `.env` must be in `client/` directory
   - Not in root or `client/src/`

---

## 🖥️ Backend Issues

### Issue: Server crashes on start

**Symptoms:**
```
Error: Cannot find module
```

**Solutions:**

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Check imports:**
   - Ensure all imports use `.js` extension
   - Verify file paths are correct

3. **Check package.json:**
   ```json
   {
     "type": "module"
   }
   ```

---

### Issue: Bcrypt errors

**Symptoms:**
```
Error: Failed to hash password
```

**Solutions:**

1. **Reinstall bcryptjs:**
   ```bash
   cd server
   npm uninstall bcryptjs
   npm install bcryptjs
   ```

2. **Use bcrypt instead:**
   ```bash
   npm install bcrypt
   ```
   Then update imports in User model

---

### Issue: Port already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Find and kill process:**
   ```bash
   # On Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F

   # On Mac/Linux
   lsof -ti:5000 | xargs kill
   ```

2. **Use different port:**
   ```bash
   # In .env
   PORT=5001
   ```

---

## 📦 Build Issues

### Issue: Production build fails

**Symptoms:**
- Build command errors
- Missing dependencies

**Solutions:**

1. **Clean build:**
   ```bash
   cd client
   rm -rf dist
   npm run build
   ```

2. **Check for console.logs:**
   Remove or comment out development console.logs

3. **Verify environment variables:**
   Set production API URL:
   ```bash
   VITE_API_URL=https://your-backend-url.com/api
   ```

---

## 🚀 Deployment Issues

### Issue: App works locally but not in production

**Symptoms:**
- 404 errors
- API calls fail
- White screen

**Solutions:**

1. **Check API URL:**
   - Must point to production backend
   - Not localhost

2. **CORS configuration:**
   ```javascript
   app.use(cors({
     origin: 'https://your-frontend-domain.com'
   }));
   ```

3. **Environment variables:**
   - Set in hosting platform dashboard
   - MongoDB URI, JWT_SECRET, etc.

4. **Build output:**
   - Ensure `dist/` folder is deployed
   - Not `src/` folder

---

## ❓ Frequently Asked Questions

### Q: How do I add a new page?

**A:** 
1. Create component in `client/src/pages/`
2. Add route in `client/src/App.jsx`
3. Optionally protect with `<ProtectedRoute>`

Example:
```jsx
// pages/NewPage.jsx
const NewPage = () => {
  return <div>New Page</div>
}

// App.jsx
<Route path="/new" element={<NewPage />} />
```

---

### Q: How do I add a new API endpoint?

**A:**
1. Create controller function in `server/controllers/`
2. Add route in `server/routes/`
3. Import route in `server/app.js`

Example:
```javascript
// controllers/dataController.js
export const getData = async (req, res) => {
  // Logic here
}

// routes/dataRoutes.js
router.get('/', authMiddleware, getData);

// app.js
app.use('/api/data', dataRoutes);
```

---

### Q: How do I add a new database model?

**A:**
1. Create schema in `server/models/`
2. Import in controller
3. Use in controller functions

Example:
```javascript
// models/Project.js
const projectSchema = new mongoose.Schema({
  title: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
export default mongoose.model('Project', projectSchema);
```

---

### Q: How do I customize the theme?

**A:**
Edit [client/tailwind.config.js](client/tailwind.config.js):
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your colors here
      }
    }
  }
}
```

---

### Q: How do I add form validation?

**A:**

**Frontend:**
```jsx
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!email) newErrors.email = 'Email required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

**Backend:**
```javascript
// Use express-validator
import { body, validationResult } from 'express-validator';

router.post('/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

---

### Q: How do I implement role-based access?

**A:**

1. **Add role to User model:**
```javascript
role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
}
```

2. **Create role middleware:**
```javascript
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
```

3. **Use in routes:**
```javascript
router.delete('/admin', authMiddleware, requireRole('admin'), deleteUser);
```

---

### Q: How do I upload files?

**A:**

Use `multer` package:
```bash
npm install multer
```

```javascript
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});
```

---

### Q: How do I send emails?

**A:**

Use `nodemailer`:
```bash
npm install nodemailer
```

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

await transporter.sendMail({
  from: 'app@example.com',
  to: user.email,
  subject: 'Welcome',
  html: '<h1>Welcome!</h1>'
});
```

---

### Q: How do I implement password reset?

**A:**

1. Generate reset token
2. Send email with reset link
3. Verify token and update password

See full implementation in tutorials or extend authController.

---

### Q: Where should I put my hackathon logic?

**A:**

- **New database models:** `server/models/`
- **Business logic:** `server/controllers/`
- **API routes:** `server/routes/`
- **Frontend pages:** `client/src/pages/`
- **Reusable components:** `client/src/components/`
- **API calls:** `client/src/services/`

---

## 🆘 Still Need Help?

If you're still stuck:

1. **Check browser console** for frontend errors
2. **Check terminal/server logs** for backend errors
3. **Use debugging:**
   ```javascript
   console.log('Debug:', variable);
   ```
4. **Test API with tools:**
   - Postman
   - Thunder Client (VS Code extension)
   - curl commands

5. **Review documentation:**
   - [README.md](README.md) - Full documentation
   - [SETUP.md](SETUP.md) - Setup guide
   - [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture

---

**Remember:** Most issues are configuration-related. Double-check:
- ✅ Environment variables
- ✅ MongoDB connection
- ✅ Both servers running
- ✅ Correct ports
- ✅ Dependencies installed

Good luck! 🚀
