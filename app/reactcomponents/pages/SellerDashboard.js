'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from '../lib/nextRouterAdapter';
import { gemAPI, authAPI, orderAPI } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaEye, FaExclamationTriangle, FaShoppingBag, FaRupeeSign } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';
import Pagination from '../components/gems/Pagination';

const SellerDashboard = () => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [gems, setGems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
    });
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [stats, setStats] = useState({
        totalGems: 0,
        lowStockGems: 0,
        outOfStock: 0,
        totalValue: 0
    });
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });

    const user = authAPI.getCurrentUser();

    // Fetch stats only once on mount
    useEffect(() => {
        if (!authAPI.isAuthenticated() || user?.role !== 'seller') {
            navigate('/login');
            return;
        }
        fetchSellerStats(); // Fetch all gems for accurate stats
        fetchOrderStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch paginated gems when page or limit changes
    useEffect(() => {
        if (!authAPI.isAuthenticated() || user?.role !== 'seller') {
            return;
        }
        fetchSellerGems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit]);

    // Fetch all gems for accurate stats calculation
    const fetchSellerStats = async () => {
        try {
            const userId = user._id || user.id;
            // Fetch all gems without pagination for stats
            const response = await gemAPI.getGems({ 
                seller: userId,
                limit: 10000 // Large limit to get all gems
            });

            if (response.success) {
                const allGems = response.gems || response.data?.gems || [];
                
                // Calculate accurate stats from all gems
                const lowStock = allGems.filter(g => g.stock && g.stock <= 5 && g.stock > 0).length;
                const outOfStock = allGems.filter(g => !g.stock || g.stock === 0).length;
                const totalValue = allGems.reduce((sum, g) => sum + (g.price * (g.stock || 0)), 0);
                const totalItems = response.data?.pagination?.totalItems || response.pagination?.totalItems || allGems.length;

                setStats({
                    totalGems: totalItems,
                    lowStockGems: lowStock,
                    outOfStock,
                    totalValue
                });
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
            // Don't set error state here, just log it
        }
    };

    const fetchSellerGems = async () => {
        setLoading(true);
        setError(null);
        try {
            // Get gems for this seller - using user.id or user._id
            const userId = user._id || user.id;
            const response = await gemAPI.getGems({ 
                seller: userId,
                page: page,
                limit: limit
            });

            if (response.success) {
                const sellerGems = response.gems || response.data?.gems || [];
                setGems(sellerGems);

                // Update pagination info
                const paginationData = response.data?.pagination || response.pagination || {};
                setPagination({
                    currentPage: paginationData.currentPage || page,
                    totalPages: paginationData.totalPages || 1,
                    totalItems: paginationData.totalItems || sellerGems.length,
                    hasNext: paginationData.hasNext || false,
                    hasPrev: paginationData.hasPrev || false
                });

                // Update totalGems in stats from pagination (other stats come from fetchSellerStats)
                setStats(prev => ({
                    ...prev,
                    totalGems: paginationData.totalItems || prev.totalGems
                }));
            }
        } catch (err) {
            console.error('Error fetching gems:', err);
            setError(err.message || 'Failed to fetch gems');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGem = async (gemId) => {
        if (!window.confirm('⚠️ Are you sure you want to delete this gem?\n\nThis action cannot be undone!')) {
            return;
        }

        try {
            const response = await gemAPI.deleteGem(gemId);
            if (response.success) {
                showSuccess('Gem deleted successfully!');
                // If we're on the last page and it becomes empty, go to previous page
                if (gems.length === 1 && page > 1) {
                    setPage(page - 1);
                } else {
                    fetchSellerGems(); // Refresh the list
                    fetchSellerStats(); // Refresh stats
                }
            } else {
                showError(response.message || 'Failed to delete gem');
            }
        } catch (error) {
            console.error('Error deleting gem:', error);
            showError(error.message || 'Failed to delete gem');
        }
    };

    const handlePageChange = (newPage, newLimit = null) => {
        if (newLimit && newLimit !== limit) {
            setLimit(newLimit);
            setPage(1); // Reset to first page when limit changes
        } else {
            setPage(newPage);
        }
    };

    const fetchOrderStats = async () => {
        try {
            const response = await orderAPI.getSellerOrderStats();
            if (response.success) {
                setOrderStats(response.stats || {
                    totalOrders: 0,
                    pendingOrders: 0,
                    totalRevenue: 0
                });
            }
        } catch (err) {
            console.error('Error fetching order stats:', err);
        }
    };

    const getStockStatus = (stock) => {
        if (!stock || stock === 0) {
            return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
        } else if (stock <= 5) {
            return { label: `Low Stock (${stock})`, color: 'bg-yellow-100 text-yellow-800' };
        } else {
            return { label: `In Stock (${stock})`, color: 'bg-green-100 text-green-800' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.name}!</p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                        onClick={() => navigate('/seller-orders')}
                        className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-md border border-gray-200"
                    >
                        <FaShoppingBag />
                        <span>View Orders</span>
                        {orderStats.pendingOrders > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {orderStats.pendingOrders}
                            </span>
                        )}
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Gems</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalGems}</p>
                            </div>
                            {/* <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">💎</span>
                            </div> */}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Low Stock</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.lowStockGems}</p>
                            </div>
                            {/* <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <FaExclamationTriangle className="text-yellow-600 text-xl" />
                            </div> */}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
                                <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
                            </div>
                            {/* <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">⚠️</span>
                            </div> */}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Inventory Value</p>
                                <p className="text-2xl font-bold text-emerald-600">₹{stats.totalValue.toLocaleString()}</p>
                            </div>
                            {/* <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                            </div> */}
                        </div>
                    </motion.div>

                    {/* Order Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                        onClick={() => navigate('/seller-orders')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                                <p className="text-2xl font-bold text-blue-600">{orderStats.totalOrders}</p>
                            </div>
                            {/* <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaShoppingBag className="text-blue-600 text-xl" />
                            </div> */}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                        onClick={() => navigate('/seller-orders?status=pending')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                                <p className="text-2xl font-bold text-yellow-600">{orderStats.pendingOrders}</p>
                            </div>
                            {/* <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">⏳</span>
                            </div> */}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                                <p className="text-xl font-bold text-emerald-600">₹{orderStats.totalRevenue?.toLocaleString() || 0}</p>
                            </div>
                            {/* <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                <FaRupeeSign className="text-emerald-600 text-xl" />
                            </div> */}
                        </div>
                    </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Gems</h2>
                    <button
                        onClick={() => navigate('/add-gem')}
                        className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
                    >
                        <FaPlus />
                        <span>Add New Gem</span>
                    </button>
                </div>

                {/* Gems Table */}
                {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                ) : gems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">💎</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Gems Listed</h3>
                        <p className="text-gray-600 mb-6">Start by adding your first gemstone to your inventory.</p>
                        <button
                            onClick={() => navigate('/add-gem')}
                            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Add Your First Gem
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Gem
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stock Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {gems.map((gem) => {
                                        const stockStatus = getStockStatus(gem.stock);
                                        return (
                                            <tr key={gem._id || gem.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            {gem.images?.[0] ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={gem.images[0]}
                                                                    alt={gem.name}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                                    <span>💎</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{gem.name}</div>
                                                            <div className="text-sm text-gray-500">
                                                                {gem.sizeWeight} {gem.sizeUnit}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                                        {gem.category || gem.name || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {gem.contactForPrice ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            Contact for Price
                                                        </span>
                                                    ) : (
                                                        `₹${gem.price?.toLocaleString() || '0'}`
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                                                        {stockStatus.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/gem/${gem._id || gem.id}`)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View"
                                                    >
                                                        <FaEye className="inline" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/edit-gem?id=${gem._id || gem.id}`)}
                                                        className="text-emerald-600 hover:text-emerald-900"
                                                        title="Edit"
                                                    >
                                                        <FaEdit className="inline" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteGem(gem._id || gem.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete"
                                                    >
                                                        <FaTrash className="inline" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {!error && gems.length > 0 && pagination.totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                            hasNext={pagination.hasNext}
                            hasPrev={pagination.hasPrev}
                            totalItems={pagination.totalItems}
                            itemsPerPage={limit}
                        />
                    </div>
                )}

                {/* Low Stock Alert */}
                {stats.lowStockGems > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg"
                    >
                        <div className="flex">
                            <FaExclamationTriangle className="text-yellow-400 mt-0.5" />
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <span className="font-medium">Low Stock Alert!</span> You have {stats.lowStockGems} gem(s) with low stock.
                                    Consider restocking soon to avoid running out.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;

