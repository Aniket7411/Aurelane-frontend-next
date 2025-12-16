/**
 * GST Utility Functions for Gemstones
 * 
 * This file contains GST category definitions and calculation functions
 * based on Indian GST rates for gemstones.
 */

// GST Categories and their rates
export const GST_CATEGORIES = {
    ROUGH_UNWORKED: {
        value: 'rough_unworked',
        label: 'Rough/Unworked Precious & Semi-precious Stones',
        rate: 0, // 0%
        description: 'Uncut and unpolished gemstones (excluding diamonds)'
    },
    CUT_POLISHED: {
        value: 'cut_polished',
        label: 'Cut & Polished Loose Gemstones (excl. diamonds)',
        rate: 2, // 2%
        description: 'Cut and polished loose gemstones excluding diamonds'
    },
    ROUGH_DIAMONDS: {
        value: 'rough_diamonds',
        label: 'Rough/Unpolished Diamonds',
        rate: 0.25, // 0.25%
        description: 'Uncut and unpolished diamonds'
    },
    CUT_DIAMONDS: {
        value: 'cut_diamonds',
        label: 'Cut & Polished Loose Diamonds',
        rate: 1, // 1%
        description: 'Cut and polished loose diamonds'
    }
};

/**
 * Get all GST categories as an array for dropdowns
 */
export const getGSTCategories = () => {
    return Object.values(GST_CATEGORIES);
};

/**
 * Get GST category by value
 * @param {string} value - The GST category value
 * @returns {Object|null} - The GST category object or null if not found
 */
export const getGSTCategoryByValue = (value) => {
    return Object.values(GST_CATEGORIES).find(category => category.value === value) || null;
};

/**
 * Calculate GST amount for a given price and GST rate
 * @param {number} price - The base price
 * @param {number} gstRate - The GST rate percentage (e.g., 2 for 2%)
 * @returns {number} - The GST amount
 */
export const calculateGST = (price, gstRate) => {
    if (!price || price <= 0) return 0;
    if (!gstRate || gstRate < 0) return 0;
    return Math.round((price * gstRate) / 100 * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate total price including GST
 * @param {number} price - The base price
 * @param {number} gstRate - The GST rate percentage
 * @returns {number} - The total price including GST
 */
export const calculatePriceWithGST = (price, gstRate) => {
    if (!price || price <= 0) return 0;
    const gstAmount = calculateGST(price, gstRate);
    return Math.round((price + gstAmount) * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate GST for a gem item
 * Note: Price from backend already includes GST
 * @param {Object} item - The gem item with price (includes GST) and gstCategory
 * @param {number} quantity - The quantity (default: 1)
 * @returns {Object} - Object containing basePrice, gstAmount, and totalPrice
 */
export const calculateGSTForItem = (item, quantity = 1) => {
    if (!item || !item.price) {
        return {
            basePrice: 0,
            gstAmount: 0,
            totalPrice: 0,
            gstRate: 0
        };
    }

    // Get GST category
    const gstCategory = getGSTCategoryByValue(item.gstCategory);
    const gstRate = gstCategory ? gstCategory.rate : 0;

    // Price already includes GST, calculate price after discount first
    let priceWithGST = item.price;
    if (item.discount && item.discount > 0) {
        if (item.discountType === 'percentage') {
            priceWithGST = item.price - (item.price * item.discount) / 100;
        } else {
            priceWithGST = item.price - item.discount;
        }
    }

    // Calculate base price (before GST) from price that includes GST
    // Formula: basePrice = priceWithGST / (1 + gstRate / 100)
    const basePrice = gstRate > 0 
        ? priceWithGST / (1 + gstRate / 100)
        : priceWithGST;
    
    // Calculate GST amount
    const gstAmount = priceWithGST - basePrice;

    // Calculate for the quantity
    const totalBasePrice = Math.round(basePrice * quantity * 100) / 100;
    const totalGSTAmount = Math.round(gstAmount * quantity * 100) / 100;
    const totalPrice = Math.round(priceWithGST * quantity * 100) / 100;

    return {
        basePrice: totalBasePrice,
        gstAmount: totalGSTAmount,
        totalPrice: totalPrice,
        gstRate: gstRate,
        gstCategory: gstCategory ? gstCategory.label : null
    };
};

/**
 * Calculate GST summary for multiple items (cart)
 * @param {Array} items - Array of cart items
 * @returns {Object} - Object containing subtotal, totalGST, and grandTotal
 */
export const calculateGSTSummary = (items) => {
    if (!items || items.length === 0) {
        return {
            subtotal: 0,
            totalGST: 0,
            grandTotal: 0,
            gstBreakdown: []
        };
    }

    let subtotal = 0;
    const gstBreakdown = {};

    // Calculate GST for each item
    items.forEach(item => {
        const itemGST = calculateGSTForItem(item, item.quantity || 1);
        subtotal += itemGST.basePrice;

        // Group GST by rate
        const rateKey = itemGST.gstRate.toString();
        if (!gstBreakdown[rateKey]) {
            gstBreakdown[rateKey] = {
                rate: itemGST.gstRate,
                amount: 0,
                items: []
            };
        }
        gstBreakdown[rateKey].amount += itemGST.gstAmount;
        gstBreakdown[rateKey].items.push({
            name: item.name,
            quantity: item.quantity || 1,
            gstAmount: itemGST.gstAmount
        });
    });

    // Calculate total GST
    const totalGST = Object.values(gstBreakdown).reduce((sum, group) => {
        return sum + group.amount;
    }, 0);

    const grandTotal = subtotal + totalGST;

    return {
        subtotal: Math.round(subtotal * 100) / 100,
        totalGST: Math.round(totalGST * 100) / 100,
        grandTotal: Math.round(grandTotal * 100) / 100,
        gstBreakdown: Object.values(gstBreakdown).map(group => ({
            rate: group.rate,
            amount: Math.round(group.amount * 100) / 100,
            items: group.items
        }))
    };
};

/**
 * Format GST rate for display
 * @param {number} rate - The GST rate
 * @returns {string} - Formatted rate string
 */
export const formatGSTRate = (rate) => {
    if (rate === 0) return '0%';
    if (rate < 1) return `${rate}%`;
    return `${rate}%`;
};

