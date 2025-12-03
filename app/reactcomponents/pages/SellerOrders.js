'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, authAPI } from '../services/api';
import { FaArrowLeft, FaTruck, FaBox, FaCheckCircle, FaTimesCircle, FaEye, FaFilter, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SellerOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0
    });
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);

    const user = authAPI.getCurrentUser();

    useEffect(() => {
        if (!authAPI.isAuthenticated() || user?.role !== 'seller') {
            navigate('/login');
            return;
        }
        // Check URL params for status filter
        const urlParams = new URLSearchParams(window.location.search);
        const statusParam = urlParams.get('status');
        if (statusParam && statusParam !== statusFilter) {
            setStatusFilter(statusParam);
        }
        fetchOrders();
        fetchOrderStats();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = statusFilter !== 'all' ? { status: statusFilter } : {};
            const response = await orderAPI.getSellerOrders(params);
            if (response.success) {
                setOrders(response.orders || response.data || []);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderStats = async () => {
        try {
            const response = await orderAPI.getSellerOrderStats();
            if (response.success) {
                setStats(response.stats || {
                    totalOrders: 0,
                    pendingOrders: 0,
                    processingOrders: 0,
                    shippedOrders: 0,
                    deliveredOrders: 0,
                    totalRevenue: 0
                });
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        if (newStatus === 'shipped') {
            setCurrentOrderId(orderId);
            setShowTrackingModal(true);
            return;
        }

        setUpdatingStatus(orderId);
        try {
            const response = await orderAPI.updateOrderStatus(orderId, newStatus);
            if (response.success) {
                alert(`Order status updated to ${newStatus}!`);
                fetchOrders();
                fetchOrderStats();
            } else {
                alert(response.message || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert(error.message || 'Failed to update order status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleShipping = async () => {
        if (!trackingNumber.trim()) {
            alert('Please enter a tracking number');
            return;
        }

        setUpdatingStatus(currentOrderId);
        try {
            const response = await orderAPI.updateOrderStatus(currentOrderId, 'shipped', {
                trackingNumber: trackingNumber.trim()
            });
            if (response.success) {
                alert('Order marked as shipped with tracking number!');
                setShowTrackingModal(false);
                setTrackingNumber('');
                setCurrentOrderId(null);
                fetchOrders();
                fetchOrderStats();
            } else {
                alert(response.message || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert(error.message || 'Failed to update order status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaBox className="inline-block mr-2" />;
            case 'processing':
                return <FaBox className="inline-block mr-2" />;
            case 'shipped':
                return <FaTruck className="inline-block mr-2" />;
            case 'delivered':
                return <FaCheckCircle className="inline-block mr-2" />;
            case 'cancelled':
                return <FaTimesCircle className="inline-block mr-2" />;
            default:
                return null;
        }
    };

    const getNextStatus = (currentStatus) => {
        const statusFlow = {
            pending: 'processing',
            processing: 'shipped',
            shipped: 'delivered'
        };
        return statusFlow[currentStatus];
    };

    const formatPrice = (price) => {
        const numPrice = Number(price) || 0;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(numPrice);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/seller-dashboard')}
                        className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-4 transition-colors"
                    >
                        <FaArrowLeft />
                        <span>Back to Dashboard</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
                    <p className="text-gray-600">Manage and track all your orders</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-4"
                    >
                        <p className="text-xs text-gray-600 mb-1">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-lg p-4"
                    >
                        <p className="text-xs text-gray-600 mb-1">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg p-4"
                    >
                        <p className="text-xs text-gray-600 mb-1">Processing</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.processingOrders}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-lg p-4"
                    >
                        <p className="text-xs text-gray-600 mb-1">Shipped</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.shippedOrders}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-lg p-4"
                    >
                        <p className="text-xs text-gray-600 mb-1">Delivered</p>
                        <p className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl shadow-lg p-4"
                    >
                        <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                        <p className="text-xl font-bold text-emerald-600">{formatPrice(stats.totalRevenue)}</p>
                    </motion.div>
                </div>

                {/* Filter */}
                <div className="mb-6 flex items-center space-x-4">
                    <FaFilter className="text-gray-600" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Orders List */}
                {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h3>
                        <p className="text-gray-600">You don't have any orders with this status yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <motion.div
                                key={order._id || order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Order #{order.orderId || order._id || order.id}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Placed on {new Date(order.createdAt || order.orderDate).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-emerald-600 hover:text-emerald-700"
                                            title="View Details"
                                        >
                                            <FaEye className="text-xl" />
                                        </button>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-4 space-y-2">
                                    {order.items?.map((item, index) => {
                                        const gem = item.gem || {};
                                        const itemImage = item.image || gem.heroImage || gem.image || gem.images?.[0] || '/placeholder-gem.jpg';
                                        const itemName = item.name || gem.name || 'Product';
                                        return (
                                            <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={itemImage}
                                                        alt={itemName}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-gem.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">{itemName}</h4>
                                                    <p className="text-xs text-gray-600">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Order Footer */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 pt-4 border-t">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-xl font-bold text-gray-900">{formatPrice(order.totalPrice || order.totalAmount || order.total || 0)}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        {getNextStatus(order.status) && (
                                            <button
                                                onClick={() => handleStatusUpdate(order._id || order.id, getNextStatus(order.status))}
                                                disabled={updatingStatus === (order._id || order.id)}
                                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                            >
                                                {updatingStatus === (order._id || order.id) ? 'Updating...' : `Mark as ${getNextStatus(order.status).charAt(0).toUpperCase() + getNextStatus(order.status).slice(1)}`}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                {order.shippingAddress && (
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-xs font-semibold text-gray-700 mb-1">Shipping Address:</p>
                                        <p className="text-xs text-gray-600">
                                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                        </p>
                                        <p className="text-xs text-gray-600">{order.shippingAddress.address}</p>
                                        <p className="text-xs text-gray-600">
                                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                        </p>
                                        <p className="text-xs text-gray-600">Phone: {order.shippingAddress.phone}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Order Details - {selectedOrder.orderId || selectedOrder._id || selectedOrder.id}
                                </h3>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimesCircle className="text-2xl" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Order Status */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Order Status</h4>
                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(selectedOrder.status)}`}>
                                        {getStatusIcon(selectedOrder.status)}
                                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                    </span>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Items</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item, index) => {
                                            const gem = item.gem || {};
                                            const itemImage = item.image || gem.heroImage || gem.image || gem.images?.[0] || '/placeholder-gem.jpg';
                                            const itemName = item.name || gem.name || 'Product';
                                            return (
                                                <div key={index} className="flex items-center space-x-4 pb-3 border-b last:border-b-0">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={itemImage}
                                                            alt={itemName}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder-gem.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="text-sm font-medium text-gray-900">{itemName}</h5>
                                                        <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                                                        <p className="text-sm font-semibold text-gray-900 mt-1">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                {selectedOrder.shippingAddress && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h4>
                                        <div className="bg-gray-50 p-4 rounded-lg text-sm">
                                            <p className="font-medium">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                                            <p className="text-gray-700">{selectedOrder.shippingAddress.phone}</p>
                                            <p className="text-gray-700 mt-2">{selectedOrder.shippingAddress.address}</p>
                                            <p className="text-gray-700">
                                                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                                            </p>
                                            <p className="text-gray-700">{selectedOrder.shippingAddress.pincode}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Order Summary */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">{formatPrice(selectedOrder.totalPrice || selectedOrder.totalAmount || selectedOrder.total || 0)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium text-green-600">Free</span>
                                        </div>
                                        <div className="border-t pt-2">
                                            <div className="flex justify-between text-base font-semibold">
                                                <span>Total Amount</span>
                                                <span>{formatPrice(selectedOrder.totalPrice || selectedOrder.totalAmount || selectedOrder.total || 0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {getNextStatus(selectedOrder.status) && (
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => {
                                                handleStatusUpdate(selectedOrder._id || selectedOrder.id, getNextStatus(selectedOrder.status));
                                                setSelectedOrder(null);
                                            }}
                                            disabled={updatingStatus === (selectedOrder._id || selectedOrder.id)}
                                            className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                        >
                                            {updatingStatus === (selectedOrder._id || selectedOrder.id) ? 'Updating...' : `Mark as ${getNextStatus(selectedOrder.status).charAt(0).toUpperCase() + getNextStatus(selectedOrder.status).slice(1)}`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Tracking Number Modal */}
                {showTrackingModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Tracking Number</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tracking Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="Enter tracking number"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleShipping}
                                        disabled={updatingStatus !== null}
                                        className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {updatingStatus !== null ? 'Updating...' : 'Mark as Shipped'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowTrackingModal(false);
                                            setTrackingNumber('');
                                            setCurrentOrderId(null);
                                        }}
                                        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerOrders;

