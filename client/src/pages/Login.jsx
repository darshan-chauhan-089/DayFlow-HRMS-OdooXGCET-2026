import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      const errorMsg = 'Please enter both Login ID/Email and Password';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Signing in...');

    try {
      const result = await login(formData.email, formData.password);
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        const errorMsg = result.message || 'Invalid credentials';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4" style={{ backgroundColor: 'var(--bg-main)' }}>

      {/* Authentication Card */}
      <div className="w-full max-w-[400px] odoo-card p-8 bg-white">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <img src="/logo.jpeg" alt="DayFlow" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>DayFlow</span>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Login ID/Email */}
          <div>
            <label htmlFor="email" className="odoo-label">
              LOGIN ID / EMAIL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400 text-sm" />
              </div>
              <input
                id="email"
                name="email"
                type="text"
                required
                className="odoo-input pl-10"
                placeholder="Enter your login ID or email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="odoo-label">
              PASSWORD
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400 text-sm" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="odoo-input pl-10 pr-10"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
            {/* Forgot Password */}
            <div className="text-right mt-2">
              <Link to="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: 'var(--odoo-purple)' }}>
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded" style={{ borderRadius: 'var(--radius-sm)' }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="odoo-btn-primary uppercase tracking-wide"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: 'var(--odoo-teal)' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Page Footer */}
      <p className="text-xs text-center mt-8" style={{ color: 'var(--text-muted)' }}>
        © 2026 DayFlow HRMS. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
