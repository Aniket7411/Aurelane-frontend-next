'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { orderAPI, paymentAPI } from '../services/api';
import { FaCreditCard, FaTruck, FaCheck, FaLock } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartSummary, clearCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const { formatPrice, selectedCurrency, convertPrice, baseCurrency } = useCurrency();
    const { showError, showWarning } = useToast();
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');

    // Form states
    const [shippingAddress, setShippingAddress] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [orderNotes, setOrderNotes] = useState('');
    const [showAddressModal, setShowAddressModal] = useState(false);

    const cartSummary = getCartSummary();

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // Load Razorpay script
    useEffect(() => {
        const loadRazorpayScript = () => {
            return new Promise((resolve, reject) => {
                if (window.Razorpay) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load Razorpay script'));
                document.body.appendChild(script);
            });
        };

        loadRazorpayScript().catch(err => {
            console.error('Error loading Razorpay:', err);
        });
    }, []);

    // Initialize Razorpay checkout
    const initializeRazorpay = (razorpayOrder, keyId, orderId) => {
        if (!window.Razorpay) {
            showError('Payment gateway not loaded. Please refresh the page.');
            setLoading(false);
            return;
        }

        const options = {
            key: keyId, // From backend response
            amount: razorpayOrder.amount, // Amount in paise (already from backend)
            currency: razorpayOrder.currency,
            name: 'Aurelane',
            description: `Order ${razorpayOrder.receipt}`,
            order_id: razorpayOrder.id, // Razorpay order ID
            handler: async function (response) {
                // Payment successful - verify payment
                await verifyPayment(response, orderId);
            },
            prefill: {
                name: shippingAddress.name,
                email: shippingAddress.email,
                contact: shippingAddress.phone
            },
            notes: {
                orderId: orderId,
                orderNotes: orderNotes
            },
            theme: {
                color: '#059669'
            },
            modal: {
                ondismiss: function () {
                    // User closed the payment modal
                    setLoading(false);
                    showWarning('Payment cancelled by user');
                }
            }
        };

        const razorpay = new window.Razorpay(options);
        
        razorpay.on('payment.failed', function (response) {
            // Payment failed
            setLoading(false);
            navigate(`/payment-failure?orderId=${orderId}&message=${response.error.description || 'Payment failed'}&reason=${response.error.reason || 'unknown'}`);
        });

        razorpay.open();
    };

    // Verify payment after successful Razorpay payment
    const verifyPayment = async (razorpayResponse, orderId) => {
        try {
            setLoading(true);
            const response = await paymentAPI.verifyPayment({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                orderId: orderId
            });

            const data = response.data || response;
            
            if (data.success) {
                // Payment verified successfully
                clearCart();
                navigate(`/payment-success?orderId=${orderId}&paymentId=${razorpayResponse.razorpay_payment_id}&amount=${cartSummary.total}`);
            } else {
                showError(data.message || 'Payment verification failed');
                navigate(`/payment-failure?orderId=${orderId}&message=${data.message || 'Payment verification failed'}`);
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            const errorMessage = error.response?.data?.message || 'Error verifying payment. Please contact support.';
            showError(errorMessage);
            navigate(`/payment-failure?orderId=${orderId}&message=${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const required = ['name', 'email', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
        for (const field of required) {
            if (!shippingAddress[field] || !shippingAddress[field].trim()) {
                const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase().replace('address line', 'address');
                showWarning(`Please fill in ${fieldName}`);
                return false;
            }
        }
        return true;
    };

    const handlePlaceOrder = () => {
        if (!validateForm()) return;
        setShowAddressModal(true);
    };

    const handleConfirmAddress = () => {
        setShowAddressModal(false);
        proceedWithOrder();
    };

    const proceedWithOrder = async () => {
        setLoading(true);
        try {
            // Prepare order data based on payment method
            if (paymentMethod === 'online') {
                // For online payment, use payment API which creates order + Razorpay order
                // Round prices to avoid decimal issues
                const orderData = {
                    items: cartItems.map(item => {
                        let itemPrice = item.discount && item.discount > 0
                            ? item.discountType === 'percentage'
                                ? item.price - (item.price * item.discount) / 100
                                : item.price - item.discount
                            : item.price;
                        // Round to 2 decimal places for price
                        itemPrice = Math.round(itemPrice * 100) / 100;
                        return {
                            gem: item.id,
                            quantity: item.quantity,
                            price: itemPrice,
                            image: item.image || item.images?.[0] || null,
                            name: item.name || null
                        };
                    }),
                    shippingAddress: {
                        name: shippingAddress.name,
                        phone: shippingAddress.phone,
                        addressLine1: shippingAddress.addressLine1,
                        addressLine2: shippingAddress.addressLine2 || '',
                        city: shippingAddress.city,
                        state: shippingAddress.state,
                        pincode: shippingAddress.pincode,
                        country: shippingAddress.country || 'India'
                    },
                    totalPrice: Math.round(cartSummary.total * 100) / 100
                };

                const response = await paymentAPI.createPaymentOrder(orderData);
                const data = response.data || response;

                if (data.success) {
                    const createdOrderId = data.order?._id || data.order?.id || data.orderId;
                    
                    // Check if required Razorpay data is present
                    if (!data.razorpayOrder || !data.keyId) {
                        showError('Invalid response from payment server. Please try again.');
                        setLoading(false);
                        return;
                    }
                    
                    // Initialize Razorpay with returned data
                    initializeRazorpay(
                        data.razorpayOrder,
                        data.keyId,
                        createdOrderId
                    );
                } else {
                    const errorMsg = data.message || data.error?.description || 'Failed to create payment order. Please try again.';
                    showError(errorMsg);
                    setLoading(false);
                }
            } else {
                // For COD, use regular order API
                const orderData = {
                    items: cartItems.map(item => {
                        let itemPrice = item.discount && item.discount > 0
                            ? item.discountType === 'percentage'
                                ? item.price - (item.price * item.discount) / 100
                                : item.price - item.discount
                            : item.price;
                        // Round to 2 decimal places for price
                        itemPrice = Math.round(itemPrice * 100) / 100;
                        return {
                            gemId: item.id,
                            quantity: item.quantity,
                            price: itemPrice,
                            image: item.image || item.images?.[0] || null,
                            name: item.name || null
                        };
                    }),
                    shippingAddress: {
                        name: shippingAddress.name,
                        phone: shippingAddress.phone,
                        addressLine1: shippingAddress.addressLine1,
                        addressLine2: shippingAddress.addressLine2 || '',
                        city: shippingAddress.city,
                        state: shippingAddress.state,
                        pincode: shippingAddress.pincode,
                        country: shippingAddress.country || 'India'
                    },
                    paymentMethod,
                    orderNotes,
                    totalAmount: cartSummary.total
                };

                const response = await orderAPI.createOrder(orderData);
                const data = response.data || response;

                if (data.success || response.status === 200 || response.status === 201) {
                    const createdOrderId = data.orderId || data.order?.id || data.order?._id;
                    setOrderId(createdOrderId);
                    clearCart();
                    navigate(`/payment-success?orderId=${createdOrderId}&amount=${cartSummary.total}`);
                } else {
                    showError(data.message || response.message || 'Failed to place order. Please try again.');
                }
                setLoading(false);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            let errorMessage = 'Failed to place order. Please try again.';
            
            if (error.response?.data) {
                const errorData = error.response.data;
                errorMessage = errorData.message || errorData.error?.description || errorMessage;
                
                // Handle specific backend validation errors
                if (errorMessage.includes('orderNumber')) {
                    errorMessage = 'Backend error: Order number generation failed. Please contact support.';
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showError(errorMessage);
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center"
                >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheck className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-6">
                        Your order <span className="font-semibold text-emerald-600">{orderId}</span> has been placed and will be processed soon.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            View Orders
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={shippingAddress.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingAddress.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingAddress.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                                    <input
                                        type="text"
                                        name="addressLine1"
                                        value={shippingAddress.addressLine1}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Street address, P.O. box"
                                        required
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                                    <input
                                        type="text"
                                        name="addressLine2"
                                        value={shippingAddress.addressLine2}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Apartment, suite, unit, building, floor, etc."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingAddress.city}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={shippingAddress.state}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={shippingAddress.pincode}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={shippingAddress.country}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                            <div className="space-y-4">
                                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div className="ml-4 flex items-center space-x-3">
                                        <FaTruck className="w-6 h-6 text-emerald-600" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                                            <p className="text-sm text-gray-600">Pay when your order arrives</p>
                                        </div>
                                    </div>
                                </label>
                                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 relative">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div className="ml-4 flex items-center space-x-3">
                                        <FaCreditCard className="w-6 h-6 text-emerald-600" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Online Payment</h3>
                                            <p className="text-sm text-gray-600">Pay securely with card, UPI, or Net Banking</p>
                                            <p className="text-xs text-emerald-600 mt-1">Powered by Razorpay</p>
                                        </div>
                                    </div>
                                    <span className="absolute top-2 right-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
                                        Secure
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Order Notes */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Notes (Optional)</h2>
                            <textarea
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                                rows={3}
                                placeholder="Any special instructions for your order..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* Cart Items */}
                            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-2 sm:space-x-3">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-gem.jpg';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                    <span className="text-xl sm:text-2xl">💎</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{item.name}</h3>
                                            <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</p>
                                            <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                                {formatPrice(((item.discount && item.discount > 0
                                                    ? item.discountType === 'percentage'
                                                        ? item.price - (item.price * item.discount) / 100
                                                        : item.price - item.discount
                                                    : item.price) * item.quantity))}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{formatPrice(cartSummary.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {cartSummary.shipping === 0 ? 'Free' : formatPrice(cartSummary.shipping)}
                                    </span>
                                </div>
                                {cartSummary.discount > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Discount</span>
                                        <span className="font-medium">-{formatPrice(cartSummary.discount)}</span>
                                    </div>
                                )}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>{formatPrice(cartSummary.total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Placing Order...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaLock className="w-5 h-5" />
                                        <span>Place Order</span>
                                    </>
                                )}
                            </button>

                            {/* Security Notice */}
                            <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                                <FaLock className="w-4 h-4 text-emerald-600" />
                                <span>Your payment information is secure and encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Confirmation Modal */}
            <AnimatePresence>
                {showAddressModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Delivery Address</h2>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                                <p className="font-semibold text-gray-900">
                                    {shippingAddress.name}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    {shippingAddress.addressLine1}
                                    {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    {shippingAddress.country}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Phone: {shippingAddress.phone}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Email: {shippingAddress.email}
                                </p>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowAddressModal(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Edit Address
                                </button>
                                <button
                                    onClick={handleConfirmAddress}
                                    className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                                >
                                    Confirm & Place Order
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Checkout;