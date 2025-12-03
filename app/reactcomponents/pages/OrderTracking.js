'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { orderAPI } from '../services/api';

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderTracking();
        }
    }, [orderId]);

    const fetchOrderTracking = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await orderAPI.trackOrder(orderId);
            if (response.success) {
                setOrder(response.data || response.order);
            } else {
                setError('Failed to fetch order tracking information');
            }
        } catch (err) {
            console.error('Error tracking order:', err);
            setError(err.message || 'Failed to fetch order tracking information');
        } finally {
            setLoading(false);
        }
    };

    const getStatusSteps = () => {
        const allSteps = [
            { key: 'placed', label: 'Order Placed', icon: FaBox, description: 'We have received your order' },
            { key: 'confirmed', label: 'Order Confirmed', icon: FaCheckCircle, description: 'Your order has been confirmed' },
            { key: 'processing', label: 'Processing', icon: FaBox, description: 'We are preparing your order' },
            { key: 'shipped', label: 'Shipped', icon: FaShippingFast, description: 'Your order is on the way' },
            { key: 'delivered', label: 'Delivered', icon: FaCheckCircle, description: 'Order delivered successfully' }
        ];

        // Handle cancelled orders
        if (order?.status?.toLowerCase() === 'cancelled') {
            return [
                allSteps[0], // placed
                { key: 'cancelled', label: 'Cancelled', icon: FaTimesCircle, description: 'Order has been cancelled' }
            ];
        }

        return allSteps;
    };

    const getCurrentStepIndex = () => {
        if (!order) return 0;
        const status = order.status?.toLowerCase();

        const statusMap = {
            'pending': 0,
            'placed': 0,
            'confirmed': 1,
            'processing': 2,
            'shipped': 3,
            'delivered': 4,
            'cancelled': 1
        };

        return statusMap[status] || 0;
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'text-yellow-600 bg-yellow-100',
            'confirmed': 'text-blue-600 bg-blue-100',
            'processing': 'text-purple-600 bg-purple-100',
            'shipped': 'text-indigo-600 bg-indigo-100',
            'delivered': 'text-green-600 bg-green-100',
            'cancelled': 'text-red-600 bg-red-100'
        };
        return colors[status?.toLowerCase()] || 'text-gray-600 bg-gray-100';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading tracking information...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
                >
                    <FaTimesCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Order</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Back to Orders
                    </button>
                </motion.div>
            </div>
        );
    }

    const steps = getStatusSteps();
    const currentStep = getCurrentStepIndex();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/my-orders')}
                    className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
                >
                    <FaArrowLeft />
                    <span className="font-medium">Back to Orders</span>
                </button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6 mb-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Track Order
                            </h1>
                            <p className="text-gray-600">
                                Order ID: <span className="font-semibold font-mono">{orderId}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order?.status)}`}>
                                {order?.status?.toUpperCase() || 'UNKNOWN'}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Progress Tracker */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-8">Order Progress</h2>
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        <div
                            className="absolute left-6 top-0 w-0.5 bg-emerald-600 transition-all duration-500"
                            style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {/* Steps */}
                        <div className="space-y-8">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isCompleted = index <= currentStep;
                                const isCurrent = index === currentStep;
                                const isCancelled = step.key === 'cancelled';

                                return (
                                    <motion.div
                                        key={step.key}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="relative flex items-start"
                                    >
                                        {/* Icon Circle */}
                                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${isCancelled
                                                ? 'bg-red-600'
                                                : isCompleted
                                                    ? 'bg-emerald-600'
                                                    : 'bg-gray-300'
                                            } transition-all duration-300 ${isCurrent ? 'ring-4 ring-emerald-200' : ''}`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>

                                        {/* Content */}
                                        <div className="ml-4 flex-1">
                                            <h3 className={`text-lg font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'
                                                }`}>
                                                {step.label}
                                            </h3>
                                            <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'
                                                }`}>
                                                {step.description}
                                            </p>
                                            {order?.trackingHistory?.[step.key] && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(order.trackingHistory[step.key]).toLocaleString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipping Address */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-emerald-600" />
                            Delivery Address
                        </h2>
                        {order?.shippingAddress ? (
                            <div className="text-gray-700 space-y-1">
                                <p className="font-semibold">
                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                </p>
                                <p>{order.shippingAddress.address}</p>
                                <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                </p>
                                <p className="flex items-center mt-2">
                                    <FaPhone className="mr-2 text-emerald-600" />
                                    {order.shippingAddress.phone}
                                </p>
                                <p className="flex items-center">
                                    <FaEnvelope className="mr-2 text-emerald-600" />
                                    {order.shippingAddress.email}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No address information available</p>
                        )}
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <FaBox className="mr-2 text-emerald-600" />
                            Order Summary
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order Date</span>
                                <span className="font-medium">
                                    {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Items</span>
                                <span className="font-medium">{order?.items?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="font-medium capitalize">{order?.paymentMethod || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t">
                                <span className="text-gray-900 font-semibold">Total Amount</span>
                                <span className="text-emerald-600 font-bold text-xl">
                                    ₹{(order?.totalAmount || order?.totalPrice || order?.total || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Expected Delivery */}
                        {order?.status !== 'Cancelled' && order?.status !== 'Delivered' && (
                            <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Expected Delivery:</span>
                                    <br />
                                    {order?.expectedDelivery
                                        ? new Date(order.expectedDelivery).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })
                                        : '5-7 business days'}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Order Items */}
                {order?.items && order.items.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-lg p-6 mt-6"
                    >
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image || item.gem?.images?.[0] || '/placeholder-gem.jpg'}
                                            alt={item.name || item.gem?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">
                                            {item.name || item.gem?.name || 'Unknown Item'}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Quantity: {item.quantity} × ₹{item.price?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;

