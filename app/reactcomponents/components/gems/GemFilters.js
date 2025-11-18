'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaTimes, FaSearch, FaChevronDown } from 'react-icons/fa';

const GemFilters = ({
    filters,
    onFilterChange,
    categories = [],
    onSearch,
    onClearFilters,
    totalResults = 0
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const zodiacSigns = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    const priceRanges = [
        { label: 'Under ₹10,000', value: { min: 0, max: 10000 } },
        { label: '₹10,000 - ₹50,000', value: { min: 10000, max: 50000 } },
        { label: '₹50,000 - ₹1,00,000', value: { min: 50000, max: 100000 } },
        { label: '₹1,00,000 - ₹5,00,000', value: { min: 100000, max: 500000 } },
        { label: 'Above ₹5,00,000', value: { min: 500000, max: null } },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const handleFilterChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const handlePriceRangeChange = (range) => {
        onFilterChange({
            ...filters,
            minPrice: range.min || '',
            maxPrice: range.max || ''
        });
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        onClearFilters();
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.category) count++;
        if (filters.zodiac) count++;
        if (filters.search) count++;
        return count;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <FaFilter className="text-emerald-600 text-xl" />
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    {getActiveFiltersCount() > 0 && (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm font-medium">
                            {getActiveFiltersCount()} active
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                        {totalResults} gems found
                    </span>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                        <FaChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search gems by name, category, or description..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white px-4 py-1.5 rounded-md hover:bg-emerald-700 transition-colors"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Filters */}
            <AnimatePresence>
                {(isOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6"
                    >
                        {/* Category Filter */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Category</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => handleFilterChange('category', filters.category === category ? '' : category)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filters.category === category
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort by Price */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sort by Price</h3>
                            <select
                                value={filters.sortBy || 'newest'}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name A-Z</option>
                            </select>
                        </div>

                        {/* Zodiac Sign Filter */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Zodiac Sign</h3>
                            <select
                                value={filters.zodiac || ''}
                                onChange={(e) => handleFilterChange('zodiac', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="">All Zodiac Signs</option>
                                {zodiacSigns.map((sign) => (
                                    <option key={sign} value={sign}>
                                        {sign}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Clear Filters Button */}
                        {getActiveFiltersCount() > 0 && (
                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={clearAllFilters}
                                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                                >
                                    <FaTimes className="w-4 h-4" />
                                    <span>Clear All Filters</span>
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GemFilters;
