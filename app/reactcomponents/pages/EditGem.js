'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from '../lib/nextRouterAdapter';
import { gemAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { gemstonesData } from '../data/gemstonesData';
import uploadFileToCloudinary from './uploadfunctionnew';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';

const EditGem = () => {
    const { id: paramId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { showSuccess, showError, showWarning } = useToast();
    
    // Memoize id to prevent infinite loops
    const id = useMemo(() => {
        if (paramId) return paramId;
        try {
            if (searchParams && typeof searchParams.get === 'function') {
                return searchParams.get('id');
            }
            if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                return url.searchParams.get('id');
            }
        } catch {
            // ignore
        }
        return null;
    }, [paramId, searchParams]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [gemData, setGemData] = useState({
        name: '',
        hindiName: '',
        planet: '',
        planetHindi: '',
        color: '',
        description: '',
        benefits: [],
        suitableFor: [],
        price: '',
        discount: 0,
        discountType: 'percentage',
        sizeWeight: '',
        sizeUnit: 'carat',
        stock: '',
        availability: true,
        certification: '',
        origin: '',
        deliveryDays: '',
        heroImage: '',
        additionalImages: [],
        contactForPrice: false,
        birthMonth: ''
    });

    // Astrological planets with Hindi names
    const planets = [
        { english: 'Sun (Surya)', hindi: 'सूर्य ग्रह' },
        { english: 'Moon (Chandra)', hindi: 'चंद्र ग्रह' },
        { english: 'Mars (Mangal)', hindi: 'मंगल ग्रह' },
        { english: 'Mercury (Budh)', hindi: 'बुध ग्रह' },
        { english: 'Jupiter (Guru)', hindi: 'गुरु ग्रह' },
        { english: 'Venus (Shukra)', hindi: 'शुक्र ग्रह' },
        { english: 'Saturn (Shani)', hindi: 'शनि ग्रह' },
        { english: 'Rahu', hindi: 'राहु' },
        { english: 'Ketu', hindi: 'केतु' }
    ];

    // Common gem categories
    const gemCategories = [
        // Navratna
        'Blue Sapphire (Neelam)',
        'Yellow Sapphire (Pukhraj)',
        'Ruby (Manik)',
        'Emerald (Panna)',
        'Diamond (Heera)',
        'Pearl (Moti)',
        'Cat\'s Eye (Lehsunia)',
        'Hessonite (Gomed)',
        'Coral (Moonga)',
        // Exclusive Gemstones
        'Alexandrite',
        'Basra Pearl',
        'Burma Ruby',
        'Colombian Emerald',
        'Cornflower Blue Sapphire',
        'Kashmir Blue Sapphire',
        'No-Oil Emerald',
        'Padparadscha Sapphire',
        'Panjshir Emerald',
        'Swat Emerald',
        'Pigeon Blood Ruby',
        'Royal Blue Sapphire',
        // Sapphire
        'Sapphire',
        'Bi-Colour Sapphire (Pitambari)',
        'Blue Sapphire (Neelam)',
        'Color Change Sapphire',
        'Green Sapphire',
        'Pink Sapphire',
        'Padparadscha Sapphire',
        'Peach Sapphire',
        'Purple Sapphire (Khooni Neelam)',
        'White Sapphire',
        'Yellow Sapphire (Pukhraj)',
        // More Vedic Ratna (Upratan)
        'Amethyst',
        'Aquamarine',
        'Blue Topaz',
        'Citrine Stone (Sunela)',
        'Tourmaline',
        'Opal',
        'Tanzanite',
        'Iolite (Neeli)',
        'Jasper (Mahe Mariyam)',
        'Lapis',
        // Legacy categories (keeping for backward compatibility)
        'Emerald',
        'Ruby',
        'Pearl',
        'Red Coral',
        'Gomed (Hessonite)',
        'Diamond',
        'Cat\'s Eye',
        'Moonstone',
        'Turquoise'
    ];

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

    // Common benefits
    const commonBenefits = [
        'Enhances intelligence and communication skills',
        'Improves business acumen and analytical ability',
        'Brings mental clarity and focus',
        'Strengthens interpersonal skills',
        'Reduces anxiety and overthinking',
        'Improves memory retention',
        'Enhances negotiation skills',
        'Financial Prosperity',
        'Health & Healing',
        'Spiritual Growth',
        'Protection',
        'Love & Relationships',
        'Career Success',
        'Peace & Harmony',
        'Courage & Strength',
        'Wisdom & Knowledge',
        'Creativity',
        'Communication'
    ];

    // Suitable for professions
    const suitableProfessions = [
        'Teachers', 'Lawyers', 'Writers', 'Media professionals', 'Finance experts',
        'Communication specialists', 'Students', 'Businessmen', 'Doctors', 'Engineers',
        'Scientists', 'Artists', 'Politicians', 'Consultants', 'Entrepreneurs'
    ];

    // Function to get gem data by name
    const getGemData = (name) => {
        return gemstonesData.find(gem =>
            gem.name.toLowerCase() === name.toLowerCase()
        );
    };

    // Function to auto-populate data based on selection
    const autoPopulateData = (selectedValue, fieldType) => {
        if (fieldType === 'name') {
            const gemData = getGemData(selectedValue);
            if (gemData) {
                setGemData(prev => ({
                    ...prev,
                    hindiName: gemData.hindiName || prev.hindiName,
                    planet: gemData.planet || prev.planet,
                    planetHindi: gemData.planetHindi || prev.planetHindi,
                    color: gemData.color || prev.color,
                    description: gemData.description || prev.description,
                    benefits: gemData.benefits || prev.benefits,
                    suitableFor: gemData.suitableFor || prev.suitableFor
                }));
            }
        }
    };

    const isValidObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(value || '');

    const fetchGemData = useCallback(async (gemId) => {
        if (!gemId || !isValidObjectId(gemId)) {
            setError('Invalid gem ID format');
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            const response = await gemAPI.getGemById(gemId);
            if (response.success) {
                const gem = response.data || response.gem;
                setGemData({
                    name: gem.name || '',
                    hindiName: gem.hindiName || '',
                    planet: gem.planet || '',
                    planetHindi: gem.planetHindi || '',
                    color: gem.color || '',
                    birthMonth: gem.birthMonth || '',
                    description: gem.description || '',
                    benefits: Array.isArray(gem.benefits) ? gem.benefits : [],
                    suitableFor: Array.isArray(gem.suitableFor) ? gem.suitableFor : [],
                    price: gem.price || '',
                    discount: gem.discount || 0,
                    discountType: gem.discountType || 'percentage',
                    sizeWeight: gem.sizeWeight || '',
                    sizeUnit: gem.sizeUnit || 'carat',
                    stock: gem.stock || '',
                    availability: gem.availability !== undefined ? gem.availability : (gem.availability === 'available' ? true : false),
                    certification: gem.certification || '',
                    origin: gem.origin || '',
                    deliveryDays: gem.deliveryDays || '',
                    heroImage: gem.heroImage || gem.image || '',
                    additionalImages: Array.isArray(gem.additionalImages) ? gem.additionalImages : (gem.images ? gem.images : []),
                    contactForPrice: gem.contactForPrice || false
                });
            } else {
                setError(response.message || 'Failed to fetch gem details');
            }
        } catch (err) {
            console.error('Error fetching gem:', err);
            setError(err.message || 'Failed to fetch gem details');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        // Wait until id is available from router/search params
        if (!id) {
            setLoading(false);
            return;
        }
        // Guard against transient invalid id while navigating (prevents first-error flash)
        if (!isValidObjectId(id)) {
            setError('Invalid gem ID format');
            setLoading(false);
            return;
        }
        fetchGemData(id);
    }, [id, isAuthenticated, navigate, fetchGemData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (name === 'suitableFor' || name === 'benefits') {
                setGemData(prev => ({
                    ...prev,
                    [name]: checked
                        ? [...prev[name], value]
                        : prev[name].filter(item => item !== value)
                }));
            } else {
                setGemData(prev => ({
                    ...prev,
                    [name]: checked
                }));
            }
        } else if (type === 'number') {
            // Handle number inputs with proper rounding
            let processedValue = value;

            // For integer fields (stock, deliveryDays), round to nearest integer
            if (name === 'stock' || name === 'deliveryDays') {
                processedValue = value === '' ? '' : Math.round(parseFloat(value) || 0);
            }
            // For decimal fields (price, discount, sizeWeight), round to 2 decimal places
            else if (name === 'price' || name === 'discount' || name === 'sizeWeight') {
                processedValue = value === '' ? '' : Math.round((parseFloat(value) || 0) * 100) / 100;
            }

            setGemData(prev => ({
                ...prev,
                [name]: processedValue
            }));
        } else {
            setGemData(prev => ({
                ...prev,
                [name]: value
            }));

            // Auto-populate data when name changes
            if (name === 'name') {
                autoPopulateData(value, name);
            }

            // Auto-populate Hindi planet when English planet is selected
            if (name === 'planet') {
                const selectedPlanet = planets.find(p => p.english === value);
                if (selectedPlanet) {
                    setGemData(prev => ({
                        ...prev,
                        planetHindi: selectedPlanet.hindi
                    }));
                }
            }
        }
    };

    // Handle image upload using Cloudinary
    const handleImageUpload = async (e, imageType = 'additional') => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        setUploading(true);

        try {
            for (const file of files) {
                // Create a temporary event object for the upload function
                const tempEvent = { target: { files: [file] } };
                const imageUrl = await uploadFileToCloudinary(tempEvent);

                if (imageUrl) {
                    if (imageType === 'hero') {
                        setGemData(prev => ({
                            ...prev,
                            heroImage: imageUrl
                        }));
                    } else {
                        setGemData(prev => ({
                            ...prev,
                            additionalImages: [...prev.additionalImages, imageUrl]
                        }));
                    }
                } else {
                    throw new Error('Failed to upload image');
                }
            }
        } catch (error) {
            showError(error.message || 'Failed to upload images. Please try again.');
        } finally {
            setUploading(false);
        }

        // Clear the input
        e.target.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!gemData.name || (!gemData.contactForPrice && !gemData.price)) {
            showWarning('Please fill in all required fields');
            return;
        }

        setSaving(true);
        try {
            const updateData = {
                name: gemData.name,
                category: gemData.name, // map selected gem to backend-required category
                hindiName: gemData.hindiName,
                planet: gemData.planet,
                planetHindi: gemData.planetHindi,
                color: gemData.color,
                description: gemData.description,
                birthMonth: gemData.birthMonth || null,
                benefits: gemData.benefits,
                suitableFor: gemData.suitableFor,
                price: gemData.contactForPrice ? null : parseFloat(gemData.price),
                discount: parseFloat(gemData.discount) || 0,
                discountType: gemData.discountType,
                sizeWeight: gemData.sizeWeight ? parseFloat(gemData.sizeWeight) : null,
                sizeUnit: gemData.sizeUnit,
                stock: gemData.stock ? parseInt(gemData.stock) : null,
                availability: gemData.availability,
                certification: gemData.certification,
                origin: gemData.origin,
                deliveryDays: gemData.deliveryDays ? parseInt(gemData.deliveryDays) : null,
                heroImage: gemData.heroImage,
                additionalImages: gemData.additionalImages,
                contactForPrice: gemData.contactForPrice
            };

            const response = await gemAPI.updateGem(id, updateData);
            if (response.success) {
                showSuccess('Gem updated successfully!');
                navigate('/seller-dashboard');
            } else {
                showError(response.message || 'Failed to update gem');
            }
        } catch (error) {
            console.error('Error updating gem:', error);
            showError(error.message || 'Failed to update gem');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading gem details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Gem</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/seller-dashboard')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-4 sm:px-6 py-4 sm:py-6">
                        <button
                            onClick={() => navigate('/seller-dashboard')}
                            className="flex items-center space-x-2 text-white hover:text-emerald-100 mb-4 transition-colors"
                        >
                            <FaArrowLeft />
                            <span>Back to Dashboard</span>
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
                            Edit Gem
                        </h1>
                        <p className="text-emerald-100 text-center mt-2 text-sm sm:text-base">
                            Update all gem details including images
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Basic Information
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gem Name *
                                    </label>
                                    <select
                                        name="name"
                                        value={gemData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Gem Name</option>
                                        {gemCategories.map(gem => (
                                            <option key={gem} value={gem}>{gem}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Hindi Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hindi Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="hindiName"
                                        value={gemData.hindiName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., पन्ना"
                                    />
                                </div>

                                {/* Planet */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Planet *
                                    </label>
                                    <select
                                        name="planet"
                                        value={gemData.planet}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select Planet</option>
                                        {planets.map(planet => (
                                            <option key={planet.english} value={planet.english}>{planet.english}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Planet Hindi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Planet (Hindi)
                                    </label>
                                    <input
                                        type="text"
                                        name="planetHindi"
                                        value={gemData.planetHindi}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                                        placeholder="Auto-filled"
                                        readOnly
                                    />
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Color *
                                    </label>
                                    <input
                                        type="text"
                                        name="color"
                                        value={gemData.color}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., Green"
                                    />
                                </div>

                                {/* Birth Month (Optional) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Birth Month (Optional)
                                    </label>
                                    <select
                                        name="birthMonth"
                                        value={gemData.birthMonth}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Not linked to any birth month</option>
                                        {birthMonths.map(month => (
                                            <option key={month} value={month}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={gemData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Describe the gem's characteristics, quality, and unique features..."
                                />
                            </div>
                        </div>

                        {/* Benefits & Suitable For */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Benefits & Suitable For
                            </h2>

                            {/* Benefits */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Benefits
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {commonBenefits.map(benefit => (
                                        <label key={benefit} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="benefits"
                                                value={benefit}
                                                checked={gemData.benefits.includes(benefit)}
                                                onChange={handleInputChange}
                                                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-gray-700">{benefit}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Suitable For */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Suitable For (Professions)
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {suitableProfessions.map(profession => (
                                        <label key={profession} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="suitableFor"
                                                value={profession}
                                                checked={gemData.suitableFor.includes(profession)}
                                                onChange={handleInputChange}
                                                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-gray-700">{profession}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Properties */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Pricing & Physical Properties
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price (₹) {!gemData.contactForPrice && '*'}
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={gemData.price}
                                        onChange={handleInputChange}
                                        onBlur={(e) => {
                                            const value = parseFloat(e.target.value);
                                            if (!isNaN(value)) {
                                                const rounded = Math.round(value * 100) / 100;
                                                setGemData(prev => ({ ...prev, price: rounded }));
                                            }
                                        }}
                                        disabled={gemData.contactForPrice}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${gemData.contactForPrice ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        placeholder="e.g., 50000"
                                        min="0"
                                        step="1"
                                    />
                                </div>

                                {/* Size/Weight */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Size/Weight
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="number"
                                            name="sizeWeight"
                                            value={gemData.sizeWeight}
                                            onChange={handleInputChange}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="e.g., 5"
                                            min="0"
                                            step="0.01"
                                        />
                                        <select
                                            name="sizeUnit"
                                            value={gemData.sizeUnit}
                                            onChange={handleInputChange}
                                            className="px-3 py-2 border-t border-r border-b border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="carat">Carat</option>
                                            <option value="gram">Gram</option>
                                            <option value="ratti">Ratti</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Discount Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Discount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Discount
                                    </label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={gemData.discount}
                                        onChange={handleInputChange}
                                        onBlur={(e) => {
                                            const value = parseFloat(e.target.value);
                                            if (!isNaN(value)) {
                                                const rounded = Math.round(value * 100) / 100;
                                                setGemData(prev => ({ ...prev, discount: rounded }));
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., 10"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                {/* Discount Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Discount Type
                                    </label>
                                    <select
                                        name="discountType"
                                        value={gemData.discountType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Contact for Price Option */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="contactForPrice"
                                        checked={gemData.contactForPrice}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-900">
                                            Contact for Price (Premium/Expensive Gems)
                                        </span>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Enable this for expensive gems. When enabled, price will be hidden and a "Contact" button will be shown to customers. They can call 9999888800 for pricing details.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Stock and Delivery Days */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={gemData.stock}
                                        onChange={handleInputChange}
                                        onBlur={(e) => {
                                            const value = parseFloat(e.target.value);
                                            if (!isNaN(value)) {
                                                const rounded = Math.round(value);
                                                setGemData(prev => ({ ...prev, stock: rounded }));
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., 10"
                                        min="0"
                                        step="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Delivery Days
                                    </label>
                                    <input
                                        type="number"
                                        name="deliveryDays"
                                        value={gemData.deliveryDays}
                                        onChange={handleInputChange}
                                        onBlur={(e) => {
                                            const value = parseFloat(e.target.value);
                                            if (!isNaN(value)) {
                                                const rounded = Math.round(value);
                                                setGemData(prev => ({ ...prev, deliveryDays: rounded }));
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., 7"
                                        min="1"
                                        step="1"
                                    />
                                </div>
                            </div>

                            {/* Availability Checkbox */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="availability"
                                    checked={gemData.availability}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Currently Available
                                </label>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Images
                            </h2>

                            {/* Hero Image Upload */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hero Image (Main display image)
                                    </label>
                                    {gemData.heroImage && (
                                        <div className="mb-4">
                                            <img
                                                src={gemData.heroImage}
                                                alt="Hero image preview"
                                                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setGemData(prev => ({ ...prev, heroImage: '' }))}
                                                className="mt-2 text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Remove Hero Image
                                            </button>
                                        </div>
                                    )}
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'hero')}
                                            className="hidden"
                                            id="hero-image-upload"
                                            disabled={uploading}
                                        />
                                        <label
                                            htmlFor="hero-image-upload"
                                            className={`cursor-pointer flex flex-col items-center space-y-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <span className="text-sm text-gray-600">
                                                {gemData.heroImage ? 'Click to replace hero image' : 'Click to upload hero image'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 5MB
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Additional Images Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Images
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'additional')}
                                            className="hidden"
                                            id="additional-image-upload"
                                            disabled={uploading}
                                        />
                                        <label
                                            htmlFor="additional-image-upload"
                                            className={`cursor-pointer flex flex-col items-center space-y-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <span className="text-sm text-gray-600">
                                                Click to upload additional images
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 5MB each
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Additional Images Preview */}
                                {gemData.additionalImages.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                                            Additional Images ({gemData.additionalImages.length})
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {gemData.additionalImages.map((imageUrl, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Additional image ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setGemData(prev => ({
                                                            ...prev,
                                                            additionalImages: prev.additionalImages.filter((_, i) => i !== index)
                                                        }))}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Certification & Origin */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Certification & Origin
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Certification */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Certification
                                    </label>
                                    <input
                                        type="text"
                                        name="certification"
                                        value={gemData.certification}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., Govt. Lab Certified"
                                    />
                                </div>

                                {/* Origin */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Origin
                                    </label>
                                    <input
                                        type="text"
                                        name="origin"
                                        value={gemData.origin}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., Sri Lanka"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6 space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/seller-dashboard')}
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving || uploading}
                                className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium text-white transition-colors ${saving || uploading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                    }`}
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditGem;
