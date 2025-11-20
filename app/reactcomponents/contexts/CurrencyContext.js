'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

// Supported currencies with their symbols and icons
export const CURRENCIES = {
    USD: { code: 'USD', name: 'US Dollar', symbol: '$', icon: 'FaDollarSign' },
    EUR: { code: 'EUR', name: 'Euro', symbol: '€', icon: 'FaEuroSign' },
    GBP: { code: 'GBP', name: 'British Pound', symbol: '£', icon: 'FaPoundSign' },
    INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', icon: 'FaRupeeSign' },
    AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', icon: 'FaDollarSign' },
    CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', icon: 'FaDollarSign' },
    AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', icon: 'FaDollarSign' },
    SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', icon: 'FaDollarSign' },
    HKD: { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', icon: 'FaDollarSign' },
    ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', icon: 'FaDollarSign' },
    LKR: { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', icon: 'FaRupeeSign' }
};

// Base currency (INR) - all prices in backend are stored in INR
const BASE_CURRENCY = 'INR';

// Exchange rates cache (in-memory)
let exchangeRatesCache = null;
let exchangeRatesTimestamp = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Fetch exchange rates from a free API
const fetchExchangeRates = async () => {
    try {
        // Using exchangerate-api.com free tier (no API key required for basic usage)
        // Alternative: You can use fixer.io, currencyapi.net, or any other service
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }
        
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Fallback: Return default rates (1:1 for all currencies as fallback)
        const fallbackRates = {};
        Object.keys(CURRENCIES).forEach(code => {
            fallbackRates[code] = 1;
        });
        return fallbackRates;
    }
};

// Get exchange rates (with caching)
const getExchangeRates = async () => {
    const now = Date.now();
    
    // Return cached rates if still valid
    if (exchangeRatesCache && exchangeRatesTimestamp && (now - exchangeRatesTimestamp) < CACHE_DURATION) {
        return exchangeRatesCache;
    }
    
    // Fetch new rates
    const rates = await fetchExchangeRates();
    exchangeRatesCache = rates;
    exchangeRatesTimestamp = now;
    
    // Also store in localStorage as backup
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('exchangeRates', JSON.stringify({ rates, timestamp: now }));
        } catch (e) {
            console.error('Error saving exchange rates to localStorage:', e);
        }
    }
    
    return rates;
};

// Load cached rates from localStorage on initialization
const loadCachedRates = () => {
    if (typeof window === 'undefined') return null;
    
    try {
        const cached = localStorage.getItem('exchangeRates');
        if (cached) {
            const { rates, timestamp } = JSON.parse(cached);
            const now = Date.now();
            
            // Use cache if less than 1 hour old
            if (now - timestamp < CACHE_DURATION) {
                exchangeRatesCache = rates;
                exchangeRatesTimestamp = timestamp;
                return rates;
            }
        }
    } catch (e) {
        console.error('Error loading cached exchange rates:', e);
    }
    
    return null;
};

export const CurrencyProvider = ({ children }) => {
    const [selectedCurrency, setSelectedCurrency] = useState('INR');
    const [exchangeRates, setExchangeRates] = useState(null);
    const [isLoadingRates, setIsLoadingRates] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Mark as mounted on client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load currency preference from localStorage
    useEffect(() => {
        if (!isMounted) return;
        
        const savedCurrency = localStorage.getItem('selectedCurrency');
        if (savedCurrency && CURRENCIES[savedCurrency]) {
            setSelectedCurrency(savedCurrency);
        }
        
        // Load cached exchange rates
        const cachedRates = loadCachedRates();
        if (cachedRates) {
            setExchangeRates(cachedRates);
        }
    }, [isMounted]);

    // Fetch exchange rates on mount and when currency changes
    useEffect(() => {
        if (!isMounted) return;
        
        const loadRates = async () => {
            setIsLoadingRates(true);
            try {
                const rates = await getExchangeRates();
                setExchangeRates(rates);
            } catch (error) {
                console.error('Error loading exchange rates:', error);
            } finally {
                setIsLoadingRates(false);
            }
        };
        
        loadRates();
        
        // Refresh rates every hour
        const interval = setInterval(loadRates, CACHE_DURATION);
        return () => clearInterval(interval);
    }, [isMounted]);

    // Save currency preference to localStorage
    useEffect(() => {
        if (!isMounted) return;
        localStorage.setItem('selectedCurrency', selectedCurrency);
    }, [selectedCurrency, isMounted]);

    // Convert price from INR (base currency) to selected currency
    const convertPrice = useCallback((priceInINR) => {
        if (!priceInINR || priceInINR === 0) return 0;
        if (selectedCurrency === BASE_CURRENCY) return priceInINR;
        if (!exchangeRates || !exchangeRates[selectedCurrency]) return priceInINR;
        
        return priceInINR * exchangeRates[selectedCurrency];
    }, [selectedCurrency, exchangeRates]);

    // Format price with currency symbol
    const formatPrice = useCallback((priceInINR, options = {}) => {
        const convertedPrice = convertPrice(priceInINR);
        const currency = CURRENCIES[selectedCurrency];
        
        const {
            showSymbol = true,
            minimumFractionDigits = 0,
            maximumFractionDigits = 2
        } = options;
        
        if (showSymbol) {
            // Use Intl.NumberFormat for proper formatting
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: selectedCurrency,
                minimumFractionDigits,
                maximumFractionDigits,
            }).format(convertedPrice);
        } else {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits,
                maximumFractionDigits,
            }).format(convertedPrice);
        }
    }, [selectedCurrency, convertPrice]);

    // Get currency symbol
    const getCurrencySymbol = useCallback(() => {
        return CURRENCIES[selectedCurrency]?.symbol || '₹';
    }, [selectedCurrency]);

    // Get currency info
    const getCurrencyInfo = useCallback(() => {
        return CURRENCIES[selectedCurrency] || CURRENCIES[BASE_CURRENCY];
    }, [selectedCurrency]);

    const value = {
        selectedCurrency,
        setSelectedCurrency,
        exchangeRates,
        isLoadingRates,
        convertPrice,
        formatPrice,
        getCurrencySymbol,
        getCurrencyInfo,
        baseCurrency: BASE_CURRENCY,
        currencies: CURRENCIES
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

export default CurrencyContext;

