'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI, authAPI } from '../services/api';
import { FaGem, FaSearch, FaTrash, FaStore, FaFilter } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeller, setFilterSeller] = useState('all');
  const [sellers, setSellers] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchSellers = useCallback(async () => {
    try {
      const response = await adminAPI.getSellers();
      if (response.success) {
        setSellers(response.sellers || response.data?.sellers || []);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllProducts({
        search: searchTerm || undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        sellerId: filterSeller !== 'all' ? filterSeller : undefined
      });

      if (response.success) {
        setProducts(response.products || response.data?.products || response.gems || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      showError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterCategory, filterSeller, showError]);

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

    fetchSellers();
  }, [navigate, fetchSellers]);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      return;
    }

    const user = authAPI.getCurrentUser();
    if (user?.role !== 'admin') {
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchProducts]);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(productId);
      const response = await adminAPI.deleteProduct(productId);
      if (response.success) {
        showSuccess('Product deleted successfully');
        fetchProducts();
      } else {
        showError(response.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const getSellerName = (sellerId) => {
    const seller = sellers.find(s => (s._id || s.id) === sellerId);
    return seller?.name || seller?.fullName || seller?.shopName || 'Unknown Seller';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesSeller = filterSeller === 'all' || (product.sellerId || product.seller) === filterSeller;
    
    return matchesSearch && matchesCategory && matchesSeller;
  });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
              <p className="text-gray-600">View and manage all products</p>
            </div>
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-emerald-600">{products.length}</p>
            </div>
            <FaGem className="text-emerald-600 text-4xl" />
          </div>
        </motion.div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <FaStore className="text-gray-400" />
              <select
                value={filterSeller}
                onChange={(e) => setFilterSeller(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Sellers</option>
                {sellers.map(seller => (
                  <option key={seller._id || seller.id} value={seller._id || seller.id}>
                    {seller.shopName || seller.name || seller.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 bg-gray-100">
                <img
                  src={product.image || product.images?.[0] || '/placeholder-gem.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-emerald-600 font-medium">{product.category}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description || 'No description available'}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-lg font-bold text-gray-900">₹{product.price?.toLocaleString() || '0'}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Seller</p>
                    <p className="text-sm font-medium text-gray-700">
                      {getSellerName(product.sellerId || product.seller)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/gem/${product._id || product.id}`}
                    className="flex-1 text-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id || product.id)}
                    disabled={deletingId === (product._id || product.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FaGem className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;

