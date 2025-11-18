'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const SellerDetails = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError, showWarning } = useToast();
    const [seller, setSeller] = useState(null);
    const [gems, setGems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSellerDetails = async () => {
            if (!sellerId) {
                setError('No seller ID provided');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                // Call API to get seller details
                const response = await adminAPI.getSellerById(sellerId);

                if (response.success && response.seller) {
                    setSeller(response.seller);

                    // Gems are inside the seller object
                    if (response.seller.gems && Array.isArray(response.seller.gems)) {
                        setGems(response.seller.gems);
                    } else if (response.gems && Array.isArray(response.gems)) {
                        setGems(response.gems);
                    } else if (response.data?.gems && Array.isArray(response.data.gems)) {
                        setGems(response.data.gems);
                    } else {
                        setGems([]);
                    }
                } else {
                    setError(response.message || 'Failed to fetch seller details');
                    setSeller(null);
                    setGems([]);
                }
            } catch (error) {
                console.error('Error fetching seller details:', error);
                setError(error.message || 'Error loading seller details');
                setSeller(null);
                setGems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerDetails();
    }, [sellerId]);

    const handleApprove = async () => {
        if (!window.confirm('Are you sure you want to approve this seller?')) return;

        try {
            const response = await adminAPI.updateSellerStatus(sellerId, 'approved');
            if (response.success) {
                showSuccess('Seller approved successfully!');
                setSeller({ ...seller, status: 'approved', isVerified: true });
            } else {
                showError(response.message || 'Failed to approve seller');
            }
        } catch (error) {
            showError(error.message || 'Failed to approve seller');
        }
    };

    const handleSuspend = async () => {
        if (!window.confirm('Are you sure you want to suspend this seller?')) return;

        try {
            const response = await adminAPI.updateSellerStatus(sellerId, 'suspended');
            if (response.success) {
                showSuccess('Seller suspended successfully!');
                setSeller({ ...seller, status: 'suspended' });
            } else {
                showError(response.message || 'Failed to suspend seller');
            }
        } catch (error) {
            showError(error.message || 'Failed to suspend seller');
        }
    };

    const handleReject = async () => {
        if (!window.confirm('Are you sure you want to reject this seller?')) return;

        try {
            const response = await adminAPI.updateSellerStatus(sellerId, 'rejected');
            if (response.success) {
                showSuccess('Seller rejected successfully!');
                setSeller({ ...seller, status: 'rejected' });
            } else {
                showError(response.message || 'Failed to reject seller');
            }
        } catch (error) {
            showError(error.message || 'Failed to reject seller');
        }
    };

    const handleReactivate = async () => {
        if (!window.confirm('Are you sure you want to reactivate this seller?')) return;

        try {
            const response = await adminAPI.updateSellerStatus(sellerId, 'approved');
            if (response.success) {
                showSuccess('Seller reactivated successfully!');
                setSeller({ ...seller, status: 'approved', isVerified: true, suspendedAt: null });
            } else {
                showError(response.message || 'Failed to reactivate seller');
            }
        } catch (error) {
            showError(error.message || 'Failed to reactivate seller');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('⚠️ WARNING: Are you sure you want to DELETE this seller?\n\nThis will:\n- Delete the seller account\n- Delete all their gems\n- This action CANNOT be undone!\n\nType YES to confirm.')) return;

        const confirmation = prompt('Please type "DELETE" to confirm deletion:');
        if (confirmation !== 'DELETE') {
            showWarning('Deletion cancelled');
            return;
        }

        try {
            const response = await adminAPI.deleteSeller(sellerId);
            if (response.success) {
                showSuccess('Seller deleted successfully!');
                navigate('/admin/sellers');
            } else {
                showError(response.message || 'Failed to delete seller');
            }
        } catch (error) {
            showError(error.message || 'Failed to delete seller');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading seller details...</p>
                </div>
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {error || 'Seller not found'}
                    </h2>
                    <p className="text-gray-600 mb-4">Unable to load seller details</p>
                    <button
                        onClick={() => navigate('/admin/sellers')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Back to Sellers
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/admin/sellers')}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 mb-4"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Sellers
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{seller.fullName || seller.name || 'N/A'}</h1>
                            <p className="text-gray-600 mt-2">{seller.shopName || 'N/A'}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {seller.shopType && <span className="mr-3">🏪 {seller.shopType}</span>}
                                {seller.yearEstablished && <span>📅 Est. {seller.yearEstablished}</span>}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${seller.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    seller.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                        seller.status === 'rejected' ? 'bg-gray-100 text-gray-800' :
                                            'bg-yellow-100 text-yellow-800'
                                }`}>
                                {seller.status
                                    ? seller.status.charAt(0).toUpperCase() + seller.status.slice(1)
                                    : seller.isVerified ? 'Verified' : 'Pending'}
                            </span>
                            {seller.suspendedAt && (
                                <span className="text-xs text-red-600">
                                    Suspended on {new Date(seller.suspendedAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Seller Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <p className="mt-1 text-sm text-gray-900">{seller.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <p className="mt-1 text-sm text-gray-900">{seller.phone || 'N/A'}</p>
                                </div>
                                {seller.alternatePhone && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Alternate Phone</label>
                                        <p className="mt-1 text-sm text-gray-900">{seller.alternatePhone}</p>
                                    </div>
                                )}
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500">Address</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {seller.address
                                            ? (typeof seller.address === 'string'
                                                ? seller.address
                                                : `${seller.address.street || ''}, ${seller.address.city || ''}, ${seller.address.state || ''} - ${seller.address.pincode || ''}`.trim()
                                            )
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Business Details */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {seller.businessType && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Business Type</label>
                                        <p className="mt-1 text-sm text-gray-900">{seller.businessType}</p>
                                    </div>
                                )}
                                {seller.gstNumber && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">GST Number</label>
                                        <p className="mt-1 text-sm text-gray-900 font-mono">{seller.gstNumber}</p>
                                    </div>
                                )}
                                {seller.panNumber && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">PAN Number</label>
                                        <p className="mt-1 text-sm text-gray-900 font-mono">{seller.panNumber}</p>
                                    </div>
                                )}
                                {seller.aadharNumber && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Aadhar Number</label>
                                        <p className="mt-1 text-sm text-gray-900 font-mono">{seller.aadharNumber}</p>
                                    </div>
                                )}
                                {seller.gemTypes && seller.gemTypes.length > 0 && (
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-gray-500">Gem Types</label>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {seller.gemTypes.map((type, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {seller.specialization && seller.specialization.length > 0 && (
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-gray-500">Specialization</label>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {seller.specialization.map((spec, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bank Details */}
                        {seller.accountNumber && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Account Holder</label>
                                        <p className="mt-1 text-sm text-gray-900">{seller.accountHolderName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Bank Name</label>
                                        <p className="mt-1 text-sm text-gray-900">{seller.bankName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Account Number</label>
                                        <p className="mt-1 text-sm text-gray-900 font-mono">{seller.accountNumber}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">IFSC Code</label>
                                        <p className="mt-1 text-sm text-gray-900 font-mono">{seller.ifscCode || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Gems List */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Listed Gems ({gems.length})
                            </h3>
                            {gems.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No gems listed yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {gems.map((gem) => (
                                        <div key={gem._id || gem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all group cursor-pointer"
                                            onClick={() => navigate(`/gem/${gem._id || gem.id}`)}>
                                            <div className="flex items-center flex-1">
                                                {gem.images && gem.images[0] ? (
                                                    <img
                                                        src={gem.images[0]}
                                                        alt={gem.name}
                                                        className="w-16 h-16 rounded-lg object-cover group-hover:ring-2 group-hover:ring-emerald-500 transition-all"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center text-white font-medium text-xs">
                                                        {(gem.name || 'NA').split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                )}
                                                <div className="ml-4 flex-1">
                                                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                        {gem.name || 'N/A'}
                                                    </h4>
                                                    <p className="text-sm text-emerald-600 font-medium">{gem.category || 'N/A'}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {gem.sizeWeight} {gem.sizeUnit} • Stock: {gem.stock || 0}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-gray-900">₹{(gem.price || 0).toLocaleString()}</p>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gem.stock > 5 ? 'bg-green-100 text-green-800' :
                                                            gem.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {gem.stock > 5 ? `In Stock (${gem.stock})` :
                                                            gem.stock > 0 ? `Low (${gem.stock})` :
                                                                'Out of Stock'}
                                                    </span>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-emerald-700">
                                                        View →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Seller Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Rating</span>
                                    <span className="text-sm font-medium text-gray-900">{seller.rating || 'N/A'}/5.0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Total Sales</span>
                                    <span className="text-sm font-medium text-gray-900">{seller.totalSales || seller.totalOrders || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Member Since</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {seller.joinDate || seller.createdAt
                                            ? new Date(seller.joinDate || seller.createdAt).toLocaleDateString()
                                            : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Gems Listed</span>
                                    <span className="text-sm font-medium text-gray-900">{seller.stats?.totalGems || gems.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Total Orders</span>
                                    <span className="text-sm font-medium text-gray-900">{seller.stats?.totalOrders || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Total Revenue</span>
                                    <span className="text-sm font-medium text-gray-900">₹{(seller.stats?.totalRevenue || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                            <div className="space-y-3">
                                {seller.status !== 'approved' && (
                                    <button
                                        onClick={() => handleApprove()}
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-150 font-medium"
                                    >
                                        ✓ Approve Seller
                                    </button>
                                )}

                                {seller.status === 'suspended' ? (
                                    <button
                                        onClick={() => handleReactivate()}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-150 font-medium"
                                    >
                                        🔄 Reactivate Account
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleSuspend()}
                                        disabled={seller.status === 'rejected'}
                                        className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ⏸️ Suspend Account
                                    </button>
                                )}

                                {seller.status === 'pending' && (
                                    <button
                                        onClick={() => handleReject()}
                                        className="w-full border border-red-300 text-red-700 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors duration-150 font-medium"
                                    >
                                        ✕ Reject Application
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete()}
                                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-150 font-medium"
                                >
                                    🗑️ Delete Seller
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDetails;