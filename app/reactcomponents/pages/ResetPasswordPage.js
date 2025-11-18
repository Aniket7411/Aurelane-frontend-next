'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FaArrowLeft, FaCheckCircle, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [verifyingToken, setVerifyingToken] = useState(true);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (errorParam) {
            if (errorParam === 'invalid_token') {
                setError('Invalid or expired reset token');
            } else if (errorParam === 'server_error') {
                setError('Server error. Please try again later.');
            } else {
                setError('An error occurred with your reset link.');
            }
            setVerifyingToken(false);
        } else if (tokenParam) {
            setToken(tokenParam);
            verifyToken(tokenParam);
        } else {
            setError('No reset token provided');
            setVerifyingToken(false);
        }
    }, [searchParams]);

    const verifyToken = async (tokenToVerify) => {
        try {
            const response = await authAPI.verifyResetToken(tokenToVerify);
            if (!response.success) {
                setError(response.message || 'Invalid or expired reset token');
            }
        } catch (err) {
            setError('Failed to verify reset token');
        } finally {
            setVerifyingToken(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        // Validation
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (!token) {
            setError('No reset token available');
            setLoading(false);
            return;
        }

        try {
            const result = await authAPI.resetPassword(token, password);

            if (result.success) {
                setSuccess(true);
                setMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(result.message || 'Failed to reset password');
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
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

    if (error && !token) {
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
                            {error}
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
                            <button
                                onClick={() => navigate('/login')}
                                className="btn-primary"
                            >
                                Go to Login
                            </button>
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input pr-10"
                                placeholder="Enter new password"
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
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-input pr-10"
                                placeholder="Confirm new password"
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
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Resetting...
                            </div>
                        ) : (
                            'Reset Password'
                        )}
                    </button>

                    <div className="back-to-login">
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-link"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
