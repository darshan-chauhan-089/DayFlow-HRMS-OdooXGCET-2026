import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { FaKey, FaEnvelope, FaLock, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import PasswordCriteria from '../components/PasswordCriteria';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const loadingToast = toast.loading('Sending OTP to your email...');

        try {
            const response = await authAPI.sendOTP(email);
            toast.dismiss(loadingToast);
            if (response.data.success) {
                toast.success('OTP sent! Check your email 📧');
                setStep(2);
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMsg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
            toast.error(errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleOTPChange = (index, value) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOTPKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            const errorMsg = 'Please enter all 6 digits';
            toast.error(errorMsg);
            setError(errorMsg);
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Verifying OTP...');

        try {
            const response = await authAPI.verifyOTP(email, otpCode);
            toast.dismiss(loadingToast);
            if (response.data.success) {
                toast.success('OTP verified! ✅');
                setStep(3);
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMsg = err.response?.data?.message || 'Invalid OTP. Please try again.';
            toast.error(errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            const errorMsg = 'Passwords do not match';
            toast.error(errorMsg);
            setError(errorMsg);
            return;
        }

        if (newPassword.length < 6) {
            const errorMsg = 'Password must be at least 6 characters';
            toast.error(errorMsg);
            setError(errorMsg);
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Resetting your password...');

        try {
            const response = await authAPI.resetPasswordWithOTP(email, otp.join(''), newPassword);
            toast.dismiss(loadingToast);
            if (response.data.success) {
                setSuccess(true);
                toast.success('Password reset successful! 🎉 Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMsg = err.response?.data?.message || 'Failed to reset password. Please try again.';
            toast.error(errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        setError('');
        setLoading(true);
        const loadingToast = toast.loading('Resending OTP...');

        try {
            await authAPI.sendOTP(email);
            toast.dismiss(loadingToast);
            toast.success('OTP resent successfully! 📨');
        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMsg = 'Failed to resend OTP';
            toast.error(errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                        <FaKey className="text-3xl text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    {step === 1 && 'Forgot Password?'}
                    {step === 2 && 'Verify OTP'}
                    {step === 3 && 'Reset Password'}
                </h2>
                <p className="mt-3 text-center text-base text-gray-600">
                    {step === 1 && 'Enter your email to receive a verification code'}
                    {step === 2 && 'Enter the 6-digit code sent to your email'}
                    {step === 3 && 'Create a new strong password'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-2xl rounded-2xl sm:px-12 border border-gray-100">
                    {success ? (
                        <div className="text-center">
                            <div className="mb-6 flex justify-center">
                                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <FaCheckCircle className="text-4xl text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Password Reset Successful!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Your password has been reset. Redirecting to login...
                            </p>
                            <Link
                                to="/login"
                                className="inline-block bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-base font-bold transition-all duration-300 shadow-lg transform hover:scale-105"
                            >
                                Go to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Step 1: Email Input */}
                            {step === 1 && (
                                <form onSubmit={handleEmailSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <FaEnvelope className="text-primary-600" />
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Sending OTP...
                                            </>
                                        ) : (
                                            <>
                                                <FaKey />
                                                Send OTP
                                            </>
                                        )}
                                    </button>

                                    <div className="text-center">
                                        <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors">
                                            Back to Login
                                        </Link>
                                    </div>
                                </form>
                            )}

                            {/* Step 2: OTP Verification */}
                            {step === 2 && (
                                <form onSubmit={handleOTPSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                                            Enter 6-Digit Code
                                        </label>
                                        <div className="flex justify-center gap-2">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    id={`otp-${index}`}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOTPChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                                                    className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                                />
                                            ))}
                                        </div>
                                        <p className="mt-3 text-center text-sm text-gray-600">
                                            Code sent to {email}
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle />
                                                Verify OTP
                                            </>
                                        )}
                                    </button>

                                    <div className="text-center space-y-2">
                                        <button
                                            type="button"
                                            onClick={resendOTP}
                                            disabled={loading}
                                            className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
                                        >
                                            Resend OTP
                                        </button>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                            >
                                                Change Email
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Step 3: New Password */}
                            {step === 3 && (
                                <form onSubmit={handlePasswordReset} className="space-y-6">
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <FaLock className="text-primary-600" />
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="newPassword"
                                                name="newPassword"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Create a strong password"
                                                className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                                            </button>
                                        </div>
                                        <PasswordCriteria password={newPassword} />
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <FaCheckCircle className="text-primary-600" />
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Re-enter your password"
                                                className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                            >
                                                {showConfirmPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                                            </button>
                                        </div>
                                        {confirmPassword && newPassword !== confirmPassword && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                Passwords do not match
                                            </p>
                                        )}
                                        {confirmPassword && newPassword === confirmPassword && (
                                            <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                                                <FaCheckCircle />
                                                Passwords match
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || newPassword !== confirmPassword}
                                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Resetting...
                                            </>
                                        ) : (
                                            <>
                                                <FaLock />
                                                Reset Password
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
                            Sign up now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
