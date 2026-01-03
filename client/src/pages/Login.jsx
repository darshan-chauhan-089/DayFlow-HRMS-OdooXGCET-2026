import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash, FaTh } from 'react-icons/fa';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-lg border border-gray-200">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mb-3">
              <FaTh className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">DayFlow</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-600">Sign In</h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Login Id/Email :-
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#714B67] focus:border-[#714B67] focus:z-10 sm:text-sm"
                placeholder=""
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password :-
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#714B67] focus:border-[#714B67] focus:z-10 sm:text-sm"
                  placeholder=""
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#d980fa] hover:bg-[#c56cf0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d980fa] disabled:opacity-50 uppercase tracking-wider"
              style={{ backgroundColor: '#d980fa' }}
            >
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an Account?{' '}
              <Link to="/signup" className="font-medium text-gray-900 hover:text-gray-700 underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
