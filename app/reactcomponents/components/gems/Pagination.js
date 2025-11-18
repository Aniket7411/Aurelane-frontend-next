'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    hasNext,
    hasPrev,
    totalItems,
    itemsPerPage
}) => {
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Results Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Showing {startItem} to {endItem} of {totalItems} results
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Items per page:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onPageChange(1, parseInt(e.target.value))}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                        <option value={96}>96</option>
                    </select>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center space-x-2">
                {/* Previous Button */}
                <motion.button
                    onClick={() => hasPrev && onPageChange(currentPage - 1)}
                    disabled={!hasPrev}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${hasPrev
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 transform hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    whileHover={hasPrev ? { scale: 1.05 } : {}}
                    whileTap={hasPrev ? { scale: 0.95 } : {}}
                >
                    <FaChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                </motion.button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                    {getVisiblePages().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-gray-400">
                                    <FaEllipsisH className="w-4 h-4" />
                                </span>
                            ) : (
                                <motion.button
                                    onClick={() => onPageChange(page)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${page === currentPage
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {page}
                                </motion.button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Next Button */}
                <motion.button
                    onClick={() => hasNext && onPageChange(currentPage + 1)}
                    disabled={!hasNext}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${hasNext
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 transform hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    whileHover={hasNext ? { scale: 1.05 } : {}}
                    whileTap={hasNext ? { scale: 0.95 } : {}}
                >
                    <span className="hidden sm:inline">Next</span>
                    <FaChevronRight className="w-4 h-4" />
                </motion.button>
            </div>

            {/* Quick Jump */}
            <div className="mt-4 flex items-center justify-center space-x-2">
                <span className="text-sm text-gray-600">Go to page:</span>
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                            onPageChange(page);
                        }
                    }}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm text-center focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <span className="text-sm text-gray-600">of {totalPages}</span>
            </div>
        </div>
    );
};

export default Pagination;
