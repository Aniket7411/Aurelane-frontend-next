'use client';

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle, FaLock } from 'react-icons/fa';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);
    const [verifyingToken, setVerifyingToken] = useState(true);

    useEffect(() => {
        if (!token) {
            setError('Invalid reset link');
            setTokenValid(false);
            setVerifyingToken(false);
            return;
        }

        // Verify token on component mount
        const verifyToken = async () => {
            try {
                const response = await authAPI.verifyResetToken(token);
                if (!response.success) {
                    setError(response.message || 'Invalid or expired reset token');
                    setTokenValid(false);
                }
            } catch (err) {
                setError('Failed to verify reset token');
                setTokenValid(false);
            } finally {
                setVerifyingToken(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = () => {
        const { password, confirmPassword } = formData;

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.resetPassword(token, formData.password);

            if (response.success) {
                setSuccess(true);
                setMessage('Password reset successfully! Redirecting to login...');
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(response.message || 'Failed to reset password');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while resetting password');
        } finally {
            setLoading(false);
        }
    };

    if (verifyingToken) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Verifying Reset Link
                        </h2>
                        <p className="text-gray-600">
                            Please wait while we verify your reset link...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Invalid Reset Link
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {error || 'The password reset link is invalid or has expired.'}
                        </p>
                        <button
                            onClick={() => navigate('/forgot-password')}
                            className="btn-primary"
                        >
                            Request New Reset Link
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                            <FaCheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Password Reset Successful!
                        </h2>
                        <p className="text-gray-600 mb-2">
                            Your password has been successfully reset.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            {message}
                        </p>
                        <div className="space-y-3">
                            <Link
                                to="/login"
                                className="btn-primary"
                            >
                                Go to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
                        <FaLock className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Reset Your Password
                    </h2>
                    <p className="text-gray-600">
                        Enter your new password below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}

                    {message && (
                        <div className="success-message">
                            ✅ {message}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input pr-10"
                                placeholder="Enter your new password"
                                disabled={loading}
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="form-input pr-10"
                                placeholder="Confirm your new password"
                                disabled={loading}
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={loading}
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Resetting password...
                            </div>
                        ) : (
                            'Reset Password'
                        )}
                    </button>

                    <div className="back-to-login">
                        <Link
                            to="/login"
                            className="btn-link"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;




