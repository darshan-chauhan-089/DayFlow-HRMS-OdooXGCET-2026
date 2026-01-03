import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import PasswordCriteria from '../components/PasswordCriteria';
import { FaEye, FaEyeSlash, FaUpload, FaBuilding, FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(formData.password)) {
      setError('Password must meet all requirements');
      toast.error('Password must meet all requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Creating account...');

    try {
      const data = new FormData();
      data.append('companyName', formData.companyName);
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      data.append('role', 'Admin');
      if (logo) {
        data.append('logo', logo);
      }

      const result = await signup(data);

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success('Account created successfully!');
        toast.success('Login credentials sent to your email!', { duration: 5000 });
        if (result.user && result.user.empId) {
           toast.success(`Your Login ID is: ${result.user.empId}`, { duration: 6000 });
        }
        setTimeout(() => navigate('/login'), 2500);
      } else {
        toast.error(result.message || 'Signup failed');
        setError(result.message);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('An error occurred during signup');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4" style={{ backgroundColor: 'var(--bg-main)' }}>
      
      {/* Authentication Card */}
      <div className="w-full max-w-[500px] odoo-card p-8 bg-white">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <img src="/logo.jpeg" alt="DayFlow" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>DayFlow</span>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded" style={{ borderRadius: 'var(--radius-sm)' }}>
              {error}
            </div>
          )}

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="odoo-label">
              COMPANY NAME
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding className="text-gray-400 text-sm" />
              </div>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                className="odoo-input pl-10"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Upload Logo */}
          <div>
            <label className="odoo-label">COMPANY LOGO</label>
            <label 
              htmlFor="logo-upload" 
              className="w-full flex flex-col justify-center items-center px-4 py-6 border-2 border-dashed rounded cursor-pointer transition-colors" 
              style={{ borderColor: 'var(--border-color)', backgroundColor: '#F8F9FA' }}
            >
              {logo ? (
                <div className="flex flex-col items-center">
                  <img src={URL.createObjectURL(logo)} alt="Logo Preview" className="h-12 w-auto object-contain mb-2" />
                  <span className="text-xs font-semibold" style={{ color: 'var(--odoo-purple)' }}>{logo.name}</span>
                </div>
              ) : (
                <>
                  <FaUpload className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Click to upload logo</span>
                </>
              )}
            </label>
            <input id="logo-upload" name="logo" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="name" className="odoo-label">FULL NAME</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400 text-sm" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="odoo-input pl-10"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="odoo-label">EMAIL ADDRESS</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400 text-sm" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="odoo-input pl-10"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="odoo-label">PHONE NUMBER</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400 text-sm" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="odoo-input pl-10"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="odoo-label">PASSWORD</label>
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
                placeholder="Create a password"
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
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Password Strength</span>
                <span 
                  className="text-xs font-bold uppercase" 
                  style={{ color: validatePassword(formData.password) ? 'var(--odoo-teal)' : '#DC3545' }}
                >
                  {validatePassword(formData.password) ? 'Strong' : 'Weak'}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="odoo-label">CONFIRM PASSWORD</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400 text-sm" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="odoo-input pl-10 pr-10"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="odoo-btn-primary uppercase tracking-wide"
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--odoo-teal)' }}>
              Sign In
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

export default Signup;
