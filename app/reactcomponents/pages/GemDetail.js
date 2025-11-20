'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gemAPI, wishlistAPI, reviewAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { FaHeart, FaShoppingCart, FaStar, FaArrowLeft, FaShare, FaCheck, FaTruck, FaCertificate, FaFacebook, FaTwitter, FaPinterest, FaLinkedin, FaUndo, FaCreditCard, FaPlay } from 'react-icons/fa';
import GemCard from '../components/gems/GemCard';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';

const GemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, isInCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const { formatPrice } = useCurrency();
    const { showSuccess, showError, showWarning } = useToast();
    const [gem, setGem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [showAllBenefits, setShowAllBenefits] = useState(false);
    const [showAllSuitableFor, setShowAllSuitableFor] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);
    const [togglingWishlist, setTogglingWishlist] = useState(false);

    useEffect(() => {
        console.log('GemDetail mounted. Gem ID:', id, 'Is Authenticated:', isAuthenticated);
        fetchGemDetails();
        if (isAuthenticated) {
            checkWishlistStatus();
        }
        fetchReviews();
    }, [id, isAuthenticated]);

    // Keyboard support and body scroll lock for image modal
    useEffect(() => {
        if (!showImageModal) {
            document.body.style.overflow = '';
            return;
        }

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowImageModal(false);
            } else if (e.key === 'ArrowLeft') {
                const allImages = [];
                if (gem?.heroImage) allImages.push(gem.heroImage);
                if (gem?.additionalImages && gem.additionalImages.length > 0) {
                    allImages.push(...gem.additionalImages);
                }
                const imagesToShow = allImages.length > 0 ? allImages : (gem?.allImages || []);
                if (imagesToShow.length > 1) {
                    setModalImageIndex((prev) => prev === 0 ? imagesToShow.length - 1 : prev - 1);
                }
            } else if (e.key === 'ArrowRight') {
                const allImages = [];
                if (gem?.heroImage) allImages.push(gem.heroImage);
                if (gem?.additionalImages && gem.additionalImages.length > 0) {
                    allImages.push(...gem.additionalImages);
                }
                const imagesToShow = allImages.length > 0 ? allImages : (gem?.allImages || []);
                if (imagesToShow.length > 1) {
                    setModalImageIndex((prev) => prev === imagesToShow.length - 1 ? 0 : prev + 1);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [showImageModal, gem]);

    const fetchGemDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await gemAPI.getGemById(id);




            if (response.success) {
                const gemData = response.data || response.gem;
                // Combine heroImage and additionalImages for gallery
                const allImages = [];
                if (gemData.heroImage) allImages.push(gemData.heroImage);
                if (gemData.additionalImages && gemData.additionalImages.length > 0) {
                    allImages.push(...gemData.additionalImages);
                }
                // Update gem with combined images
                setGem({ ...gemData, allImages });

                // Handle related products
                if (response.relatedProducts && Array.isArray(response.relatedProducts)) {
                    setRelatedProducts(response.relatedProducts);
                }
            } else {
                setError('Gem not found');
            }
        } catch (err) {
            console.error('Error fetching gem details:', err);
            setError(err.message || 'Failed to fetch gem details');
        } finally {
            setLoading(false);
        }
    };

    const checkWishlistStatus = async () => {
        try {
            console.log('Checking wishlist status for gem:', id);
            const response = await wishlistAPI.isInWishlist(id);
            console.log('Wishlist status response:', response);
            if (response.success) {
                setIsWishlisted(response.isInWishlist || false);
                console.log('Is wishlisted:', response.isInWishlist);
            }
        } catch (err) {
            console.error('Error checking wishlist status:', err);
            // Set to false on error
            setIsWishlisted(false);
        }
    };

    const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
            const response = await reviewAPI.getGemReviews(id);
            if (response.success) {
                setReviews(response.reviews || response.data || []);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoadingReviews(false);
        }
    };

    const calculatePrice = () => {
        if (!gem) return 0;
        if (gem.discount && gem.discount > 0) {
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
            'Cat\'s Eye': 'from-yellow-400 to-gray-500',
            'Moonstone': 'from-blue-100 to-purple-200',
            'Turquoise': 'from-cyan-400 to-teal-500',
            'Opal': 'from-pink-200 to-purple-300',
            'Yellow Sapphire': 'from-yellow-400 to-amber-500',
        };
        return gradientMap[category] || 'from-gray-400 to-gray-600';
    };

    const handleAddToCart = async () => {
        if (!gem) return;

        setAddingToCart(true);
        try {
            // Add to local cart context with the specified quantity
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
                stock: gem.stock,
                quantity: quantity // Pass the quantity directly
            });

            // Show success feedback
            showSuccess(`✨ Added ${quantity} ${gem.name} to cart!`);

            // Reset quantity to 1
            setQuantity(1);
        } catch (error) {
            console.error('Error adding to cart:', error);
            showError('Failed to add to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleGoToCart = () => {
        navigate('/cart');
    };

    const handleToggleWishlist = async () => {
        if (!isAuthenticated) {
            showWarning('Please login to add items to wishlist');
            navigate('/login');
            return;
        }

        if (togglingWishlist) {
            console.log('Already toggling wishlist, please wait');
            return;
        }

        setTogglingWishlist(true);
        console.log('Toggling wishlist. Current status:', isWishlisted);

        try {
            if (isWishlisted) {
                console.log('Removing from wishlist...');
                const response = await wishlistAPI.removeFromWishlist(id);
                console.log('Remove response:', response);
                if (response.success) {
                    setIsWishlisted(false);
                    showSuccess('Removed from wishlist');
                } else {
                    throw new Error(response.message || 'Failed to remove from wishlist');
                }
            } else {
                console.log('Adding to wishlist...');
                const response = await wishlistAPI.addToWishlist(id);
                console.log('Add response:', response);
                if (response.success) {
                    setIsWishlisted(true);
                    showSuccess('Added to wishlist');
                } else {
                    throw new Error(response.message || 'Failed to add to wishlist');
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            showError(error.message || 'Failed to update wishlist. Please try again.');
        } finally {
            setTogglingWishlist(false);
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        setTimeout(() => {
            navigate('/checkout');
        }, 500);
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= (gem?.stock || 10)) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Loading gem details...</p>
                </div>
            </div>
        );
    }

    if (error || !gem) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">💎</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Gem Not Found</h2>
                    <p className="text-gray-600 mb-8">{error || 'The gem you are looking for does not exist.'}</p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const handleRelatedProductAddToCart = (relatedGem) => {
        addToCart({
            id: relatedGem._id || relatedGem.id,
            name: relatedGem.name,
            price: relatedGem.price,
            discount: relatedGem.discount,
            discountType: relatedGem.discountType,
            image: relatedGem.allImages?.[0] || relatedGem.heroImage || relatedGem.images?.[0] || null,
            category: relatedGem.category,
            sizeWeight: relatedGem.sizeWeight,
            sizeUnit: relatedGem.sizeUnit,
            stock: relatedGem.stock,
            quantity: 1
        });
        showSuccess(
            `✨ ${relatedGem.name} added to cart!`,
            {
                label: 'Go to Cart',
                icon: <FaShoppingCart className="w-3.5 h-3.5" />,
                onClick: () => navigate('/cart')
            }
        );
    };

    const handleRelatedProductWishlist = async (relatedGem) => {
        if (!isAuthenticated) {
            showWarning('Please login to add items to wishlist');
            navigate('/login');
            return;
        }

        const gemId = relatedGem._id || relatedGem.id;

        console.log('Related product wishlist toggle:', { relatedGem, gemId });

        if (!gemId) {
            console.error('No gem ID found for related product:', relatedGem);
            showError('Cannot add to wishlist - invalid gem ID');
            return;
        }

        try {
            // For now, always try to add (we don't track wishlist state for related products)
            const response = await wishlistAPI.addToWishlist(gemId);
            if (response.success) {
                showSuccess(`❤️ ${relatedGem.name} added to wishlist`);
            } else {
                throw new Error(response.message || 'Failed to add to wishlist');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            showError(error.message || 'Failed to add to wishlist');
        }
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const title = gem?.name || 'Check out this gemstone';
        const text = gem?.description || '';

        let shareUrl = '';
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case 'pinterest':
                shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            default:
                return;
        }
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back Button */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                </div>

                {/* Main Product Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
                    {/* Image Gallery */}
                    <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-4 lg:self-start relative z-10 max-w-md">
                        {/* Main Image */}
                        <motion.div
                            className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 relative z-10 max-w-full"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            key={selectedImage}
                        >
                            {(() => {
                                // Get all images: heroImage + additionalImages
                                const allImages = [];
                                if (gem.heroImage) allImages.push(gem.heroImage);
                                if (gem.additionalImages && gem.additionalImages.length > 0) {
                                    allImages.push(...gem.additionalImages);
                                }

                                if (allImages.length > 0) {
                                    return (
                                        <img
                                            src={allImages[selectedImage]}
                                            alt={gem.name}
                                            className="w-full h-full object-cover transition-opacity duration-300 cursor-zoom-in"
                                            onClick={() => {
                                                setModalImageIndex(selectedImage);
                                                setShowImageModal(true);
                                            }}
                                        />
                                    );
                                } else if (gem.allImages && gem.allImages.length > 0) {
                                    return (
                                        <img
                                            src={gem.allImages[selectedImage]}
                                            alt={gem.name}
                                            className="w-full h-full object-cover transition-opacity duration-300 cursor-zoom-in"
                                            onClick={() => {
                                                setModalImageIndex(selectedImage);
                                                setShowImageModal(true);
                                            }}
                                        />
                                    );
                                } else {
                                    return (
                                        <div className={`w-full h-full bg-gradient-to-br ${getGemGradient(gem.category || gem.name)} flex items-center justify-center`}>
                                            <span className="text-6xl sm:text-8xl">{getGemEmoji(gem.category || gem.name)}</span>
                                        </div>
                                    );
                                }
                            })()}
                        </motion.div>

                        {/* Thumbnail Images - Fixed to 4 thumbnails */}
                        {(() => {
                            // Get all images: heroImage + additionalImages
                            const allImages = [];
                            if (gem.heroImage) allImages.push(gem.heroImage);
                            if (gem.additionalImages && gem.additionalImages.length > 0) {
                                allImages.push(...gem.additionalImages);
                            }

                            // Fallback to allImages if available
                            const imagesToShow = allImages.length > 0 ? allImages : (gem.allImages || []);

                            // Show up to 4 thumbnails (main, side, scale, video placeholder)
                            const thumbnailsToShow = imagesToShow.slice(0, 4);

                            // Always show 4 thumbnails if we have images
                            if (imagesToShow.length > 0) {
                                return (
                                    <div className="grid grid-cols-4 gap-3 relative z-10">
                                        {thumbnailsToShow.map((image, index) => (
                                            <motion.button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 relative z-10 ${selectedImage === index
                                                    ? 'border-emerald-500 ring-2 ring-emerald-200 scale-105 shadow-md'
                                                    : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                                                    }`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${gem.name} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </motion.button>
                                        ))}
                                        {/* Video placeholder if we have less than 4 images */}
                                        {imagesToShow.length < 4 && (
                                            <div className="aspect-square rounded-lg border-2 border-gray-200 bg-gray-100 flex items-center justify-center cursor-pointer hover:border-emerald-300 hover:bg-gray-50 transition-all">
                                                <FaPlay className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>

                    {/* Product Details - Redesigned */}
                    <div className="space-y-6">
                        {/* Title, SKU, and Wishlist */}
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                                        {gem.name}
                                    </h1>
                                    {gem.sku && (
                                        <p className="text-sm text-gray-500 mb-3">SKU: {gem.sku}</p>
                                    )}
                                </div>
                                <button
                                    onClick={handleToggleWishlist}
                                    disabled={togglingWishlist}
                                    className={`p-2.5 rounded-lg transition-all duration-200 ml-4 ${togglingWishlist
                                        ? 'bg-gray-100 text-gray-400 cursor-wait'
                                        : isWishlisted
                                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                            : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500'
                                        }`}
                                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                    {togglingWishlist ? (
                                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                    ) : (
                                        <FaHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    )}
                                </button>
                            </div>

                            {/* Price */}
                            <div className="mb-4">
                                {!gem?.contactForPrice ? (
                                    <>
                                        <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                                            {formatPrice(calculatePrice())}
                                        </span>
                                        {gem.discount && gem.discount > 0 && (
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-xl text-gray-500 line-through">
                                                    {formatPrice(gem.price)}
                                                </span>
                                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                    {gem.discountType === 'percentage' ? `${gem.discount}% OFF` : `₹${gem.discount} OFF`}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-lg font-semibold text-gray-800 mb-1">Price on Request</p>
                                        <p className="text-sm text-gray-600">Contact us for pricing details</p>
                                    </div>
                                )}
                            </div>

                            {/* Origin */}
                            {gem.origin && (
                                <div className="mb-4">
                                    <p className="text-base text-gray-700">
                                        <span className="font-semibold">Origin:</span> {gem.origin}
                                    </p>
                                </div>
                            )}

                            {/* Description */}
                            {gem.description && (
                                <p className="text-base text-gray-700 leading-relaxed mb-6">
                                    {gem.description}
                                </p>
                            )}

                            {/* Action Button */}
                            <div className="mb-6">
                                {gem?.contactForPrice ? (
                                    <a
                                        href="tel:9999888800"
                                        className="w-full inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                    >
                                        <span>Contact for Price</span>
                                    </a>
                                ) : isInCart(gem._id || gem.id) ? (
                                    <button
                                        onClick={handleGoToCart}
                                        className="w-full px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                    >
                                        <FaShoppingCart className="w-5 h-5" />
                                        <span>GO TO CART</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!gem.availability || addingToCart}
                                        className={`w-full px-8 py-3.5 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg ${!gem.availability || addingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <FaShoppingCart className="w-5 h-5" />
                                        <span>{addingToCart ? 'Adding...' : 'ADD TO CART'}</span>
                                    </button>
                                )}
                            </div>

                            {/* Shipping Info */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">WORLDWIDE</span> Shipping in{' '}
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-800 font-bold text-sm mx-1">
                                        {gem.deliveryDays || 7}
                                    </span>
                                    {' '}business days.
                                </p>
                            </div>
                        </div>

                        {/* Customer Trust Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Over 4000+ Happy Customers
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={`w-6 h-6 ${star <= (gem.averageRating || gem.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                ))}
                                {gem.averageRating || gem.rating ? (
                                    <span className="ml-2 text-lg font-semibold text-gray-900">
                                        {gem.averageRating || gem.rating}
                                    </span>
                                ) : null}
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                                BASED ON {gem.totalReviews || gem.reviews?.length || 200}+ GOOGLE REVIEWS
                            </p>
                        </div>

                        {/* Policy and Share Section */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="bg-white p-2 rounded-lg">
                                    <FaUndo className="w-5 h-5 text-gray-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Return Policy</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="bg-white p-2 rounded-lg">
                                    <FaCreditCard className="w-5 h-5 text-gray-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Payment Method</p>
                                </div>
                            </div>
                        </div>

                        {/* Share Section */}
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-900 mb-3">Share:</p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleShare('facebook')}
                                    className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    title="Share on Facebook"
                                >
                                    <FaFacebook className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleShare('twitter')}
                                    className="p-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                                    title="Share on Twitter"
                                >
                                    <FaTwitter className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleShare('pinterest')}
                                    className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                    title="Share on Pinterest"
                                >
                                    <FaPinterest className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleShare('linkedin')}
                                    className="p-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
                                    title="Share on LinkedIn"
                                >
                                    <FaLinkedin className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Additional Details - Collapsible Sections */}
                        {/* Quick Specs */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {gem.sizeWeight && (
                                <div className="bg-gray-50 p-3 rounded-lg  border border-gray-200">
                                    <h4 className="text-xs text-gray-500 mb-1">Weight</h4>
                                    <p className="text-sm font-bold text-gray-900">{gem.sizeWeight} {gem.sizeUnit}</p>
                                </div>
                            )}
                            {gem.color && (
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <h4 className="text-xs text-gray-500 mb-1">Color</h4>
                                    <p className="text-sm font-bold text-gray-900">{gem.color}</p>
                                </div>
                            )}
                            {gem.planet && (
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <h4 className="text-xs text-gray-500 mb-1">Planet</h4>
                                    <p className="text-sm font-bold text-gray-900">{gem.planet}</p>
                                </div>
                            )}
                        </div>

                        {/* Benefits */}
                        {gem.benefits && gem.benefits.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                                <button
                                    onClick={() => setShowAllBenefits(!showAllBenefits)}
                                    className="w-full flex items-center justify-between mb-3"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">Benefits</h3>
                                    <span className="text-emerald-600 text-sm font-medium">
                                        {showAllBenefits ? 'Show Less' : `Show All (${gem.benefits.length})`}
                                    </span>
                                </button>
                                <ul className="space-y-2">
                                    {(showAllBenefits ? gem.benefits : gem.benefits.slice(0, 5)).map((benefit, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <FaCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-600">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Suitable For */}
                        {(gem.suitableFor && gem.suitableFor.length > 0) || (gem.whomToUse && gem.whomToUse.length > 0) ? (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                                <button
                                    onClick={() => setShowAllSuitableFor(!showAllSuitableFor)}
                                    className="w-full flex items-center justify-between mb-3"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">Suitable For</h3>
                                    <span className="text-emerald-600 text-sm font-medium">
                                        {showAllSuitableFor ? 'Show Less' : `Show All (${(gem.suitableFor || gem.whomToUse || []).length})`}
                                    </span>
                                </button>
                                <div className="flex flex-wrap gap-2">
                                    {(showAllSuitableFor
                                        ? (gem.suitableFor || gem.whomToUse || [])
                                        : (gem.suitableFor || gem.whomToUse || []).slice(0, 6)
                                    ).map((person, index) => (
                                        <span
                                            key={index}
                                            className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-medium"
                                        >
                                            {person}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* Seller Information */}
                        {gem.seller && (
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sold By</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-lg text-gray-900">{gem.seller.shopName || gem.seller.fullName}</p>
                                        {gem.seller.shopName && (
                                            <p className="text-sm text-gray-600 mt-1">{gem.seller.fullName}</p>
                                        )}
                                        {gem.seller.rating && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <FaStar className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm font-semibold">{gem.seller.rating}</span>
                                                <span className="text-xs text-gray-500">Seller Rating</span>
                                            </div>
                                        )}
                                    </div>
                                    {gem.seller.isVerified && (
                                        <div className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1">
                                            <FaCheck className="w-3 h-3" />
                                            Verified
                                        </div>
                                    )}
                                </div>
                                {gem.certification && (
                                    <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center gap-2">
                                        <FaCertificate className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm text-gray-700">Certified: {gem.certification}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                {reviews.length > 0 && (
                    <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Customer Reviews</h3>
                        <div className="space-y-4 sm:space-y-6">
                            {reviews.slice(0, 5).map((review, index) => (
                                <motion.div
                                    key={review._id || review.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border-b border-gray-200 pb-4 sm:pb-6 last:border-b-0 last:pb-0"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-emerald-600 font-semibold text-xs sm:text-sm">
                                                        {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                        {review.user?.name || 'Anonymous'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(review.createdAt || review.date).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <FaStar
                                                        key={star}
                                                        className={`text-xs sm:text-sm ${star <= (review.rating || 5)
                                                            ? 'text-yellow-400 fill-current'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                        {review.comment || review.review}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                        {reviews.length > 5 && (
                            <button
                                onClick={() => navigate(`/gem/${id}/reviews`)}
                                className="mt-4 sm:mt-6 text-emerald-600 hover:text-emerald-700 font-medium text-xs sm:text-sm"
                            >
                                View All {reviews.length} Reviews →
                            </button>
                        )}
                    </div>
                )}

                {loadingReviews && (
                    <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-xs sm:text-sm">Loading reviews...</p>
                    </div>
                )}

                {/* Related Products Section */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-12 sm:mt-16">
                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Related Products</h2>
                            <button
                                onClick={() => navigate('/shop')}
                                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm sm:text-base flex items-center gap-2"
                            >
                                View All
                                <FaArrowLeft className="w-4 h-4 rotate-180" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {relatedProducts.map((relatedGem) => (
                                <GemCard
                                    key={relatedGem._id || relatedGem.id}
                                    gem={relatedGem}
                                    onAddToCart={handleRelatedProductAddToCart}
                                    onToggleWishlist={handleRelatedProductWishlist}
                                    isWishlisted={false}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Image Zoom Modal */}
                <AnimatePresence>
                    {showImageModal && gem && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
                            onClick={() => setShowImageModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowImageModal(false)}
                                    className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/70 hover:bg-black/90 rounded-full p-2 sm:p-3 backdrop-blur-sm shadow-lg"
                                    aria-label="Close"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Main Image */}
                                {(() => {
                                    const allImages = [];
                                    if (gem.heroImage) allImages.push(gem.heroImage);
                                    if (gem.additionalImages && gem.additionalImages.length > 0) {
                                        allImages.push(...gem.additionalImages);
                                    }
                                    const imagesToShow = allImages.length > 0 ? allImages : (gem.allImages || []);

                                    return (
                                        <>
                                            <motion.div
                                                key={modalImageIndex}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-center justify-center mb-3 sm:mb-4"
                                            >
                                                <img
                                                    src={imagesToShow[modalImageIndex]}
                                                    alt={`${gem.name} - Image ${modalImageIndex + 1}`}
                                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                                />
                                            </motion.div>

                                            {/* Thumbnail Navigation */}
                                            {imagesToShow.length > 1 && (
                                                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 max-w-full px-4">
                                                    {imagesToShow.map((image, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setModalImageIndex(index)}
                                                            className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${modalImageIndex === index
                                                                ? 'border-emerald-500 ring-2 ring-emerald-300 scale-110'
                                                                : 'border-gray-600 hover:border-gray-400'
                                                                }`}
                                                        >
                                                            <img
                                                                src={image}
                                                                alt={`Thumbnail ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Navigation Arrows */}
                                            {imagesToShow.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setModalImageIndex((prev) =>
                                                                prev === 0 ? imagesToShow.length - 1 : prev - 1
                                                            );
                                                        }}
                                                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white transition-all"
                                                        aria-label="Previous image"
                                                    >
                                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setModalImageIndex((prev) =>
                                                                prev === imagesToShow.length - 1 ? 0 : prev + 1
                                                            );
                                                        }}
                                                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white transition-all"
                                                        aria-label="Next image"
                                                    >
                                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}

                                            {/* Image Counter */}
                                            {imagesToShow.length > 1 && (
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                                                    {modalImageIndex + 1} / {imagesToShow.length}
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GemDetail;