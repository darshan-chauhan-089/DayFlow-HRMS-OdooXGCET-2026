import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { FaKey, FaEnvelope, FaLock, FaCheckCircle, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
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
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4" style={{ backgroundColor: 'var(--bg-main)' }}>
            
            {/* Authentication Card */}
            <div className="w-full max-w-[400px] odoo-card p-8 bg-white">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <img src="/logo.jpeg" alt="DayFlow" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>DayFlow</span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {step === 1 && 'Reset your password'}
                        {step === 2 && 'Verify OTP'}
                        {step === 3 && 'Create new password'}
                    </p>
                </div>

                {success ? (
                    <div className="text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                <FaCheckCircle className="text-3xl text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Password Reset Successful!
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Your password has been reset. Redirecting to login...
                        </p>
                        <Link
                            to="/login"
                            className="odoo-btn-primary block w-full text-center no-underline"
                        >
                            Go to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Step 1: Email Input */}
                        {step === 1 && (
                            <form onSubmit={handleEmailSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="odoo-label">EMAIL ADDRESS</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="text-gray-400 text-sm" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            className="odoo-input pl-10"
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        We'll send a 6-digit verification code to this email.
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded" style={{ borderRadius: 'var(--radius-sm)' }}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="odoo-btn-primary uppercase tracking-wide"
                                >
                                    {loading ? 'SENDING OTP...' : 'SEND OTP'}
                                </button>
                            </form>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 2 && (
                            <form onSubmit={handleOTPSubmit} className="space-y-5">
                                <div>
                                    <label className="odoo-label text-center mb-4 block">ENTER VERIFICATION CODE</label>
                                    <div className="flex justify-between gap-2">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                maxLength="1"
                                                className="w-10 h-12 text-center text-xl font-bold border rounded-md focus:ring-2 focus:ring-[#00A09D] focus:border-[#00A09D] outline-none transition-all"
                                                style={{ borderColor: 'var(--border-color)' }}
                                                value={digit}
                                                onChange={(e) => handleOTPChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOTPKeyDown(index, e)}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-center mt-4">
                                        <button
                                            type="button"
                                            onClick={resendOTP}
                                            disabled={loading}
                                            className="text-xs font-medium hover:underline"
                                            style={{ color: 'var(--odoo-purple)' }}
                                        >
                                            Resend Code
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded" style={{ borderRadius: 'var(--radius-sm)' }}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="odoo-btn-primary uppercase tracking-wide"
                                >
                                    {loading ? 'VERIFYING...' : 'VERIFY OTP'}
                                </button>
                            </form>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <form onSubmit={handlePasswordReset} className="space-y-5">
                                <div>
                                    <label htmlFor="newPassword" className="odoo-label">NEW PASSWORD</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="text-gray-400 text-sm" />
                                        </div>
                                        <input
                                            id="newPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            className="odoo-input pl-10 pr-10"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                        </button>
                                    </div>
                                    <PasswordCriteria password={newPassword} />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="odoo-label">CONFIRM PASSWORD</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="text-gray-400 text-sm" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            className="odoo-input pl-10 pr-10"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded" style={{ borderRadius: 'var(--radius-sm)' }}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="odoo-btn-primary uppercase tracking-wide"
                                >
                                    {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                                </button>
                            </form>
                        )}

                        {/* Back to Login */}
                        <div className="text-center mt-6">
                            <Link to="/login" className="inline-flex items-center text-sm font-medium hover:underline" style={{ color: 'var(--text-secondary)' }}>
                                <FaArrowLeft className="mr-2 text-xs" /> Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </div>

            {/* Page Footer */}
            <p className="text-xs text-center mt-8" style={{ color: 'var(--text-muted)' }}>
                © 2026 DayFlow HRMS. All rights reserved.
            </p>
        </div>
    );
};

export default ForgotPassword;
