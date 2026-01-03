import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PasswordCriteria from '../components/PasswordCriteria';
import { authAPI } from '../services/api';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();

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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.resetPassword(token, formData.password);

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(response.data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                        <span className="text-3xl">🔐</span>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-4xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
                    Reset Your Password
                </h2>
                <p className="mt-3 text-center text-base text-gray-600">
                    Create a new strong password for your account
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-2xl rounded-2xl sm:px-12 border border-gray-100">
                    {success ? (
                        <div className="text-center">
                            <div className="mb-6 flex justify-center">
                                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-4xl">✅</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Password Reset Successful!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Your password has been reset successfully. Redirecting to login...
                            </p>
                            <Link
                                to="/login"
                                className="inline-block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl text-base font-bold transition-all duration-300 shadow-lg transform hover:scale-105"
                            >
                                Go to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    🔒 New Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a strong password"
                                        className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <span className="text-xl">{showPassword ? '🙈' : '👁️'}</span>
                                    </button>
                                </div>
                                <PasswordCriteria password={formData.password} />
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    ✅ Confirm New Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter your password"
                                        className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <span className="text-xl">{showConfirmPassword ? '🙈' : '👁️'}</span>
                                    </button>
                                </div>
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <span>⚠️</span>
                                        Passwords do not match
                                    </p>
                                )}
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                                        <span>✅</span>
                                        Passwords match
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || formData.password !== formData.confirmPassword}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Resetting Password...
                                    </>
                                ) : (
                                    <>
                                        <span>🔐</span>
                                        Reset Password
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>←</span>
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
