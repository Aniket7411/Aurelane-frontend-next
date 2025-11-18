'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, reviewAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { generateInvoiceHTML } from '../utils/invoiceGenerator';
import { FaFilter, FaStar, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';

const MyOrders = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { showSuccess, showError, showWarning } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewItem, setReviewItem] = useState(null);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: ''
    });
    const [submittingReview, setSubmittingReview] = useState(false);

    const cancelReasons = [
        'Found a better price elsewhere',
        'Changed my mind',
        'Ordered by mistake',
        'Need to change delivery address',
        'Delivery time too long',
        'Other'
    ];

    useEffect(() => {
        if (isAuthenticated) {
            // Check URL params for status filter
            const urlParams = new URLSearchParams(window.location.search);
            const statusParam = urlParams.get('status');
            if (statusParam && statusParam !== statusFilter) {
                setStatusFilter(statusParam);
            }
            loadOrders();
        }
    }, [isAuthenticated]);

    // Update URL when filter changes (but don't reload orders)
    useEffect(() => {
        const url = new URL(window.location);
        if (statusFilter === 'all') {
            url.searchParams.delete('status');
        } else {
            url.searchParams.set('status', statusFilter);
        }
        window.history.replaceState({}, '', url);
    }, [statusFilter]);

    const loadOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await orderAPI.getOrders();
            if (response.success) {
                // Always load all orders, filtering happens in getFilteredOrders
                const allOrders = response.data || response.orders || [];
                setOrders(allOrders);
            } else {
                setError('Failed to load orders');
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            setError(error.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = (order, item) => {
        setReviewItem({ order, item });
        setReviewData({ rating: 5, comment: '' });
        setShowReviewModal(true);
    };

    const handleSubmitReview = async () => {
        if (!reviewData.comment.trim()) {
            showWarning('Please write a review comment');
            return;
        }

        setSubmittingReview(true);
        try {
            const response = await reviewAPI.submitReview(reviewItem.item.gemId || reviewItem.item.id, {
                rating: reviewData.rating,
                comment: reviewData.comment.trim(),
                orderId: reviewItem.order.id
            });

            if (response.success) {
                showSuccess('Review submitted successfully! Thank you for your feedback.');
                setShowReviewModal(false);
                setReviewItem(null);
                setReviewData({ rating: 5, comment: '' });
                // Optionally reload orders to show review status
                loadOrders();
            } else {
                showError(response.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            showError(error.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const getFilteredOrders = () => {
        if (statusFilter === 'all') return orders;
        return orders.filter(order =>
            order.status?.toLowerCase() === statusFilter.toLowerCase()
        );
    };

    const getDeliveredOrders = () => {
        return orders.filter(order =>
            order.status?.toLowerCase() === 'delivered'
        );
    };

    const handleCancelOrder = (order) => {
        setSelectedOrder(order);
        setCancelReason('');
        setOtherReason('');
        setShowCancelModal(true);
    };

    const confirmCancelOrder = async () => {
        if (!cancelReason) {
            showWarning('Please select a reason for cancellation');
            return;
        }

        if (cancelReason === 'Other' && !otherReason.trim()) {
            showWarning('Please specify the reason for cancellation');
            return;
        }

        setCancelLoading(true);

        try {
            const finalReason = cancelReason === 'Other' ? otherReason : cancelReason;

            const response = await orderAPI.cancelOrder(selectedOrder.id, finalReason);

            if (response.success) {
                // Update order status locally
                setOrders(orders.map(order =>
                    order.id === selectedOrder.id
                        ? { ...order, status: 'Cancelled', cancelReason: finalReason }
                        : order
                ));

                showSuccess('Order cancelled successfully');
                setShowCancelModal(false);
                setSelectedOrder(null);
                setCancelReason('');
                setOtherReason('');
            } else {
                showError(response.message || 'Failed to cancel order. Please try again.');
            }
        } catch (error) {
            showError(error.message || 'Failed to cancel order. Please try again.');
            console.error('Error cancelling order:', error);
        } finally {
            setCancelLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase();
        switch (statusLower) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const canCancelOrder = (status) => {
        const statusLower = status?.toLowerCase();
        return statusLower === 'pending' || statusLower === 'processing';
    };

    const handleDownloadInvoice = async (order) => {
        try {
            // Method 1: Try to get PDF from backend
            try {
                const response = await orderAPI.getOrderInvoice(order.id);
                const url = window.URL.createObjectURL(new Blob([response]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Invoice_${order.id}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                return;
            } catch (backendError) {
                console.log('Backend PDF not available, generating client-side...');
            }

            // Method 2: Generate HTML and print/save
            const invoiceHTML = generateInvoiceHTML(order);
            const printWindow = window.open('', '_blank');
            printWindow.document.write(invoiceHTML);
            printWindow.document.close();

            // Wait for content to load then trigger print
            printWindow.onload = () => {
                printWindow.print();
            };
        } catch (error) {
            console.error('Error downloading invoice:', error);
            showError('Failed to generate invoice. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">⏳</div>
                        <p className="text-gray-600">Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    const filteredOrders = getFilteredOrders();
    const deliveredOrders = getDeliveredOrders();

    if (!loading && orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-600 mb-8">Start shopping to see your orders here.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-600 mt-2">{filteredOrders.length} order(s) found</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>

                {/* Status Filter */}
                <div className="mb-6 flex items-center space-x-4">
                    <FaFilter className="text-gray-600" />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            const url = new URL(window.location);
                            if (e.target.value === 'all') {
                                url.searchParams.delete('status');
                            } else {
                                url.searchParams.set('status', e.target.value);
                            }
                            window.history.pushState({}, '', url);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Delivered Orders Section (for reviews) */}
                {deliveredOrders.length > 0 && statusFilter === 'all' && (
                    <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <FaStar className="text-yellow-500 mr-2" />
                            Review Your Delivered Items
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Help other buyers by sharing your experience with these items
                        </p>
                        <div className="space-y-4">
                            {deliveredOrders.map((order) =>
                                order.items?.map((item, itemIndex) => (
                                    <div key={`${order.id}-${itemIndex}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image || '/placeholder-gem.jpg'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                                                <p className="text-sm text-gray-600">Order #{order.id} • Delivered</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleReview(order, item)}
                                            className="ml-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center space-x-2"
                                        >
                                            <FaStar />
                                            <span>Write Review</span>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Orders List */}
                <div className="space-y-6">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-600">No orders match the selected filter.</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.id || order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex flex-wrap items-center gap-6">
                                            <div>
                                                <p className="text-sm text-gray-600">Order ID</p>
                                                <p className="font-semibold text-gray-900">{order.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Order Date</p>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Total Amount</p>
                                                <p className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <button
                                                onClick={() => handleDownloadInvoice(order)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                            >
                                                Download Invoice
                                            </button>
                                            <button
                                                onClick={() => navigate(`/order-tracking/${order.id}`)}
                                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                                            >
                                                Track Order
                                            </button>
                                            {canCancelOrder(order.status) && (
                                                <button
                                                    onClick={() => handleCancelOrder(order)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="px-6 py-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.image || '/placeholder-gem.jpg'}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                                    <p className="text-sm text-emerald-600 font-medium">{item.category}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.sizeWeight} {item.sizeUnit} • Quantity: {item.quantity}
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                                        ₹{item.price.toLocaleString()} × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                    {order.status?.toLowerCase() === 'delivered' && (
                                                        <button
                                                            onClick={() => handleReview(order, item)}
                                                            className="mt-2 px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs font-medium flex items-center space-x-1"
                                                        >
                                                            <FaStar className="text-xs" />
                                                            <span>Write Review</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h3>
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium text-gray-900">
                                            {order.shippingAddress.firstName && order.shippingAddress.lastName
                                                ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                                                : order.shippingAddress.name || 'N/A'}
                                        </p>
                                        <p>{order.shippingAddress.address || order.shippingAddress.addressLine1}</p>
                                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                        <p>
                                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                        </p>
                                        <p>Phone: {order.shippingAddress.phone}</p>
                                        {order.shippingAddress.email && <p>Email: {order.shippingAddress.email}</p>}
                                    </div>
                                </div>

                                {/* Cancellation Reason (if cancelled) */}
                                {order.status?.toLowerCase() === 'cancelled' && order.cancelReason && (
                                    <div className="px-6 py-3 bg-red-50 border-t border-red-100">
                                        <p className="text-sm text-red-800">
                                            <span className="font-semibold">Cancellation Reason: </span>
                                            {order.cancelReason}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Cancel Order Modal */}
            {showCancelModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Cancel Order #{selectedOrder.id}
                        </h3>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-3">
                                Please select a reason for cancelling this order:
                            </p>
                            <div className="space-y-2">
                                {cancelReasons.map((reason) => (
                                    <label key={reason} className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="cancelReason"
                                            value={reason}
                                            checked={cancelReason === reason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm text-gray-700">{reason}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {cancelReason === 'Other' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Please specify the reason
                                </label>
                                <textarea
                                    value={otherReason}
                                    onChange={(e) => setOtherReason(e.target.value)}
                                    placeholder="Enter your reason here..."
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        )}

                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setSelectedOrder(null);
                                    setCancelReason('');
                                    setOtherReason('');
                                }}
                                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                disabled={cancelLoading}
                            >
                                Close
                            </button>
                            <button
                                onClick={confirmCancelOrder}
                                disabled={cancelLoading}
                                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            <AnimatePresence>
                {showReviewModal && reviewItem && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-900">Write a Review</h3>
                                <button
                                    onClick={() => {
                                        setShowReviewModal(false);
                                        setReviewItem(null);
                                        setReviewData({ rating: 5, comment: '' });
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={reviewItem.item.image || '/placeholder-gem.jpg'}
                                            alt={reviewItem.item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{reviewItem.item.name}</h4>
                                        <p className="text-sm text-gray-600">Order #{reviewItem.order.id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rating *
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                className={`text-3xl transition-colors ${star <= reviewData.rating
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            >
                                                <FaStar className="fill-current" />
                                            </button>
                                        ))}
                                        <span className="ml-2 text-sm text-gray-600">
                                            {reviewData.rating} / 5
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Review *
                                    </label>
                                    <textarea
                                        value={reviewData.comment}
                                        onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                        placeholder="Share your experience with this product..."
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowReviewModal(false);
                                            setReviewItem(null);
                                            setReviewData({ rating: 5, comment: '' });
                                        }}
                                        disabled={submittingReview}
                                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmitReview}
                                        disabled={submittingReview || !reviewData.comment.trim()}
                                        className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyOrders;

