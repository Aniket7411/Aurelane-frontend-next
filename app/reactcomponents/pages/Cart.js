'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { otpAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, clearCart, getCartSummary } = useCart();
    const { isAuthenticated } = useAuth();
    const { showSuccess, showError, showWarning } = useToast();

    const [showOTPModal, setShowOTPModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const cartSummary = getCartSummary();

    const handleQuantityChange = (gemId, newQuantity) => {
        updateQuantity(gemId, newQuantity);
    };

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            setShowOTPModal(true);
        }
    };

    const handleSendOTP = async () => {
        if (!phoneNumber.trim() || phoneNumber.length < 10) {
            showWarning('Please enter a valid 10-digit phone number');
            return;
        }

        setOtpLoading(true);
        try {
            const response = await otpAPI.sendOTP(phoneNumber);
            if (response.success) {
                setOtpSent(true);
                showSuccess('OTP sent to your phone number');
            } else {
                showError(response.message || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            showError(error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp.trim() || otp.length !== 6) {
            showWarning('Please enter the 6-digit OTP');
            return;
        }

        setOtpLoading(true);
        try {
            const response = await otpAPI.verifyOTP(phoneNumber, otp);
            if (response.success) {
                // Store temporary guest session
                localStorage.setItem('guestPhone', phoneNumber);
                setShowOTPModal(false);
                setPhoneNumber('');
                setOtp('');
                setOtpSent(false);
                navigate('/checkout');
            } else {
                showError(response.message || 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            showError(error.message || 'Invalid OTP. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-8 sm:py-12">
                        <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🛒</div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Looks like you haven't added any gems to your cart yet.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-emerald-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base font-medium"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{cartSummary.itemCount} item(s) in your cart</p>
                    </div>
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium w-full sm:w-auto"
                    >
                        View Orders
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    {/* Image */}
                                    <div className="w-full sm:w-24 md:w-32 h-24 sm:h-24 md:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                                                <span className="text-3xl sm:text-4xl">💎</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-emerald-600 font-medium mb-1 truncate">
                                                    {item.category}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    {item.sizeWeight || 'N/A'} {item.sizeUnit || ''}
                                                </p>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                                                title="Remove from cart"
                                            >
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Price and Quantity */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 gap-3">
                                            <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
                                                <span className="text-base sm:text-lg font-semibold text-gray-900">
                                                    ₹{(() => {
                                                        const price = item.discount && item.discount > 0
                                                            ? item.discountType === 'percentage'
                                                                ? item.price - (item.price * item.discount) / 100
                                                                : item.price - item.discount
                                                            : item.price;
                                                        return price.toLocaleString();
                                                    })()}
                                                </span>
                                                {item.discount > 0 && (
                                                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                                                        ₹{item.price.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center border rounded-lg">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-3 sm:px-4 py-1.5 sm:py-2 border-x min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={item.stock && item.quantity >= item.stock}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="mt-2 text-right">
                                            <span className="text-base sm:text-lg font-semibold text-gray-900">
                                                ₹{(() => {
                                                    const price = item.discount && item.discount > 0
                                                        ? item.discountType === 'percentage'
                                                            ? item.price - (item.price * item.discount) / 100
                                                            : item.price - item.discount
                                                        : item.price;
                                                    return (price * item.quantity).toLocaleString();
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Clear Cart Button */}
                        <div className="flex justify-end pt-2 sm:pt-3">
                            <button
                                onClick={clearCart}
                                className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 sticky top-4 sm:top-8">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Order Summary</h2>

                            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{cartSummary.subtotal.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between text-sm sm:text-base">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {cartSummary.shipping === 0 ? 'Free' : `₹${cartSummary.shipping}`}
                                    </span>
                                </div>

                                {!cartSummary.isEligibleForFreeShipping && (
                                    <div className="text-xs sm:text-sm text-emerald-600">
                                        Add ₹{(cartSummary.freeShippingThreshold - cartSummary.subtotal).toLocaleString()} more for free shipping
                                    </div>
                                )}

                                <div className="border-t pt-2 sm:pt-3">
                                    <div className="flex justify-between text-base sm:text-lg font-semibold">
                                        <span>Total</span>
                                        <span>₹{cartSummary.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-emerald-600 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-emerald-700 transition-colors"
                            >
                                {isAuthenticated ? 'Proceed to Checkout' : 'Checkout with OTP'}
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full mt-2 sm:mt-3 border border-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOTPModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {otpSent ? 'Verify OTP' : 'Enter Phone Number'}
                        </h3>

                        {!otpSent ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="Enter 10-digit phone number"
                                        maxLength="10"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowOTPModal(false)}
                                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSendOTP}
                                        disabled={otpLoading}
                                        className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {otpLoading ? 'Sending...' : 'Send OTP'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter OTP
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                        maxLength="6"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setOtpSent(false);
                                            setOtp('');
                                        }}
                                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleVerifyOTP}
                                        disabled={otpLoading}
                                        className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {otpLoading ? 'Verifying...' : 'Verify & Checkout'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;

