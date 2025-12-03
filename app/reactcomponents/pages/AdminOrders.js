'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI, authAPI } from '../services/api';
import { FaShoppingBag, FaSearch, FaFilter, FaEye, FaRupeeSign, FaEdit, FaTimesCircle, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCreditCard, FaBox, FaTruck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { showError, showSuccess, showWarning } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllOrders({
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      });

      if (response.success) {
        setOrders(response.orders || response.data?.orders || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      showError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus, showError]);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const user = authAPI.getCurrentUser();
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      return;
    }

    const user = authAPI.getCurrentUser();
    if (user?.role !== 'admin') {
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchOrders]);

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      showWarning('Please select a status');
      return;
    }

    if (newStatus === 'shipped' && !trackingNumber.trim()) {
      showWarning('Please enter a tracking number for shipped orders');
      return;
    }

    setUpdatingStatus(selectedOrder.id || selectedOrder._id);
    try {
      const response = await adminAPI.updateOrderStatus(
        selectedOrder.id || selectedOrder._id,
        newStatus,
        newStatus === 'shipped' ? { trackingNumber: trackingNumber.trim() } : {}
      );

      if (response.success) {
        showSuccess(`Order status updated to ${newStatus}!`);
        setShowStatusModal(false);
        setSelectedOrder(null);
        setNewStatus('');
        setTrackingNumber('');
        fetchOrders();
        // Refresh order details if modal is open
        if (showDetailsModal && orderDetails) {
          const orderId = orderDetails.id || orderDetails._id;
          fetchOrderDetails(orderId);
        }
      } else {
        showError(response.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showError(error.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'pending');
    setTrackingNumber(order.trackingNumber || '');
    setShowStatusModal(true);
  };

  const fetchOrderDetails = async (orderId) => {
    setLoadingDetails(true);
    try {
      const response = await adminAPI.getOrderById(orderId);
      if (response.success) {
        setOrderDetails(response.data?.order || response.order);
        setShowDetailsModal(true);
      } else {
        showError(response.message || 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      showError(error.message || 'Failed to fetch order details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const openDetailsModal = (order) => {
    const orderId = order.id || order._id;
    fetchOrderDetails(orderId);
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.id || order._id || '').toString().includes(searchTerm) ||
      (order.buyer?.name || order.buyer?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shippingAddress?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status?.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status?.toLowerCase() === 'pending').length,
    processing: orders.filter(o => o.status?.toLowerCase() === 'processing').length,
    delivered: orders.filter(o => o.status?.toLowerCase() === 'delivered').length,
    cancelled: orders.filter(o => o.status?.toLowerCase() === 'cancelled').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
              <p className="text-gray-600">View and manage all orders</p>
            </div>
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <FaShoppingBag className="text-blue-600 text-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <p className="text-xl font-bold text-emerald-600">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <FaRupeeSign className="text-emerald-600 text-xl" />
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID, buyer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <motion.div
                key={order.id || order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.orderNumber ? `Order ${order.orderNumber}` : `Order #${order.id || order._id}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.buyer?.name || order.shippingAddress?.firstName || 'Unknown Buyer'}
                        {' • '}
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status || 'N/A'}
                      </span>
                      <button
                        onClick={() => openStatusModal(order)}
                        disabled={updatingStatus === (order.id || order._id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaEdit />
                        <span>Update Status</span>
                      </button>
                      <button
                        onClick={() => openDetailsModal(order)}
                        disabled={loadingDetails}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaEye />
                        <span>{loadingDetails ? 'Loading...' : 'View Details'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Buyer</p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.buyer?.name || order.shippingAddress?.firstName || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.buyer?.email || order.shippingAddress?.email || ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Shipping Address</p>
                      <p className="text-sm text-gray-900">
                        {order.shippingAddress?.address || order.shippingAddress?.addressLine1 || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.shippingAddress?.city || ''}, {order.shippingAddress?.state || ''} - {order.shippingAddress?.pincode || ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order Total</p>
                      <p className="text-lg font-bold text-emerald-600">
                        ₹{(order.totalAmount || order.total || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-500 mb-2">Order Items</p>
                    <div className="space-y-2">
                      {order.items?.slice(0, 3).map((item, index) => {
                        const product = item.product || item.gem || {};
                        const itemName = item.name || product.name || 'Product';
                        const itemImage = item.image || product.image || product.heroImage || product.images?.[0] || '/placeholder-gem.jpg';
                        return (
                          <div key={index} className="flex items-center space-x-3 text-sm">
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
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{itemName}</p>
                              <p className="text-xs text-gray-600">
                                Qty: {item.quantity} × ₹{item.price?.toLocaleString() || '0'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {order.items?.length > 3 && (
                        <p className="text-xs text-gray-500">+{order.items.length - 3} more items</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Order Details Modal */}
        {showDetailsModal && orderDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                <h3 className="text-xl font-semibold text-gray-900">
                  Order Details - {orderDetails.orderNumber || orderDetails.id || orderDetails._id}
                </h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setOrderDetails(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimesCircle className="text-2xl" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Status & Payment Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FaBox className="mr-2" />
                      Order Status
                    </h4>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(orderDetails.status)}`}>
                      {orderDetails.status || 'N/A'}
                    </span>
                    {orderDetails.trackingNumber && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600">Tracking Number:</p>
                        <p className="text-sm font-medium text-gray-900">{orderDetails.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FaCreditCard className="mr-2" />
                      Payment Status
                    </h4>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                      orderDetails.paymentDetails?.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : orderDetails.paymentDetails?.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {orderDetails.paymentDetails?.status || orderDetails.paymentStatus || 'N/A'}
                    </span>
                    {orderDetails.paymentDetails?.method && (
                      <p className="text-xs text-gray-600 mt-2">
                        Method: {orderDetails.paymentDetails.method}
                      </p>
                    )}
                  </div>
                </div>

                {/* Buyer Information */}
                {orderDetails.buyer && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <FaUser className="mr-2" />
                      Buyer Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Name</p>
                        <p className="text-sm font-medium text-gray-900">{orderDetails.buyer.name || orderDetails.buyer.fullName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center">
                          <FaEnvelope className="mr-1" />
                          Email
                        </p>
                        <p className="text-sm text-gray-900">{orderDetails.buyer.email || 'N/A'}</p>
                      </div>
                      {orderDetails.buyer.phone && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1 flex items-center">
                            <FaPhone className="mr-1" />
                            Phone
                          </p>
                          <p className="text-sm text-gray-900">{orderDetails.buyer.phone || orderDetails.buyer.phoneNumber || 'N/A'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                {orderDetails.items && orderDetails.items.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Items ({orderDetails.items.length})</h4>
                    <div className="space-y-3">
                      {orderDetails.items.map((item, index) => {
                        const product = item.product || item.gem || {};
                        const seller = item.seller || product.seller || {};
                        return (
                          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start space-x-4">
                              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={product.image || product.heroImage || product.images?.[0] || '/placeholder-gem.jpg'}
                                  alt={product.name || 'Product'}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = '/placeholder-gem.jpg';
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-semibold text-gray-900">{product.name || 'Product Name'}</h5>
                                {product.category && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    {product.category}
                                    {product.subcategory && ` • ${product.subcategory}`}
                                  </p>
                                )}
                                {seller.name && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Seller: {seller.name}
                                    {seller.shopName && ` (${seller.shopName})`}
                                  </p>
                                )}
                                <div className="mt-2 flex items-center justify-between">
                                  <div>
                                    <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-xs text-gray-600">Price: ₹{item.price?.toLocaleString() || '0'}</p>
                                  </div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                {orderDetails.shippingAddress && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      Shipping Address
                    </h4>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">
                        {orderDetails.shippingAddress.name || 
                         `${orderDetails.shippingAddress.firstName || ''} ${orderDetails.shippingAddress.lastName || ''}`.trim() || 
                         'N/A'}
                      </p>
                      {orderDetails.shippingAddress.phone && (
                        <p className="text-gray-600 mt-1 flex items-center">
                          <FaPhone className="mr-1 text-xs" />
                          {orderDetails.shippingAddress.phone}
                        </p>
                      )}
                      <p className="text-gray-700 mt-2">
                        {orderDetails.shippingAddress.addressLine1 || orderDetails.shippingAddress.address || 'N/A'}
                      </p>
                      {orderDetails.shippingAddress.addressLine2 && (
                        <p className="text-gray-700">{orderDetails.shippingAddress.addressLine2}</p>
                      )}
                      <p className="text-gray-700">
                        {orderDetails.shippingAddress.city || ''}, {orderDetails.shippingAddress.state || ''} - {orderDetails.shippingAddress.pincode || ''}
                      </p>
                      {orderDetails.shippingAddress.country && (
                        <p className="text-gray-700">{orderDetails.shippingAddress.country}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Details */}
                {orderDetails.paymentDetails && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium text-gray-900">{orderDetails.paymentDetails.method || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`font-medium ${
                          orderDetails.paymentDetails.status === 'completed' ? 'text-green-600' : 
                          orderDetails.paymentDetails.status === 'pending' ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {orderDetails.paymentDetails.status || 'N/A'}
                        </span>
                      </div>
                      {orderDetails.paymentDetails.total && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount Paid:</span>
                          <span className="font-medium text-gray-900">₹{orderDetails.paymentDetails.total.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium text-gray-900">
                        ₹{(orderDetails.totalAmount || orderDetails.total || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="border-t border-emerald-200 pt-2 mt-2">
                      <div className="flex justify-between text-base font-bold">
                        <span>Total:</span>
                        <span className="text-emerald-600">
                          ₹{(orderDetails.totalAmount || orderDetails.total || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status History */}
                {orderDetails.statusHistory && orderDetails.statusHistory.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Status History</h4>
                    <div className="space-y-2">
                      {orderDetails.statusHistory.map((history, index) => (
                        <div key={index} className="flex items-center space-x-3 text-sm">
                          <div className={`w-2 h-2 rounded-full ${
                            history.status === 'delivered' ? 'bg-green-500' :
                            history.status === 'shipped' ? 'bg-purple-500' :
                            history.status === 'processing' ? 'bg-blue-500' :
                            history.status === 'cancelled' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 capitalize">{history.status}</p>
                            <p className="text-xs text-gray-500">
                              {history.timestamp ? new Date(history.timestamp).toLocaleString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {orderDetails.createdAt && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order Date</p>
                      <p className="text-gray-900">{new Date(orderDetails.createdAt).toLocaleString()}</p>
                    </div>
                  )}
                  {orderDetails.updatedAt && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                      <p className="text-gray-900">{new Date(orderDetails.updatedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setOrderDetails(null);
                      openStatusModal({ id: orderDetails.id || orderDetails._id, status: orderDetails.status, trackingNumber: orderDetails.trackingNumber });
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <FaEdit />
                    <span>Update Status</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setOrderDetails(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Update Order Status
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Order #{selectedOrder.id || selectedOrder._id}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {newStatus === 'shipped' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedOrder(null);
                    setNewStatus('');
                    setTrackingNumber('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus === (selectedOrder.id || selectedOrder._id)}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus === (selectedOrder.id || selectedOrder._id) ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

