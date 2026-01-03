import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import PasswordCriteria from '../components/PasswordCriteria';
import { FaEye, FaEyeSlash, FaUpload } from 'react-icons/fa';

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
        // Show the generated Login ID
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Sign Up</h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="sr-only">Company Name</label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            {/* Upload Logo Placeholder */}
            <div>
                <label htmlFor="logo-upload" className="w-full flex flex-col justify-center items-center px-4 py-4 border-2 border-dashed border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer transition-colors">
                    {logo ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={URL.createObjectURL(logo)} 
                          alt="Logo Preview" 
                          className="h-16 w-auto object-contain mb-2" 
                        />
                        <span className="text-purple-600">{logo.name}</span>
                      </div>
                    ) : (
                      <>
                        <FaUpload className="h-8 w-8 text-gray-400 mb-2" />
                        <span>Upload Company Logo</span>
                      </>
                    )}
                </label>
                <input
                    id="logo-upload"
                    name="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="sr-only">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 focus:outline-none focus:text-gray-600">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <PasswordCriteria password={formData.password} />

            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confirmPassword" class="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
               <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-500 focus:outline-none focus:text-gray-600">
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#d980fa' }}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
