'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaShoppingCart, FaEye, FaStar, FaPhone } from 'react-icons/fa';
import { useCurrency } from '../../contexts/CurrencyContext';

const GemCard = ({ gem, onAddToCart, onToggleWishlist, isWishlisted = false, hideActions = false }) => {
    const { formatPrice } = useCurrency();
    const visualLabel = gem.category || gem.subcategory || gem.name;

    const calculatePrice = () => {
        if (gem.discount && Number(gem.discount) > 0) {
            const discountAmount = gem.discountType === 'percentage'
                ? (gem.price * gem.discount) / 100
                : gem.discount;
            return gem.price - discountAmount;
        }
        return gem.price;
    };

    const getGemEmoji = (category) => {
        const emojiMap = {
            'Emerald': '💚',
            'Ruby': '🔴',
            'Sapphire': '💙',
            'Diamond': '💎',
            'Pearl': '🤍',
            'Coral': '🟥',
            'Gomed': '🤎',
            'Hessonite': '🤎',
            'Cat\'s Eye': '👁️',
            'Moonstone': '🌙',
            'Turquoise': '🩵',
            'Opal': '🌈',
            'Yellow Sapphire': '💛',
        };
        return emojiMap[category] || '💎';
    };

    const getGemGradient = (category) => {
        const gradientMap = {
            'Emerald': 'from-green-500 to-emerald-600',
            'Ruby': 'from-red-500 to-pink-600',
            'Sapphire': 'from-blue-500 to-indigo-600',
            'Diamond': 'from-gray-300 to-gray-500',
            'Pearl': 'from-gray-100 to-gray-300',
            'Coral': 'from-red-400 to-red-600',
            'Gomed': 'from-amber-500 to-orange-600',
            'Hessonite': 'from-amber-500 to-orange-600',
            'Cat\'s Eye': 'from-yellow-400 to-gray-500',
            'Moonstone': 'from-blue-100 to-purple-200',
            'Turquoise': 'from-cyan-400 to-teal-500',
            'Opal': 'from-pink-200 to-purple-300',
            'Yellow Sapphire': 'from-yellow-400 to-amber-500',
        };
        return gradientMap[category] || 'from-gray-400 to-gray-600';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full flex flex-col"
        >
            {/* Image Section */}
            <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden flex-shrink-0">
                <Link to={`/gem/${gem._id || gem.id}`} className="block w-full h-full">
                    {(gem.images && gem.images.length > 0) || gem.heroImage || gem.allImages?.[0] ? (
                        <img
                            src={gem.images?.[0] || gem.heroImage || gem.allImages?.[0]}
                            alt={gem.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                        />
                    ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getGemGradient(visualLabel)} flex items-center justify-center cursor-pointer`}>
                            <span className="text-4xl sm:text-5xl md:text-6xl">{getGemEmoji(visualLabel)}</span>
                        </div>
                    )}
                </Link>

                {/* Badges */}
                {(() => {
                    const hasDiscount = gem.discount && Number(gem.discount) > 0;
                    const isOutOfStock = !gem.availability;

                    if (!hasDiscount && !isOutOfStock) return null;

                    return (
                        <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 flex flex-col gap-1.5 sm:gap-2 z-10">
                            {hasDiscount && (
                                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-lg">
                                    {gem.discountType === 'percentage'
                                        ? `${Math.round(Number(gem.discount))}% OFF`
                                        : `${formatPrice(Number(gem.discount))} OFF`}
                                </span>
                            )}
                            {isOutOfStock && (
                                <span className="bg-gray-600 text-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-lg">
                                    Out of Stock
                                </span>
                            )}
                        </div>
                    );
                })()}

                {/* Action Buttons */}
                <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 flex flex-col gap-1.5 sm:gap-2 z-10">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onToggleWishlist) {
                                onToggleWishlist(gem);
                            }
                        }}
                        className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${isWishlisted
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white'
                            }`}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <FaHeart
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${isWishlisted ? 'fill-current' : ''}`}
                            style={isWishlisted ? { fill: 'currentColor' } : {}}
                        />
                    </button>
                    {/* <Link
                        to={`/gem/${gem._id || gem.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm text-gray-600 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-md"
                        aria-label="View gem details"
                    >
                        <FaEye className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    </Link> */}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col">
                {/* Category / Subcategory & Rating */}
                <div className="flex items-start justify-between mb-1.5 sm:mb-2 gap-2">
                    <div className="text-[10px] sm:text-xs text-gray-600 space-y-0.5">
                        <div>
                            <span className="font-semibold text-gray-700">Category:</span>{' '}
                            {gem.category || 'N/A'}
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">Subcategory:</span>{' '}
                            {gem.subcategory || 'N/A'}
                        </div>
                    </div>
                    <div className="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
                        {(gem.averageRating || gem.rating) ? (
                            <>
                                <FaStar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-yellow-400" />
                                <span className="text-xs sm:text-sm text-gray-600">{gem.averageRating || gem.rating}</span>
                            </>
                        ) : (
                            <span className="text-xs sm:text-sm font-semibold text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full">New</span>
                        )}
                    </div>
                </div>

                {/* Gem Name */}
                <Link to={`/gem/${gem._id || gem.id}`} className="flex-shrink-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 sm:mb-1.5 hover:text-emerald-600 transition-colors cursor-pointer leading-tight line-clamp-1">
                        {gem.name}
                    </h3>
                    {gem.hindiName && (
                        <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2 line-clamp-1">
                            {gem.hindiName}
                        </p>
                    )}
                    {gem.birthMonth && (
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1">
                            Birth Month: {gem.birthMonth}
                        </p>
                    )}
                </Link>

                {/* Price Section */}
                {!gem.contactForPrice ? (
                    <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-1 sm:gap-2">
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
                            <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                                {formatPrice(calculatePrice())}
                            </span>
                            {gem.discount && Number(gem.discount) > 0 && (
                                <span className="text-sm sm:text-base md:text-lg text-gray-500 line-through">
                                    {formatPrice(gem.price)}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mb-3 sm:mb-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-2 sm:p-2.5 md:p-3">
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-0.5 sm:mb-1">Price on Request</p>
                            <p className="text-[10px] sm:text-xs text-gray-600">Contact us for pricing details</p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {!hideActions && (
                    <div className="flex space-x-1.5 sm:space-x-2 mt-auto">
                        {gem.contactForPrice ? (
                            <a
                                href="tel:9999888800"
                                className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105"
                            >
                                <FaPhone className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                <span className="truncate">Contact</span>
                            </a>
                        ) : (
                            <>
                                <button
                                    onClick={() => onAddToCart && onAddToCart(gem)}
                                    disabled={!gem.availability}
                                    className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 ${gem.availability
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 transform hover:scale-105'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    <FaShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                    <span className="truncate">{gem.availability ? 'Add to Cart' : 'Out of Stock'}</span>
                                </button>


                            </>
                        )}
                    </div>
                )}

                {/* Additional Info */}
                {!hideActions && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-[10px] sm:text-xs md:text-sm text-gray-500 gap-2">
                            <span className="truncate flex-1 min-w-0">
                                {gem.sizeWeight && gem.sizeUnit ? `${gem.sizeWeight} ${gem.sizeUnit}` : 'Premium Quality'}
                            </span>
                            <span className="flex items-center space-x-1 flex-shrink-0">
                                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${gem.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="whitespace-nowrap">{gem.availability ? 'Available' : 'Unavailable'}</span>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default GemCard;
