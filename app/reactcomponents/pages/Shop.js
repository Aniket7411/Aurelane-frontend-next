'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gemAPI, wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import GemCard from '../components/gems/GemCard';
import Pagination from '../components/gems/Pagination';
import {
    FaSpinner,
    FaExclamationTriangle,
    FaSearch,
    FaFilter,
    FaRupeeSign,
    FaSortAmountDown,
    FaCheck,
    FaTimes,
    FaGem,
    FaSort,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { MdCategory, MdPriceCheck, MdClear, MdEventAvailable } from 'react-icons/md';

const birthMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const parseCategoryParam = (rawValue) => {
    if (!rawValue) return [];
    return rawValue
        .split(',')
        .map((item) => decodeURIComponent(item).trim())
        .filter(Boolean);
};

const arraysAreEqual = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
};

const Shop = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentSearchString = searchParams.toString();
    const lastSyncedQueryRef = React.useRef(currentSearchString);
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { showSuccess, showError, showWarning } = useToast();
    const [gems, setGems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({});
    const [categories, setCategories] = useState([]);
    const [wishlist, setWishlist] = useState(new Set());
    const [loadingWishlist, setLoadingWishlist] = useState(false);

    // Filter states
    const initialSearch = searchParams.get('query') || '';
    const initialCategories = parseCategoryParam(searchParams.get('category'));
    const initialBirthMonth = searchParams.get('birthMonth') || '';

    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        search: initialSearch,
        category: initialCategories, // Multiple categories
        minPrice: '',
        maxPrice: '',
        sort: 'newest',
        birthMonth: initialBirthMonth
    });

    // Temporary filter inputs (before apply)
    const [tempFilters, setTempFilters] = useState({
        search: initialSearch || '',
        category: initialCategories,
        minPrice: '',
        maxPrice: '',
        sort: 'newest',
        birthMonth: initialBirthMonth
    });

    const {
        page,
        limit,
        search,
        category: categoryFilter,
        minPrice,
        maxPrice,
        sort,
        birthMonth
    } = filters;

    const categoryKey = categoryFilter.join('|');

    // Fetch gems
    const fetchGems = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {};
            if (page) params.page = page;
            if (limit) params.limit = limit;
            if (search) params.search = search;
            if (categoryKey) params.category = categoryKey.split('|').join(',');
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;
            if (sort) params.sort = sort;
            if (birthMonth) params.birthMonth = birthMonth;

            const response = await gemAPI.getGems(params);

            console.log("response", response);

            if (response.success) {
                setGems(response.data?.gems || response.gems || []);
                setPagination(response.data?.pagination || response.pagination || {});
            } else {
                setError('Failed to fetch gems');
            }
        } catch (err) {
            console.error('Error fetching gems:', err);
            setError(err.message || 'Failed to fetch gems');
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, minPrice, maxPrice, sort, birthMonth, categoryKey]);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            const response = await gemAPI.getGemCategories();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    }, []);

    // Fetch wishlist
    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlist(new Set());
            return;
        }

        try {
            setLoadingWishlist(true);
            const response = await wishlistAPI.getWishlist();
            if (response.success && response.items) {
                const wishlistIds = new Set(
                    response.items.map(item => item.gem?._id || item.gem?.id || item.gem)
                );
                setWishlist(wishlistIds);
            }
        } catch (err) {
            console.error('Error fetching wishlist:', err);
        } finally {
            setLoadingWishlist(false);
        }
    }, [isAuthenticated]);
    const filtersKey = useMemo(() => JSON.stringify({
        page,
        limit,
        search,
        minPrice,
        maxPrice,
        sort,
        birthMonth,
        categoryKey
    }), [page, limit, search, minPrice, maxPrice, sort, birthMonth, categoryKey]);

    const lastFetchKeyRef = useRef('');

    // Initial load / refetch on filter changes
    useEffect(() => {
        if (lastFetchKeyRef.current === filtersKey) {
            return;
        }
        lastFetchKeyRef.current = filtersKey;
        fetchGems();
    }, [filtersKey, fetchGems]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    useEffect(() => {
        const params = new URLSearchParams(currentSearchString);
        const updatedSearch = params.get('query') || '';
        const updatedCategories = parseCategoryParam(params.get('category'));
        const updatedBirthMonth = params.get('birthMonth') || '';

        setFilters(prev => {
            const isSameSearch = prev.search === updatedSearch;
            const isSameCategories = arraysAreEqual(prev.category, updatedCategories);
            const isSameBirthMonth = prev.birthMonth === updatedBirthMonth;

            if (isSameSearch && isSameCategories && isSameBirthMonth) {
                return prev;
            }

            return {
                ...prev,
                search: updatedSearch,
                category: updatedCategories,
                birthMonth: updatedBirthMonth,
                page: 1
            };
        });

        setTempFilters(prev => {
            const isSameSearch = prev.search === updatedSearch;
            const isSameCategories = arraysAreEqual(prev.category, updatedCategories);
            const isSameBirthMonth = prev.birthMonth === updatedBirthMonth;

            if (isSameSearch && isSameCategories && isSameBirthMonth) {
                return prev;
            }

            return {
                ...prev,
                search: updatedSearch,
                category: updatedCategories,
                birthMonth: updatedBirthMonth
            };
        });

        lastSyncedQueryRef.current = currentSearchString;
    }, [currentSearchString]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.search) params.set('query', filters.search);
        if (filters.category && filters.category.length > 0) params.set('category', filters.category.join(','));
        if (filters.birthMonth) params.set('birthMonth', filters.birthMonth);

        const nextQuery = params.toString();
        if (lastSyncedQueryRef.current === nextQuery) {
            return;
        }
        lastSyncedQueryRef.current = nextQuery;
        navigate(nextQuery ? `/shop?${nextQuery}` : '/shop', { replace: true });
    }, [filters.search, filters.category, filters.birthMonth, navigate]);

    // Handle apply filters
    const handleApplyFilters = () => {
        setFilters(prev => ({
            ...prev,
            search: tempFilters.search,
            category: tempFilters.category,
            minPrice: tempFilters.minPrice,
            maxPrice: tempFilters.maxPrice,
            sort: tempFilters.sort,
            birthMonth: tempFilters.birthMonth,
            page: 1 // Reset to first page when filters change
        }));
    };

    // Handle search input
    const handleSearchChange = (e) => {
        setTempFilters(prev => ({
            ...prev,
            search: e.target.value
        }));
    };

    // Handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setFilters(prev => ({
            ...prev,
            search: tempFilters.search,
            page: 1
        }));
    };

    // Handle category toggle
    const handleCategoryToggle = (category) => {
        setTempFilters(prev => {
            const isSelected = prev.category.includes(category);
            return {
                ...prev,
                category: isSelected
                    ? prev.category.filter(c => c !== category)
                    : [...prev.category, category]
            };
        });
    };

    // Handle price change
    const handlePriceChange = (type, value) => {
        setTempFilters(prev => ({
            ...prev,
            [type]: value
        }));
    };

    // Handle sort change
    const handleSortChange = (value) => {
        setTempFilters(prev => ({
            ...prev,
            sort: value
        }));
        // Apply sort immediately
        setFilters(prev => ({
            ...prev,
            sort: value,
            page: 1
        }));
    };

    // Handle pagination
    const handlePageChange = (page, newLimit = null) => {
        setFilters(prev => ({
            ...prev,
            page,
            limit: newLimit || prev.limit
        }));
    };

    // Clear all filters
    const clearFilters = () => {
        const resetFilters = {
            page: 1,
            limit: 12,
            search: '',
            category: [],
            minPrice: '',
            maxPrice: '',
            sort: 'newest',
            birthMonth: ''
        };
        setFilters(resetFilters);
        setTempFilters({
            search: '',
            category: [],
            minPrice: '',
            maxPrice: '',
            sort: 'newest',
            birthMonth: ''
        });
    };

    // Handle add to cart
    const handleAddToCart = (gem) => {
        addToCart({
            id: gem._id || gem.id, // Use _id from MongoDB or id
            name: gem.name,
            price: gem.price,
            discount: gem.discount,
            discountType: gem.discountType,
            image: gem.allImages?.[0] || gem.heroImage || gem.images?.[0] || null,
            category: gem.category,
            sizeWeight: gem.sizeWeight,
            sizeUnit: gem.sizeUnit,
            stock: gem.stock
        });

        // Show success toast
        showSuccess(`🛒 ${gem.name} added to cart!`);
    };

    // Handle wishlist toggle
    const handleToggleWishlist = async (gem) => {
        const gemId = gem._id || gem.id;

        if (!isAuthenticated) {
            showWarning('Please login to add items to your wishlist');
            navigate('/login');
            return;
        }

        try {
            const isCurrentlyWishlisted = wishlist.has(gemId);

            // Optimistic update
            setWishlist(prev => {
                const newWishlist = new Set(prev);
                if (isCurrentlyWishlisted) {
                    newWishlist.delete(gemId);
                } else {
                    newWishlist.add(gemId);
                }
                return newWishlist;
            });

            // Make API call
            if (isCurrentlyWishlisted) {
                const response = await wishlistAPI.removeFromWishlist(gemId);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to remove from wishlist');
                }
                showSuccess(`❤️ ${gem.name} removed from wishlist`);
            } else {
                const response = await wishlistAPI.addToWishlist(gemId);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to add to wishlist');
                }
                showSuccess(`❤️ ${gem.name} added to wishlist`);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            // Revert optimistic update on error
            setWishlist(prev => {
                const newWishlist = new Set(prev);
                if (wishlist.has(gemId)) {
                    newWishlist.delete(gemId);
                } else {
                    newWishlist.add(gemId);
                }
                return newWishlist;
            });
            showError(error.message || 'Failed to update wishlist');
        }
    };

    // Loading state
    if (loading && gems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <FaSpinner className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 animate-spin mx-auto mb-3 sm:mb-4" />
                    <p className="text-lg sm:text-xl text-gray-600">Loading gems...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/30">


            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12 -mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-5 md:p-6 sticky top-6"
                        >
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
                                <div className="p-2 sm:p-2.5 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-lg sm:rounded-xl shadow-lg">
                                    <FaFilter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Filters</h2>
                            </div>

                            {/* Search */}
                            <form onSubmit={handleSearchSubmit} className="mb-4 sm:mb-6">
                                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    <FaSearch className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                                    <span>Search Gems</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <FaSearch className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={tempFilters.search}
                                        onChange={handleSearchChange}
                                        placeholder="Search by name, category..."
                                        className="w-full pl-9 sm:pl-10 pr-16 sm:pr-20 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md bg-white"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs sm:text-sm font-medium rounded-md sm:rounded-lg hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg flex items-center gap-1"
                                    >
                                        <span>Find</span>
                                    </button>
                                </div>
                            </form>

                            {/* Category Filter */}
                            <div className="mb-4 sm:mb-6">
                                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                    <MdCategory className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                                    <span>Categories</span>
                                </label>
                                <div className="space-y-1.5 sm:space-y-2 max-h-48 sm:max-h-56 overflow-y-auto custom-scrollbar pr-2">
                                    {categories.map((category) => (
                                        <label
                                            key={category}
                                            className={`flex items-center space-x-2 sm:space-x-3 cursor-pointer p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all ${tempFilters.category.includes(category)
                                                ? 'bg-emerald-50 border border-emerald-200'
                                                : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={tempFilters.category.includes(category)}
                                                onChange={() => handleCategoryToggle(category)}
                                                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer"
                                            />
                                            <span className={`text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 ${tempFilters.category.includes(category)
                                                ? 'text-emerald-700 font-semibold'
                                                : 'text-gray-700'
                                                }`}>
                                                {tempFilters.category.includes(category) && (
                                                    <FaCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />
                                                )}
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-4 sm:mb-6">
                                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                    <MdPriceCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                                    <span>Price Range</span>
                                </label>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="relative">
                                        <div className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <FaRupeeSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </div>
                                        <input
                                            type="number"
                                            value={tempFilters.minPrice}
                                            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                                            placeholder="Min Price"
                                            min="0"
                                            className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <FaRupeeSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </div>
                                        <input
                                            type="number"
                                            value={tempFilters.maxPrice}
                                            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                                            placeholder="Max Price"
                                            min="0"
                                            className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Birth Month */}
                            <div className="mb-4 sm:mb-6">
                                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                    <MdEventAvailable className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                                    <span>Birth Month</span>
                                </label>
                                <select
                                    value={tempFilters.birthMonth}
                                    onChange={(e) => setTempFilters(prev => ({ ...prev, birthMonth: e.target.value }))}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                                >
                                    <option value="">Any Birth Month</option>
                                    {birthMonths.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="mb-4 sm:mb-6">
                                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    <FaSort className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                                    <span>Sort By</span>
                                </label>
                                <div className="relative">
                                    <FaSortAmountDown className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none" />
                                    <select
                                        value={tempFilters.sort}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-9 sm:pr-10 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white cursor-pointer appearance-none"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>

                            {/* Apply Filters Button */}
                            <div className="space-y-2 sm:space-y-3">
                                <button
                                    onClick={handleApplyFilters}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-1.5 sm:gap-2"
                                >
                                    <FaCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span>Apply Filters</span>
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-300 text-gray-700 text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                                >
                                    <MdClear className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span>Clear All</span>
                                </button>
                            </div>

                            {/* Active Filters Count */}
                            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
                                        <FaGem className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                                        <div className="text-xl sm:text-2xl font-bold text-emerald-600">
                                            {pagination.totalItems || 0}
                                        </div>
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 font-medium">
                                        {pagination.totalItems === 1 ? 'gem found' : 'gems found'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Gems Grid */}
                    <div className="lg:col-span-3">
                        {/* Results Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 sm:mb-6 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                        <HiSparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                                            Discover Our Collection
                                        </h2>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-600 flex items-center gap-1 flex-wrap">
                                        <span>Showing</span>
                                        <span className="font-semibold text-emerald-600">{gems.length}</span>
                                        <span>of</span>
                                        <span className="font-semibold">{pagination.totalItems || 0}</span>
                                        <span>gems</span>
                                    </p>
                                </div>
                            </div>

                            {/* Active Filters */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                                {filters.search && (
                                    <span className="bg-emerald-100 text-emerald-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 font-medium">
                                        <FaSearch className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        <span className="truncate max-w-[120px] sm:max-w-none">Search: "{filters.search}"</span>
                                        <button
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, search: '' }));
                                                setTempFilters(prev => ({ ...prev, search: '' }));
                                            }}
                                            className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors flex-shrink-0"
                                            aria-label="Remove search filter"
                                        >
                                            <FaTimes className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        </button>
                                    </span>
                                )}
                                {filters.category.map((cat) => (
                                    <span key={cat} className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 font-medium">
                                        <MdCategory className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        <span className="truncate max-w-[100px] sm:max-w-none">{cat}</span>
                                        <button
                                            onClick={() => {
                                                const newCategories = filters.category.filter(c => c !== cat);
                                                setFilters(prev => ({ ...prev, category: newCategories }));
                                                setTempFilters(prev => ({ ...prev, category: newCategories }));
                                            }}
                                            className="hover:bg-blue-200 rounded-full p-0.5 transition-colors flex-shrink-0"
                                            aria-label={`Remove ${cat} filter`}
                                        >
                                            <FaTimes className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        </button>
                                    </span>
                                ))}
                                {(filters.minPrice || filters.maxPrice) && (
                                    <span className="bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 font-medium">
                                        <FaRupeeSign className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        <span className="truncate">Price: ₹{filters.minPrice || '0'} - ₹{filters.maxPrice || '∞'}</span>
                                        <button
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
                                                setTempFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
                                            }}
                                            className="hover:bg-purple-200 rounded-full p-0.5 transition-colors flex-shrink-0"
                                            aria-label="Remove price filter"
                                        >
                                            <FaTimes className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        </button>
                                    </span>
                                )}
                                {filters.birthMonth && (
                                    <span className="bg-pink-100 text-pink-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 font-medium">
                                        <MdEventAvailable className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        <span>{filters.birthMonth} Birth Month</span>
                                        <button
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, birthMonth: '' }));
                                                setTempFilters(prev => ({ ...prev, birthMonth: '' }));
                                            }}
                                            className="hover:bg-pink-200 rounded-full p-0.5 transition-colors flex-shrink-0"
                                            aria-label="Remove birth month filter"
                                        >
                                            <FaTimes className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        </button>
                                    </span>
                                )}
                                {filters.sort !== 'newest' && (
                                    <span className="bg-gray-100 text-gray-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 font-medium">
                                        <FaSort className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        <span>Sort: {filters.sort === 'oldest' ? 'Oldest' : filters.sort === 'price-low' ? (
                                            <>
                                                <FaArrowUp className="w-2 h-2 sm:w-2.5 sm:h-2.5 inline" /> Price Low-High
                                            </>
                                        ) : (
                                            <>
                                                <FaArrowDown className="w-2 h-2 sm:w-2.5 sm:h-2.5 inline" /> Price High-Low
                                            </>
                                        )}</span>
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        {/* Error State */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8"
                            >
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <FaExclamationTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base sm:text-lg font-semibold text-red-800">Error Loading Gems</h3>
                                        <p className="text-sm sm:text-base text-red-600 break-words">{error}</p>
                                        <button
                                            onClick={fetchGems}
                                            className="mt-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Gems Grid */}
                        {!error && (
                            <>
                                {gems.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-12 sm:py-16 md:py-20 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
                                    >
                                        <FaSearch className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">
                                            No matching gems found
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto">
                                            Try different filters or search terms to discover our beautiful collection of gemstones.
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                                        >
                                            <MdClear className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span>Clear All Filters</span>
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        layout
                                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-6 sm:mb-8"
                                    >
                                        <AnimatePresence>
                                            {gems.map((gem) => (
                                                <motion.div
                                                    key={gem._id || gem.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <GemCard
                                                        gem={gem}
                                                        onAddToCart={handleAddToCart}
                                                        onToggleWishlist={handleToggleWishlist}
                                                        isWishlisted={wishlist.has(gem._id || gem.id)}
                                                    />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )}

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <Pagination
                                        currentPage={pagination.currentPage}
                                        totalPages={pagination.totalPages}
                                        onPageChange={handlePageChange}
                                        hasNext={pagination.hasNext}
                                        hasPrev={pagination.hasPrev}
                                        totalItems={pagination.totalItems}
                                        itemsPerPage={filters.limit}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
