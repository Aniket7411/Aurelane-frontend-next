'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSave, FaTimes, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaPlus, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import { authAPI, orderAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const BuyerProfile = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // User Profile State (with edit functionality)
    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        phone: '',
        phoneNumber: '',
        address: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
        }
    });

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedProfile, setEditedProfile] = useState({ ...userProfile });
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Address Management States
    const [addresses, setAddresses] = useState([]);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [newAddress, setNewAddress] = useState({
        label: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        isPrimary: false
    });

    const formatUserData = useCallback((userData) => ({
        name: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phoneNumber || userData?.phone || '',
        phoneNumber: userData?.phoneNumber || userData?.phone || '',
        address: {
            addressLine1: userData?.address?.addressLine1 || userData?.address?.street || '',
            addressLine2: userData?.address?.addressLine2 || '',
            city: userData?.address?.city || '',
            state: userData?.address?.state || '',
            pincode: userData?.address?.pincode || '',
            country: userData?.address?.country || 'India'
        }
    }), []);

    const loadUserProfile = useCallback(async () => {
        setLoading(true);
        try {
            // Try to get from API first
            try {
                const response = await authAPI.getBuyerProfile();
                if (response.success && response.user) {
                    const formatted = formatUserData(response.user);
                    setUserProfile(formatted);
                    setEditedProfile(formatted);
                }
            } catch (apiError) {
                // Fallback to localStorage
                console.log('Using localStorage data:', apiError);
                const currentUser = authAPI.getCurrentUser();
                if (currentUser) {
                    const formatted = formatUserData(currentUser);
                    setUserProfile(formatted);
                    setEditedProfile(formatted);
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    }, [formatUserData]);

    const loadUserOrders = useCallback(async () => {
        setLoadingOrders(true);
        try {
            const response = await orderAPI.getOrders();
            if (response.success) {
                setOrders(response.orders || response.data || []);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            setOrders([]);
        } finally {
            setLoadingOrders(false);
        }
    }, []);

    const loadAddresses = useCallback(async () => {
        try {
            const response = await authAPI.getAddresses();
            if (response.success) {
                setAddresses(response.addresses || []);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
            setAddresses([]);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadUserProfile();
        loadUserOrders();
        loadAddresses();
    }, [isAuthenticated, navigate, loadUserProfile, loadUserOrders, loadAddresses]);

    // Get status badge styling
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

    // Get status icon
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

    // Handle profile edit
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setEditedProfile({
                ...editedProfile,
                address: {
                    ...editedProfile.address,
                    [addressField]: value
                }
            });
        } else {
            setEditedProfile({
                ...editedProfile,
                [name]: value
            });
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const updateData = {
                name: editedProfile.name,
                phoneNumber: editedProfile.phone,
                address: {
                    street: editedProfile.address.addressLine1,
                    addressLine1: editedProfile.address.addressLine1,
                    addressLine2: editedProfile.address.addressLine2,
                    city: editedProfile.address.city,
                    state: editedProfile.address.state,
                    pincode: editedProfile.address.pincode,
                    country: editedProfile.address.country
                }
            };

            const response = await authAPI.updateBuyerProfile(updateData);

            if (response.success) {
                setUserProfile(editedProfile);
                setIsEditingProfile(false);
                alert('✅ Profile updated successfully!');
            } else {
                alert(response.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedProfile({ ...userProfile });
        setIsEditingProfile(false);
    };

    // Address Management Handlers
    const handleNewAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({
            ...newAddress,
            [name]: value
        });
    };

    const handleAddAddress = async () => {
        try {
            const response = await authAPI.addAddress(newAddress);
            if (response.success) {
                alert('Address added successfully!');
                setShowAddAddress(false);
                setNewAddress({
                    label: '',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: 'India',
                    isPrimary: false
                });
                loadAddresses();
            } else {
                alert(response.message || 'Failed to add address');
            }
        } catch (error) {
            console.error('Error adding address:', error);
            alert(error.message || 'Failed to add address');
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setNewAddress({ ...address });
        setShowAddAddress(true);
    };

    const handleUpdateAddress = async () => {
        try {
            const response = await authAPI.updateAddress(editingAddress._id || editingAddress.id, newAddress);
            if (response.success) {
                alert('Address updated successfully!');
                setShowAddAddress(false);
                setEditingAddress(null);
                setNewAddress({
                    label: '',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: 'India',
                    isPrimary: false
                });
                loadAddresses();
            } else {
                alert(response.message || 'Failed to update address');
            }
        } catch (error) {
            console.error('Error updating address:', error);
            alert(error.message || 'Failed to update address');
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm('Are you sure you want to delete this address?')) {
            return;
        }
        try {
            const response = await authAPI.deleteAddress(addressId);
            if (response.success) {
                alert('Address deleted successfully!');
                loadAddresses();
            } else {
                alert(response.message || 'Failed to delete address');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            alert(error.message || 'Failed to delete address');
        }
    };

    const handleSetPrimaryAddress = async (addressId) => {
        try {
            const response = await authAPI.setPrimaryAddress(addressId);
            if (response.success) {
                alert('Primary address updated!');
                loadAddresses();
            } else {
                alert(response.message || 'Failed to set primary address');
            }
        } catch (error) {
            console.error('Error setting primary address:', error);
            alert(error.message || 'Failed to set primary address');
        }
    };

    const handleCancelAddress = () => {
        setShowAddAddress(false);
        setEditingAddress(null);
        setNewAddress({
            label: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India',
            isPrimary: false
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-4 transition-colors"
                >
                    <FaArrowLeft />
                    <span>Back</span>
                </button>

                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Account</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your profile and view your orders</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left Column - User Profile & Addresses */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Profile</h2>
                                {!isEditingProfile ? (
                                    <button
                                        onClick={() => {
                                            setEditedProfile({ ...userProfile });
                                            setIsEditingProfile(true);
                                        }}
                                        className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm sm:text-base"
                                    >
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="text-green-600 hover:text-green-700 flex items-center text-sm disabled:opacity-50"
                                        >
                                            <FaSave className="mr-1" /> {saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            disabled={saving}
                                            className="text-red-600 hover:text-red-700 flex items-center text-sm disabled:opacity-50"
                                        >
                                            <FaTimes className="mr-1" /> Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Profile Picture Placeholder */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                                    {isEditingProfile ? editedProfile.name.charAt(0).toUpperCase() : userProfile.name.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    {isEditingProfile ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editedProfile.name}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base"
                                        />
                                    ) : (
                                        <p className="text-sm sm:text-base text-gray-900">{userProfile.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <p className="text-sm sm:text-base text-gray-900">{userProfile.email}</p>
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    {isEditingProfile ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={editedProfile.phone}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base"
                                            placeholder="+91 9876543210"
                                        />
                                    ) : (
                                        <p className="text-sm sm:text-base text-gray-900">{userProfile.phone}</p>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* Addresses Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Addresses</h2>
                                <button
                                    onClick={() => {
                                        setEditingAddress(null);
                                        setNewAddress({
                                            label: '',
                                            addressLine1: '',
                                            addressLine2: '',
                                            city: '',
                                            state: '',
                                            pincode: '',
                                            country: 'India',
                                            isPrimary: false
                                        });
                                        setShowAddAddress(!showAddAddress);
                                    }}
                                    className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm sm:text-base"
                                >
                                    <FaPlus className="mr-1" /> {showAddAddress ? 'Cancel' : 'Add'}
                                </button>
                            </div>

                            {/* Add/Edit Address Form */}
                            {showAddAddress && (
                                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                                    </h3>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="label"
                                            value={newAddress.label}
                                            onChange={handleNewAddressChange}
                                            placeholder="Address Label (Home, Office, etc.)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                        />
                                        <input
                                            type="text"
                                            name="addressLine1"
                                            value={newAddress.addressLine1}
                                            onChange={handleNewAddressChange}
                                            placeholder="Address Line 1 *"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="addressLine2"
                                            value={newAddress.addressLine2}
                                            onChange={handleNewAddressChange}
                                            placeholder="Address Line 2"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                name="city"
                                                value={newAddress.city}
                                                onChange={handleNewAddressChange}
                                                placeholder="City *"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="state"
                                                value={newAddress.state}
                                                onChange={handleNewAddressChange}
                                                placeholder="State *"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={newAddress.pincode}
                                                onChange={handleNewAddressChange}
                                                placeholder="Pincode *"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="country"
                                                value={newAddress.country}
                                                onChange={handleNewAddressChange}
                                                placeholder="Country *"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="isPrimary"
                                                checked={newAddress.isPrimary}
                                                onChange={(e) => setNewAddress({ ...newAddress, isPrimary: e.target.checked })}
                                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-900">
                                                Set as primary address
                                            </label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                                                className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                                            >
                                                {editingAddress ? 'Update' : 'Add'} Address
                                            </button>
                                            <button
                                                onClick={handleCancelAddress}
                                                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Addresses List */}
                            <div className="space-y-3">
                                {addresses.length === 0 ? (
                                    <div className="text-center py-6 text-sm text-gray-500">
                                        <FaMapMarkerAlt className="mx-auto mb-2 text-2xl" />
                                        No addresses saved yet
                                    </div>
                                ) : (
                                    addresses.map((address) => (
                                        <div
                                            key={address._id || address.id}
                                            className={`border rounded-lg p-3 ${address.isPrimary ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    {address.label && (
                                                        <span className="text-xs font-semibold text-gray-900 uppercase">
                                                            {address.label}
                                                        </span>
                                                    )}
                                                    {address.isPrimary && (
                                                        <span className="ml-2 px-2 py-1 bg-emerald-600 text-white text-xs rounded-full">
                                                            Primary
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => handleEditAddress(address)}
                                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAddress(address._id || address.id)}
                                                        className="text-red-600 hover:text-red-700 text-sm"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-700">
                                                <p>{address.addressLine1}</p>
                                                {address.addressLine2 && <p>{address.addressLine2}</p>}
                                                <p>
                                                    {address.city}, {address.state} - {address.pincode}
                                                </p>
                                                <p>{address.country}</p>
                                            </div>
                                            {!address.isPrimary && (
                                                <button
                                                    onClick={() => handleSetPrimaryAddress(address._id || address.id)}
                                                    className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                                                >
                                                    Set as Primary
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Orders */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Orders</h2>
                                <button
                                    onClick={() => navigate('/my-orders')}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    View All →
                                </button>
                            </div>

                            {loadingOrders ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading orders...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-4xl sm:text-6xl mb-4">📦</div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                                    <p className="text-sm sm:text-base text-gray-600 mb-6">Start shopping to see your orders here!</p>
                                    <button
                                        onClick={() => navigate('/shop')}
                                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 sm:space-y-6">
                                    {orders.slice(0, 3).map((order) => (
                                        <div
                                            key={order.id}
                                            className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                                        >
                                            {/* Order Header */}
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                                        Order #{order.orderId || order.id}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        Placed on {new Date(order.createdAt || order.orderDate).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-start sm:items-end space-y-1">
                                                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusBadge(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                    {order.status === 'shipped' && (
                                                        <p className="text-xs text-gray-600">
                                                            Expected: {new Date(order.expectedDelivery).toLocaleDateString('en-IN')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="space-y-3 mb-4">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex items-center space-x-3 sm:space-x-4">
                                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                                                                {item.name}
                                                            </h4>
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                {item.sizeWeight} {item.sizeUnit} × {item.quantity}
                                                            </p>
                                                            <p className="text-sm sm:text-base font-semibold text-gray-900">
                                                                ₹{(item.price * item.quantity).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Footer */}
                                            <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
                                                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                                                        ₹{order.totalAmount.toLocaleString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-emerald-600 hover:text-emerald-700 text-sm sm:text-base font-medium"
                                                >
                                                    View Details →
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Order Details - {selectedOrder.id}
                            </h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 sm:p-6 space-y-6">
                            {/* Order Status */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Order Status</h4>
                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(selectedOrder.status)}`}>
                                    {getStatusIcon(selectedOrder.status)}
                                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                </span>
                                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                                    Expected delivery: {new Date(selectedOrder.expectedDelivery).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })} ({selectedOrder.deliveryDays} days)
                                </p>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Items</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4 pb-3 border-b last:border-b-0">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-sm sm:text-base font-medium text-gray-900">{item.name}</h5>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    {item.sizeWeight} {item.sizeUnit}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h4>
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                                    <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                                    <p className="text-gray-700">{selectedOrder.shippingAddress.phone}</p>
                                    <p className="text-gray-700 mt-2">{selectedOrder.shippingAddress.addressLine1}</p>
                                    <p className="text-gray-700">
                                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                                    </p>
                                    <p className="text-gray-700">{selectedOrder.shippingAddress.pincode}</p>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium text-green-600">Free</span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between text-base sm:text-lg font-semibold">
                                            <span>Total</span>
                                            <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                {selectedOrder.status === 'pending' && (
                                    <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base">
                                        Cancel Order
                                    </button>
                                )}
                                {selectedOrder.status === 'delivered' && (
                                    <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base">
                                        Reorder
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyerProfile;



