'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';

const Wishlist = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { showSuccess, showError, showWarning } = useToast();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasFetchedRef = useRef(false);

    const fetchWishlist = useCallback(async () => {
        if (hasFetchedRef.current) return; // Prevent multiple simultaneous calls
        hasFetchedRef.current = true;
        
        setLoading(true);
        setError(null);
        try {
            const response = await wishlistAPI.getWishlist();
            console.log('Wishlist response:', response);

            if (response.success) {
                // API returns items array where each item has a 'gem' property
                const items = response.items || response.data || response.wishlist || [];
                console.log('Wishlist items:', items);
                setWishlistItems(items);
            } else {
                setError('Failed to load wishlist');
            }
        } catch (err) {
            console.error('Error fetching wishlist:', err);
            setError(err.message || 'Failed to load wishlist');
        } finally {
            setLoading(false);
            hasFetchedRef.current = false; // Reset after fetch completes
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchWishlist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]); // Only depend on isAuthenticated to prevent infinite loops

    const handleRemoveFromWishlist = async (item) => {
        const gemId = item.gem?._id || item.gem?.id || item._id || item.id;

        console.log('Removing from wishlist:', { item, gemId });

        if (!gemId) {
            console.error('No gem ID found for item:', item);
            showError('Cannot remove item - invalid ID');
            return;
        }

        try {
            const response = await wishlistAPI.removeFromWishlist(gemId);
            if (response.success) {
                // Remove item from local state
                setWishlistItems(wishlistItems.filter(wishlistItem => {
                    const itemGemId = wishlistItem.gem?._id || wishlistItem.gem?.id || wishlistItem._id || wishlistItem.id;
                    return itemGemId !== gemId;
                }));
                showSuccess('Removed from wishlist');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            showError(error.message || 'Failed to remove from wishlist');
        }
    };

    const handleAddToCart = (item) => {
        // Extract gem data (API returns { gem: {...}, addedAt: ... })
        const gem = item.gem || item;

        addToCart({
            id: gem._id || gem.id,
            name: gem.name,
            price: gem.price,
            discount: gem.discount,
            discountType: gem.discountType,
            image: gem.heroImage || gem.images?.[0] || null,
            category: gem.category,
            sizeWeight: gem.sizeWeight,
            sizeUnit: gem.sizeUnit
        });
        showSuccess(
            `✨ ${gem.name} added to cart!`,
            {
                label: 'Go to Cart',
                icon: <FaShoppingCart className="w-3.5 h-3.5" />,
                onClick: () => navigate('/cart')
            }
        );
    };

    const handleClearWishlist = async () => {
        if (!window.confirm('Are you sure you want to clear your entire wishlist?')) {
            return;
        }

        try {
            const response = await wishlistAPI.clearWishlist();
            if (response.success) {
                setWishlistItems([]);
            }
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            showError('Failed to clear wishlist');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <FaHeart className="w-16 h-16 text-red-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Wishlist</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchWishlist}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
                    >
                        <FaArrowLeft />
                        <span className="font-medium">Back</span>
                    </button>

                    <div className="text-center py-20">
                        <FaHeart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Start adding gems you love to your wishlist and never lose track of them!
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl font-semibold"
                        >
                            Explore Gems
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-4 transition-colors"
                    >
                        <FaArrowLeft />
                        <span className="font-medium">Back</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center">
                                <FaHeart className="text-red-500 mr-3" />
                                My Wishlist
                            </h1>
                            <p className="text-gray-600">
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                            </p>
                        </div>
                        {wishlistItems.length > 0 && (
                            <button
                                onClick={handleClearWishlist}
                                className="text-red-600 hover:text-red-700 font-medium transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Wishlist Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {wishlistItems.map((item) => {
                            // Extract gem data (API returns { gem: {...}, addedAt: ... })
                            const gem = item.gem || item;
                            const gemId = gem._id || gem.id;

                            return (
                                <motion.div
                                    key={gemId}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                        <img
                                            src={gem.heroImage || gem.images?.[0] || '/placeholder-gem.jpg'}
                                            alt={gem.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                                            onClick={() => navigate(`/gem/${gemId}`)}
                                        />
                                        <button
                                            onClick={() => handleRemoveFromWishlist(item)}
                                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg text-red-500 hover:bg-red-50 transition-colors"
                                            title="Remove from wishlist"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                        {gem.discount && Number(gem.discount) > 0 && (
                                            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                {gem.discountType === 'percentage' ? `${gem.discount}% OFF` : `₹${gem.discount} OFF`}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3
                                            className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 cursor-pointer hover:text-emerald-600 transition-colors"
                                            onClick={() => navigate(`/gem/${gemId}`)}
                                        >
                                            {gem.name}
                                        </h3>
                                        <p className="text-sm text-emerald-600 font-medium mb-2">{gem.category}</p>

                                        {/* Price */}
                                        <div className="flex items-center space-x-2 mb-4">
                                            <span className="text-xl font-bold text-gray-900">
                                                ₹{(gem.discount && Number(gem.discount) > 0
                                                    ? gem.discountType === 'percentage'
                                                        ? gem.price - (gem.price * gem.discount) / 100
                                                        : gem.price - gem.discount
                                                    : gem.price
                                                ).toLocaleString()}
                                            </span>
                                            {gem.discount && Number(gem.discount) > 0 && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    ₹{gem.price.toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        {/* Specifications */}
                                        {gem.sizeWeight && (
                                            <p className="text-sm text-gray-600 mb-4">
                                                {gem.sizeWeight} {gem.sizeUnit}
                                            </p>
                                        )}

                                        {/* Add to Cart Button */}
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                                        >
                                            <FaShoppingCart className="w-4 h-4" />
                                            <span>Add to Cart</span>
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Wishlist;

