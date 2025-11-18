'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI } from '../services/api';
import { authAPI } from '../services/api';
import { FaUsers, FaStore, FaGem, FaShoppingBag, FaChartLine, FaBan, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBuyers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    blockedBuyers: 0,
    blockedSellers: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  const fetchIndividualStats = useCallback(async () => {
    try {
      // Fetch all stats in parallel, but handle errors gracefully
      const [buyersRes, sellersRes, productsRes, ordersRes] = await Promise.allSettled([
        adminAPI.getBuyers().catch(() => ({ success: false, buyers: [] })),
        adminAPI.getSellers().catch(() => ({ success: false, sellers: [] })),
        adminAPI.getAllProducts().catch(() => ({ success: false, products: [] })),
        adminAPI.getAllOrders().catch(() => ({ success: false, orders: [] }))
      ]);

      // Extract data from settled promises
      const buyers = (buyersRes.status === 'fulfilled' ? buyersRes.value : { success: false, buyers: [] });
      const sellers = (sellersRes.status === 'fulfilled' ? sellersRes.value : { success: false, sellers: [] });
      const products = (productsRes.status === 'fulfilled' ? productsRes.value : { success: false, products: [] });
      const orders = (ordersRes.status === 'fulfilled' ? ordersRes.value : { success: false, orders: [] });

      const buyersList = buyers.buyers || buyers.data?.buyers || [];
      const sellersList = sellers.sellers || sellers.data?.sellers || [];
      const productsList = products.products || products.data?.products || products.gems || [];
      const ordersList = orders.orders || orders.data?.orders || [];

      setStats({
        totalBuyers: buyersList.length,
        totalSellers: sellersList.length,
        totalProducts: productsList.length,
        totalOrders: ordersList.length,
        blockedBuyers: buyersList.filter(b => b.isBlocked || b.status === 'blocked').length,
        blockedSellers: sellersList.filter(s => s.isBlocked || s.status === 'blocked' || s.status === 'suspended').length,
        pendingOrders: ordersList.filter(o => o.status?.toLowerCase() === 'pending').length,
        totalRevenue: ordersList.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
      });
    } catch (error) {
      console.error('Error fetching individual stats:', error);
      // Set default stats on error to prevent UI issues
      setStats(prev => ({ ...prev }));
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      
      if (response && response.success) {
        setStats(response.stats || {
          totalBuyers: response.data?.totalBuyers || 0,
          totalSellers: response.data?.totalSellers || 0,
          totalProducts: response.data?.totalProducts || 0,
          totalOrders: response.data?.totalOrders || 0,
          blockedBuyers: response.data?.blockedBuyers || 0,
          blockedSellers: response.data?.blockedSellers || 0,
          pendingOrders: response.data?.pendingOrders || 0,
          totalRevenue: response.data?.totalRevenue || 0
        });
      } else {
        // Fallback: fetch individual data only if dashboard stats failed
        console.log('Dashboard stats not available, fetching individual stats...');
        await fetchIndividualStats();
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Only fallback to individual stats if dashboard endpoint fails
      await fetchIndividualStats();
    } finally {
      setLoading(false);
    }
  }, [fetchIndividualStats]);

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

    // Only fetch once on mount
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage buyers, sellers, products, and orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate('/admin/buyers')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Buyers</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalBuyers}</p>
                {stats.blockedBuyers > 0 && (
                  <p className="text-xs text-red-600 mt-1">{stats.blockedBuyers} blocked</p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate('/admin/sellers')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sellers</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalSellers}</p>
                {stats.blockedSellers > 0 && (
                  <p className="text-xs text-red-600 mt-1">{stats.blockedSellers} blocked</p>
                )}
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FaStore className="text-purple-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate('/admin/products')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <FaGem className="text-emerald-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate('/admin/orders')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalOrders}</p>
                {stats.pendingOrders > 0 && (
                  <p className="text-xs text-yellow-600 mt-1">{stats.pendingOrders} pending</p>
                )}
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FaShoppingBag className="text-orange-600 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl shadow-lg p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaChartLine className="text-3xl" />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/buyers"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Buyers</h3>
                <p className="text-sm text-gray-600">View and manage all buyers</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/sellers"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <FaStore className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Sellers</h3>
                <p className="text-sm text-gray-600">View and manage all sellers</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/products"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <FaGem className="text-emerald-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Products</h3>
                <p className="text-sm text-gray-600">View all products</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <FaShoppingBag className="text-orange-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Orders</h3>
                <p className="text-sm text-gray-600">View all orders</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

