'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaBox, FaHome, FaFileInvoice } from 'react-icons/fa';
import { orderAPI } from '../services/api';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const orderId = searchParams.get('orderId');
    const paymentId = searchParams.get('paymentId');
    const amount = searchParams.get('amount');

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        } else {
            setLoading(false);
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await orderAPI.getOrderById(orderId);
            if (response.success) {
                setOrderDetails(response.data || response.order);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = () => {
        // This will be implemented when backend provides invoice endpoint
        window.open(`/api/orders/${orderId}/invoice`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
            >
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="flex justify-center mb-6"
                >
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                        <FaCheckCircle className="w-16 h-16 text-emerald-600" />
                    </div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Payment Successful! 🎉
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                        Thank you for your purchase
                    </p>
                    <p className="text-sm text-gray-500">
                        Your order has been confirmed and is being processed
                    </p>
                </motion.div>

                {/* Order Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-6 mb-6"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FaBox className="mr-2 text-emerald-600" />
                        Order Information
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Order ID</span>
                            <span className="font-semibold text-gray-900 font-mono">
                                {orderId || 'N/A'}
                            </span>
                        </div>
                        {paymentId && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Payment ID</span>
                                <span className="font-semibold text-gray-900 font-mono text-sm">
                                    {paymentId}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Amount Paid</span>
                            <span className="font-bold text-emerald-600 text-xl">
                                ₹{amount ? parseFloat(amount).toLocaleString() : orderDetails?.totalAmount?.toLocaleString() || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Payment Status</span>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                                Paid
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Order Date</span>
                            <span className="font-medium text-gray-900">
                                {new Date().toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* What's Next Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-blue-50 rounded-2xl p-6 mb-6"
                >
                    <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-start">
                            <span className="inline-block w-6 h-6 bg-emerald-500 text-white rounded-full text-center mr-3 flex-shrink-0">1</span>
                            <span>You'll receive an order confirmation email shortly</span>
                        </div>
                        <div className="flex items-start">
                            <span className="inline-block w-6 h-6 bg-emerald-500 text-white rounded-full text-center mr-3 flex-shrink-0">2</span>
                            <span>We'll start processing your order immediately</span>
                        </div>
                        <div className="flex items-start">
                            <span className="inline-block w-6 h-6 bg-emerald-500 text-white rounded-full text-center mr-3 flex-shrink-0">3</span>
                            <span>You can track your order status in "My Orders" section</span>
                        </div>
                        <div className="flex items-start">
                            <span className="inline-block w-6 h-6 bg-emerald-500 text-white rounded-full text-center mr-3 flex-shrink-0">4</span>
                            <span>Your gems will be delivered within 5-7 business days</span>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                        <FaBox className="w-5 h-5" />
                        <span>View My Orders</span>
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        <FaHome className="w-5 h-5" />
                        <span>Continue Shopping</span>
                    </button>
                </motion.div>

                {/* Download Invoice Button */}
                {orderId && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        onClick={handleDownloadInvoice}
                        className="w-full mt-4 flex items-center justify-center space-x-2 text-emerald-600 px-6 py-3 rounded-xl font-medium hover:bg-emerald-50 transition-colors"
                    >
                        <FaFileInvoice className="w-5 h-5" />
                        <span>Download Invoice</span>
                    </motion.button>
                )}

                {/* Support Message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center text-sm text-gray-500 mt-6"
                >
                    Need help? Contact our support team at{' '}
                    <a href="mailto:support@aurelane.com" className="text-emerald-600 hover:underline">
                        support@aurelane.com
                    </a>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;

