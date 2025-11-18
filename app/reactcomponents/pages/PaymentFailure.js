'use client';

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaRedo, FaHome, FaPhone, FaEnvelope } from 'react-icons/fa';

const PaymentFailure = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const errorMessage = searchParams.get('message') || 'Payment was not completed';
    const orderId = searchParams.get('orderId');
    const reason = searchParams.get('reason');

    const handleRetry = () => {
        if (orderId) {
            navigate(`/checkout?retry=true&orderId=${orderId}`);
        } else {
            navigate('/cart');
        }
    };

    const commonIssues = [
        {
            icon: '💳',
            title: 'Insufficient Balance',
            description: 'Ensure your account has sufficient funds'
        },
        {
            icon: '🔒',
            title: 'Card Declined',
            description: 'Contact your bank to enable online transactions'
        },
        {
            icon: '⏱️',
            title: 'Session Timeout',
            description: 'Payment session may have expired, please retry'
        },
        {
            icon: '🌐',
            title: 'Network Issue',
            description: 'Check your internet connection and try again'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
            >
                {/* Error Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="flex justify-center mb-6"
                >
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                        <FaTimesCircle className="w-16 h-16 text-red-600" />
                    </div>
                </motion.div>

                {/* Error Message */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Payment Failed
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                        {errorMessage}
                    </p>
                    <p className="text-sm text-gray-500">
                        Don't worry, your money is safe. No amount has been deducted.
                    </p>
                </motion.div>

                {/* Error Details */}
                {(orderId || reason) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-red-50 rounded-2xl p-6 mb-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Transaction Details
                        </h2>
                        <div className="space-y-2">
                            {orderId && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Order ID</span>
                                    <span className="font-semibold text-gray-900 font-mono">
                                        {orderId}
                                    </span>
                                </div>
                            )}
                            {reason && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Reason</span>
                                    <span className="font-medium text-red-600">
                                        {reason}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Status</span>
                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                    Failed
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Common Issues */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-orange-50 rounded-2xl p-6 mb-6"
                >
                    <h3 className="font-semibold text-gray-900 mb-4">Common Issues</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {commonIssues.map((issue, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="text-2xl mb-2">{issue.icon}</div>
                                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                    {issue.title}
                                </h4>
                                <p className="text-xs text-gray-600">{issue.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
                >
                    <button
                        onClick={handleRetry}
                        className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                        <FaRedo className="w-5 h-5" />
                        <span>Retry Payment</span>
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        <FaHome className="w-5 h-5" />
                        <span>Go to Home</span>
                    </button>
                </motion.div>

                {/* Help Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gray-50 rounded-2xl p-6"
                >
                    <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        If you're facing repeated payment issues, please contact our support team
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <a
                            href="tel:+911234567890"
                            className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                            <FaPhone className="w-4 h-4" />
                            <span className="text-sm font-medium">+91 123 456 7890</span>
                        </a>
                        <a
                            href="mailto:support@aurelane.com"
                            className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                            <FaEnvelope className="w-4 h-4" />
                            <span className="text-sm font-medium">support@aurelane.com</span>
                        </a>
                    </div>
                </motion.div>

                {/* Footer Message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center text-sm text-gray-500 mt-6"
                >
                    Your cart items are saved and you can retry payment anytime
                </motion.p>
            </motion.div>
        </div>
    );
};

export default PaymentFailure;

