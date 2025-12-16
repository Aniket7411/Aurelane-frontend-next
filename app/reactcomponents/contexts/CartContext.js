'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateGSTSummary } from '../utils/gstUtils';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Mark as mounted on client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load cart from localStorage on mount (only on client)
    useEffect(() => {
        if (!isMounted) return;
        
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, [isMounted]);

    // Save cart to localStorage whenever it changes (only on client)
    useEffect(() => {
        if (!isMounted) return;
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems, isMounted]);

    // Add item to cart
    const addToCart = (item) => {
        setCartItems(prevItems => {
            // Check if this exact item (with same id) already exists
            const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);

            if (existingItemIndex !== -1) {
                // Item exists, increase quantity by the amount being added
                const updatedItems = [...prevItems];
                const quantityToAdd = item.quantity || 1;
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + quantityToAdd
                };
                return updatedItems;
            } else {
                // New item, add to cart with specified quantity
                return [...prevItems, { ...item, quantity: item.quantity || 1 }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    // Update item quantity
    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Get total items count
    const getCartItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Get total price
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const price = item.discount && item.discount > 0
                ? item.discountType === 'percentage'
                    ? item.price - (item.price * item.discount) / 100
                    : item.price - item.discount
                : item.price;
            return total + (price * item.quantity);
        }, 0);
    };

    // Get total discount
    const getTotalDiscount = () => {
        return cartItems.reduce((total, item) => {
            if (item.discount && item.discount > 0) {
                const discountAmount = item.discountType === 'percentage'
                    ? (item.price * item.discount) / 100
                    : item.discount;
                return total + (discountAmount * item.quantity);
            }
            return total;
        }, 0);
    };

    // Check if item is in cart
    const isInCart = (itemId) => {
        return cartItems.some(item => item.id === itemId);
    };

    // Get item quantity in cart
    const getItemQuantity = (itemId) => {
        const item = cartItems.find(item => item.id === itemId);
        return item ? item.quantity : 0;
    };

    // Get cart summary with detailed calculations including GST
    const getCartSummary = () => {
        const baseSubtotal = getTotalPrice();
        const freeShippingThreshold = 50000; // ₹50,000 for free shipping
        
        // Calculate GST summary
        const gstSummary = calculateGSTSummary(cartItems);
        
        // Shipping is calculated on base subtotal (before GST)
        const shipping = baseSubtotal >= freeShippingThreshold ? 0 : 500; // ₹500 shipping
        
        // Total includes: base subtotal + GST + shipping
        const total = gstSummary.grandTotal + shipping;
        const itemCount = getCartItemCount();
        const isEligibleForFreeShipping = baseSubtotal >= freeShippingThreshold;

        return {
            itemCount,
            subtotal: baseSubtotal,
            gst: gstSummary.totalGST,
            gstBreakdown: gstSummary.gstBreakdown,
            shipping,
            total,
            freeShippingThreshold,
            isEligibleForFreeShipping,
            discount: getTotalDiscount()
        };
    };

    const value = {
        cartItems,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItemCount,
        getTotalPrice,
        getTotalDiscount,
        isInCart,
        getItemQuantity,
        getCartSummary,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;