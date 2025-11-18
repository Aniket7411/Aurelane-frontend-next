'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI, authAPI } from '../services/api';
import { FaBan, FaCheckCircle, FaSearch, FaUser, FaFilter } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';

const AdminBuyers = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [processingId, setProcessingId] = useState(null);

  const fetchBuyers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBuyers({
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      });

      if (response.success) {
        setBuyers(response.buyers || response.data?.buyers || []);
      } else {
        setBuyers([]);
      }
    } catch (error) {
      console.error('Error fetching buyers:', error);
      setBuyers([]);
      showError('Failed to fetch buyers');
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
      fetchBuyers();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchBuyers]);

  const handleBlock = async (buyerId) => {
    if (!window.confirm('Are you sure you want to block this buyer?')) {
      return;
    }

    try {
      setProcessingId(buyerId);
      const response = await adminAPI.blockBuyer(buyerId);
      if (response.success) {
        showSuccess('Buyer blocked successfully');
        fetchBuyers();
      } else {
        showError(response.message || 'Failed to block buyer');
      }
    } catch (error) {
      console.error('Error blocking buyer:', error);
      showError('Failed to block buyer');
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnblock = async (buyerId) => {
    if (!window.confirm('Are you sure you want to unblock this buyer?')) {
      return;
    }

    try {
      setProcessingId(buyerId);
      const response = await adminAPI.unblockBuyer(buyerId);
      if (response.success) {
        showSuccess('Buyer unblocked successfully');
        fetchBuyers();
      } else {
        showError(response.message || 'Failed to unblock buyer');
      }
    } catch (error) {
      console.error('Error unblocking buyer:', error);
      showError('Failed to unblock buyer');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (buyer) => {
    const isBlocked = buyer.isBlocked || buyer.status === 'blocked';
    if (isBlocked) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Blocked
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    );
  };

  const filteredBuyers = buyers.filter(buyer => {
    const matchesSearch = 
      (buyer.name || buyer.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (buyer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (buyer.phone || '').includes(searchTerm);
    
    const isBlocked = buyer.isBlocked || buyer.status === 'blocked';
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'blocked' && isBlocked) ||
      (filterStatus === 'active' && !isBlocked);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading buyers...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Buyer Management</h1>
              <p className="text-gray-600">Manage and view all registered buyers</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Buyers</p>
                <p className="text-2xl font-bold text-blue-600">{buyers.length}</p>
              </div>
              <FaUser className="text-blue-600 text-2xl" />
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
                <p className="text-sm text-gray-600 mb-1">Active Buyers</p>
                <p className="text-2xl font-bold text-green-600">
                  {buyers.filter(b => !b.isBlocked && b.status !== 'blocked').length}
                </p>
              </div>
              <FaCheckCircle className="text-green-600 text-2xl" />
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
                <p className="text-sm text-gray-600 mb-1">Blocked Buyers</p>
                <p className="text-2xl font-bold text-red-600">
                  {buyers.filter(b => b.isBlocked || b.status === 'blocked').length}
                </p>
              </div>
              <FaBan className="text-red-600 text-2xl" />
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
                placeholder="Search buyers by name, email, or phone..."
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
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buyers Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBuyers.map((buyer) => {
                  const isBlocked = buyer.isBlocked || buyer.status === 'blocked';
                  return (
                    <tr key={buyer._id || buyer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {(buyer.name || buyer.fullName || 'NA').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {buyer.name || buyer.fullName || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">{buyer.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{buyer.email || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{buyer.phone || buyer.phoneNumber || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {buyer.createdAt || buyer.registrationDate
                            ? new Date(buyer.createdAt || buyer.registrationDate).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(buyer)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {isBlocked ? (
                          <button
                            onClick={() => handleUnblock(buyer._id || buyer.id)}
                            disabled={processingId === (buyer._id || buyer.id)}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                          >
                            <FaCheckCircle />
                            <span>Unblock</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlock(buyer._id || buyer.id)}
                            disabled={processingId === (buyer._id || buyer.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                          >
                            <FaBan />
                            <span>Block</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredBuyers.length === 0 && (
            <div className="text-center py-12">
              <FaUser className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No buyers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBuyers;

