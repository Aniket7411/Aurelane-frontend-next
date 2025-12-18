'use client';

import React, { useMemo, useState } from 'react';
import { gemAPI } from '../services/api';
import { gemstonesData } from '../data/gemstonesData';
import { getCategoryOptions, getSubcategoryOptions } from '../data/gemCategoryHierarchy';
import uploadFileToCloudinary from './uploadfunctionnew';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { getGSTCategories } from '../utils/gstUtils';

const AddGem = () => {
    const { showSuccess, showError } = useToast();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: '',
        subcategory: '',
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
        birthMonth: '',
        gstCategory: '',
        isCustomStone: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');


    console.log("formDataformData", formData)


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

    const categoryOptions = useMemo(() => getCategoryOptions(), []);
    const subcategoryOptions = useMemo(
        () => getSubcategoryOptions(formData.category),
        [formData.category]
    );
    const gemNameSuggestions = useMemo(
        () => [...new Set(gemstonesData.map(g => g.name).filter(Boolean))],
        []
    );
    const gstCategories = useMemo(() => getGSTCategories(), []);

    // Helpers to make auto-fill robust for variations like "Blue Sapphire (Neelam)"
    const normalizeString = (str) => (str || '').toString().trim().toLowerCase();
    const baseName = (str) => {
        const s = (str || '').toString();
        // Remove anything in parentheses and trim
        return s.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    };

    // Function to get gem data by a flexible name/category match
    const getGemData = (selected) => {
        const n = normalizeString(selected);
        const b = normalizeString(baseName(selected));

        // 1) Exact, case-insensitive match
        let match = gemstonesData.find(g => normalizeString(g.name) === n);
        if (match) return match;

        // 2) Exact match on baseName (without parentheses)
        match = gemstonesData.find(g => normalizeString(baseName(g.name)) === b);
        if (match) return match;

        // 3) StartsWith/Includes on normalized strings (helps for close labels)
        match = gemstonesData.find(g => {
            const gn = normalizeString(g.name);
            return gn.startsWith(b) || gn.includes(b);
        });
        if (match) return match;

        // 4) Try Hindi name includes (edge cases)
        match = gemstonesData.find(g => normalizeString(g.hindiName).includes(b));
        if (match) return match;

        return null;
    };

    // Function to auto-populate data based on selection
    const autoPopulateData = (selectedValue, fieldType) => {
        if (fieldType === 'name') {
            const gemData = getGemData(selectedValue);
            if (gemData) {
                setFormData(prev => ({
                    ...prev,
                    hindiName: gemData.hindiName || '',
                    planet: gemData.planet || '',
                    planetHindi: gemData.planetHindi || '',
                    color: gemData.color || '',
                    description: gemData.description || '',
                    benefits: gemData.benefits || [],
                    suitableFor: gemData.suitableFor || []
                }));
            }
        }
    };

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


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (name === 'suitableFor' || name === 'benefits') {
                setFormData(prev => ({
                    ...prev,
                    [name]: checked
                        ? [...prev[name], value]
                        : prev[name].filter(item => item !== value)
                }));
            } else {
                setFormData(prev => ({
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

            setFormData(prev => ({
                ...prev,
                [name]: processedValue
            }));
        } else {
            setFormData(prev => {
                const updated = {
                    ...prev,
                    [name]: value
                };

                if (name === 'category') {
                    updated.subcategory = '';
                }

                return updated;
            });

            // Auto-populate data when name changes
            if (name === 'name') {
                autoPopulateData(value, name);
            }

            // Auto-populate Hindi planet when English planet is selected
            if (name === 'planet') {
                const selectedPlanet = planets.find(p => p.english === value);
                if (selectedPlanet) {
                    setFormData(prev => ({
                        ...prev,
                        planetHindi: selectedPlanet.hindi
                    }));
                }
            }

            // Handle custom stone checkbox - clear planet when enabled
            if (name === 'isCustomStone' && checked) {
                setFormData(prev => ({
                    ...prev,
                    planet: '',
                    planetHindi: ''
                }));
            }
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };


    // Handle image upload using Cloudinary
    const handleImageUpload = async (e, imageType = 'additional') => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        setIsSubmitting(true);

        try {
            for (const file of files) {
                // Create a temporary event object for the upload function
                const tempEvent = { target: { files: [file] } };
                const imageUrl = await uploadFileToCloudinary(tempEvent);

                if (imageUrl) {
                    if (imageType === 'hero') {
                        setFormData(prev => ({
                            ...prev,
                            heroImage: imageUrl
                        }));
                    } else {
                        setFormData(prev => ({
                            ...prev,
                            additionalImages: [...prev.additionalImages, imageUrl]
                        }));
                    }
                } else {
                    throw new Error('Failed to upload image');
                }
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                imageUpload: error.message || 'Failed to upload images. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }

        // Clear the input
        e.target.value = '';
    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.subcategory.trim()) newErrors.subcategory = 'Subcategory is required';
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.hindiName.trim()) newErrors.hindiName = 'Hindi name is required';
        // Planet is required only if NOT a custom stone
        if (!formData.isCustomStone && !formData.planet.trim()) {
            newErrors.planet = 'Planet is required (or select Custom Stone option)';
        }
        // Birth month is required for custom stones
        if (formData.isCustomStone && !formData.birthMonth.trim()) {
            newErrors.birthMonth = 'Birth month is required for custom stones';
        }
        if (!formData.color.trim()) newErrors.color = 'Color is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.benefits.length === 0) newErrors.benefits = 'At least one benefit is required';
        if (formData.suitableFor.length === 0) newErrors.suitableFor = 'At least one suitable profession is required';
        // Price required only when contactForPrice is false
        if (!formData.contactForPrice && (!formData.price || formData.price <= 0)) {
            newErrors.price = 'Valid price is required';
        }
        if (!formData.sizeWeight || formData.sizeWeight <= 0) newErrors.sizeWeight = 'Valid size/weight is required';
        if (!formData.certification.trim()) newErrors.certification = 'Certification is required';
        if (!formData.origin.trim()) newErrors.origin = 'Origin is required';
        if (!formData.deliveryDays || formData.deliveryDays <= 0) newErrors.deliveryDays = 'Valid delivery days is required';
        if (!formData.heroImage.trim()) newErrors.heroImage = 'Hero image is required';
        if (!formData.gstCategory.trim()) newErrors.gstCategory = 'GST Category is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSuccessMessage('');

        try {
            const gemData = {
                category: formData.category,
                subcategory: formData.subcategory,
                name: formData.name,
                hindiName: formData.hindiName,
                planet: formData.isCustomStone ? null : (formData.planet || null),
                planetHindi: formData.isCustomStone ? null : (formData.planetHindi || null),
                color: formData.color,
                birthMonth: formData.birthMonth || null,
                description: formData.description,
                benefits: formData.benefits,
                suitableFor: formData.suitableFor,
                price: formData.contactForPrice ? null : parseFloat(formData.price),
                discount: parseFloat(formData.discount) || 0,
                discountType: formData.discountType,
                sizeWeight: parseFloat(formData.sizeWeight),
                sizeUnit: formData.sizeUnit,
                stock: formData.stock ? parseInt(formData.stock) : null,
                availability: formData.availability,
                certification: formData.certification,
                origin: formData.origin,
                deliveryDays: parseInt(formData.deliveryDays),
                heroImage: formData.heroImage,
                additionalImages: formData.additionalImages,
                contactForPrice: formData.contactForPrice,
                gstCategory: formData.gstCategory,
                isCustomStone: formData.isCustomStone
            };

            const response = await gemAPI.addGem(gemData);

            if (response.success) {
                showSuccess('✨ Gem added successfully! Your gem is now live on the marketplace.');
                // Reset form
                setFormData({
                    category: '',
                    subcategory: '',
                    name: '',
                    hindiName: '',
                    planet: '',
                    planetHindi: '',
                    contactForPrice: false,
                    birthMonth: '',
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
                    gstCategory: '',
                    isCustomStone: false
                });
                setErrors({});
                // Optionally navigate to seller dashboard after a short delay
                setTimeout(() => {
                    navigate('/seller-dashboard');
                }, 2000);
            } else {
                // Check if response contains field-specific errors
                if (response.errors) {
                    const fieldErrorMap = {
                        'name': 'name',
                        'category': 'category',
                        'subcategory': 'subcategory',
                        'hindiName': 'hindiName',
                        'planet': 'planet',
                        'planetHindi': 'planetHindi',
                        'color': 'color',
                        'description': 'description',
                        'benefits': 'benefits',
                        'suitableFor': 'suitableFor',
                        'price': 'price',
                        'sizeWeight': 'sizeWeight',
                        'sizeUnit': 'sizeUnit',
                        'stock': 'stock',
                        'certification': 'certification',
                        'origin': 'origin',
                        'deliveryDays': 'deliveryDays',
                        'heroImage': 'heroImage',
                        'additionalImages': 'additionalImages',
                        'birthMonth': 'birthMonth',
                        'gstCategory': 'gstCategory'
                    };

                    const newErrors = {};

                    // Handle array format (express-validator style): [{path: "fieldName", msg: "error message"}]
                    if (Array.isArray(response.errors)) {
                        response.errors.forEach(err => {
                            if (err.path && err.msg) {
                                const frontendField = fieldErrorMap[err.path] || err.path;
                                newErrors[frontendField] = err.msg;
                            }
                        });
                    }
                    // Handle object format: {fieldName: {message: "error message"}} or {fieldName: "error message"}
                    else if (typeof response.errors === 'object') {
                        Object.keys(response.errors).forEach(backendField => {
                            const frontendField = fieldErrorMap[backendField] || backendField;
                            const errorMessage = response.errors[backendField]?.message || response.errors[backendField];
                            if (errorMessage) {
                                newErrors[frontendField] = errorMessage;
                            }
                        });
                    }

                    if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors);
                        showError('Please fix the errors in the form below.');
                    } else {
                        showError(response.message || 'Failed to add gem. Please try again.');
                        setErrors({ submit: response.message || 'Failed to add gem. Please try again.' });
                    }
                } else {
                    showError(response.message || 'Failed to add gem. Please try again.');
                    setErrors({ submit: response.message || 'Failed to add gem. Please try again.' });
                }
            }
        } catch (error) {
            console.error('Error adding gem:', error);

            // Check if it's a validation error with field-specific errors
            if (error.isValidationError && error.fieldErrors) {
                // Map backend field errors to frontend field names
                const fieldErrorMap = {
                    'name': 'name',
                    'category': 'category',
                    'subcategory': 'subcategory',
                    'hindiName': 'hindiName',
                    'planet': 'planet',
                    'planetHindi': 'planetHindi',
                    'color': 'color',
                    'description': 'description',
                    'benefits': 'benefits',
                    'suitableFor': 'suitableFor',
                    'price': 'price',
                    'sizeWeight': 'sizeWeight',
                    'sizeUnit': 'sizeUnit',
                    'stock': 'stock',
                    'certification': 'certification',
                    'origin': 'origin',
                        'deliveryDays': 'deliveryDays',
                        'heroImage': 'heroImage',
                        'additionalImages': 'additionalImages',
                        'birthMonth': 'birthMonth',
                        'gstCategory': 'gstCategory'
                    };

                const newErrors = {};
                let hasFieldErrors = false;

                // Map backend field errors to frontend errors
                Object.keys(error.fieldErrors).forEach(backendField => {
                    const frontendField = fieldErrorMap[backendField] || backendField;
                    const errorMessage = error.fieldErrors[backendField]?.message || error.fieldErrors[backendField];
                    if (errorMessage) {
                        newErrors[frontendField] = errorMessage;
                        hasFieldErrors = true;
                    }
                });

                // Set field-specific errors
                if (hasFieldErrors) {
                    setErrors(newErrors);
                    showError('Please fix the errors in the form below.');
                } else {
                    // Fallback to general error
                    const errorMessage = error.message || 'Failed to add gem. Please check all required fields.';
                    showError(errorMessage);
                    setErrors({ submit: errorMessage });
                }
            } else {
                // Regular error
                const errorMessage = error.message || 'Failed to add gem. Please try again.';
                showError(errorMessage);
                setErrors({ submit: errorMessage });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-4 sm:px-6 py-4 sm:py-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
                            Add New Gem
                        </h1>
                        <p className="text-emerald-100 text-center mt-2 text-sm sm:text-base">
                            Fill in the details to add a new gem to the collection
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                        {/* Success Message */}
                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                {successMessage}
                            </div>
                        )}

                        {/* Error Message */}
                        {errors.submit && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {errors.submit}
                            </div>
                        )}

                        {/* Basic Information */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Basic Information
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">


                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        list="add-gem-category-options"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.category ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Ruby"
                                    />
                                    <datalist id="add-gem-category-options">
                                        {categoryOptions.map(option => (
                                            <option key={option} value={option} />
                                        ))}
                                    </datalist>
                                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                                </div>

                                {/* Subcategory */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subcategory *
                                    </label>
                                    <input
                                        type="text"
                                        name="subcategory"
                                        value={formData.subcategory}
                                        onChange={handleInputChange}
                                        list="add-gem-subcategory-options"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.subcategory ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder={formData.category ? `e.g., Premium ${formData.category}` : 'e.g., Burma Ruby'}
                                    />
                                    <datalist id="add-gem-subcategory-options">
                                        {subcategoryOptions.map(option => (
                                            <option key={option} value={option} />
                                        ))}
                                    </datalist>
                                    {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gem Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        list="add-gem-name-suggestions"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Burma Pigeon Blood Natural Ruby - 1.03 Carat"
                                    />
                                    <datalist id="add-gem-name-suggestions">
                                        {gemNameSuggestions.map(option => (
                                            <option key={option} value={option} />
                                        ))}
                                    </datalist>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Use a descriptive name after selecting category & subcategory.
                                    </p>
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                {/* Hindi Name - Auto-populated */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hindi Name (Auto-filled) *
                                    </label>
                                    <input
                                        type="text"
                                        name="hindiName"
                                        value={formData.hindiName}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.hindiName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Will auto-fill based on selection, or type manually"
                                    />
                                    {errors.hindiName && <p className="text-red-500 text-sm mt-1">{errors.hindiName}</p>}
                                </div>

                                {/* Custom Stone Option */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isCustomStone"
                                            checked={formData.isCustomStone}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                        />
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">
                                                Custom Stone (No Planet) - Based on Birth Month
                                            </span>
                                            <p className="text-xs text-gray-600 mt-1">
                                                Enable this for custom stones that are not associated with any planet but are linked to a birth month.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* Planet */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Planet {!formData.isCustomStone && '*'}
                                    </label>
                                    <select
                                        name="planet"
                                        value={formData.planet}
                                        onChange={handleInputChange}
                                        disabled={formData.isCustomStone}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.planet ? 'border-red-500' : 'border-gray-300'
                                            } ${formData.isCustomStone ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    >
                                        <option value="">Select Planet</option>
                                        {planets.map(planet => (
                                            <option key={planet.english} value={planet.english}>{planet.english}</option>
                                        ))}
                                    </select>
                                    {formData.isCustomStone && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Planet is not required for custom stones
                                        </p>
                                    )}
                                    {errors.planet && <p className="text-red-500 text-sm mt-1">{errors.planet}</p>}
                                </div>

                                {/* Planet Hindi - Auto-populated */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Planet (Hindi - Auto-filled)
                                    </label>
                                    <input
                                        type="text"
                                        name="planetHindi"
                                        value={formData.planetHindi}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                                        placeholder="Will auto-fill based on planet selection"
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
                                        value={formData.color}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.color ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Green"
                                    />
                                    {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
                                </div>

                                {/* Birth Month */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Birth Month {formData.isCustomStone && '*'}
                                    </label>
                                    <select
                                        name="birthMonth"
                                        value={formData.birthMonth}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.birthMonth ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">{formData.isCustomStone ? 'Select Birth Month *' : 'Not linked to any birth month'}</option>
                                        {birthMonths.map(month => (
                                            <option key={month} value={month}>{month}</option>
                                        ))}
                                    </select>
                                    {formData.isCustomStone && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Required for custom stones
                                        </p>
                                    )}
                                    {errors.birthMonth && <p className="text-red-500 text-sm mt-1">{errors.birthMonth}</p>}
                                </div>

                                {/* GST Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        GST Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="gstCategory"
                                        value={formData.gstCategory}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.gstCategory ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    >
                                        <option value="">Select GST Category</option>
                                        {gstCategories.map(category => (
                                            <option key={category.value} value={category.value}>
                                                {category.label} ({category.rate}% GST)
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Most gemstones use "Cut & Polished Loose Gemstones (2% GST)"
                                    </p>
                                    {formData.gstCategory && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            {gstCategories.find(c => c.value === formData.gstCategory)?.description}
                                        </p>
                                    )}
                                    {errors.gstCategory && <p className="text-red-500 text-sm mt-1">{errors.gstCategory}</p>}
                                </div>







                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Describe the gem's characteristics, quality, and unique features..."
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
                                    Benefits *
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {commonBenefits.map(benefit => (
                                        <label key={benefit} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="benefits"
                                                value={benefit}
                                                checked={formData.benefits.includes(benefit)}
                                                onChange={handleInputChange}
                                                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-gray-700">{benefit}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.benefits && <p className="text-red-500 text-sm mt-1">{errors.benefits}</p>}
                            </div>

                            {/* Suitable For */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Suitable For (Professions) *
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {suitableProfessions.map(profession => (
                                        <label key={profession} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="suitableFor"
                                                value={profession}
                                                checked={formData.suitableFor.includes(profession)}
                                                onChange={handleInputChange}
                                                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-gray-700">{profession}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.suitableFor && <p className="text-red-500 text-sm mt-1">{errors.suitableFor}</p>}
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
                                        Price (₹) {!formData.contactForPrice && '*'}
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        onBlur={(e) => {
                                            // Round to 2 decimal places on blur
                                            const value = parseFloat(e.target.value);
                                            if (!isNaN(value)) {
                                                const rounded = Math.round(value * 100) / 100;
                                                setFormData(prev => ({ ...prev, price: rounded }));
                                            }
                                        }}
                                        disabled={formData.contactForPrice}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.price ? 'border-red-500' : 'border-gray-300'
                                            } ${formData.contactForPrice ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        placeholder="e.g., 50000"
                                        min="0"
                                        step="1"
                                    />
                                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                </div>

                                {/* Size/Weight */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Size/Weight *
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="number"
                                            name="sizeWeight"
                                            value={formData.sizeWeight}
                                            onChange={handleInputChange}
                                            className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.sizeWeight ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="e.g., 5"
                                            min="0"
                                            step="0.01"
                                        />
                                        <select
                                            name="sizeUnit"
                                            value={formData.sizeUnit}
                                            onChange={handleInputChange}
                                            className="px-3 py-2 border-t border-r border-b border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="carat">Carat</option>
                                            <option value="rati">Rati</option>
                                            <option value="gram">Gram</option>
                                            <option value="ounce">Ounce</option>
                                        </select>
                                    </div>
                                    {errors.sizeWeight && <p className="text-red-500 text-sm mt-1">{errors.sizeWeight}</p>}
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
                                        value={formData.discount}
                                        onChange={handleInputChange}
                                        onBlur={(e) => {
                                            // Round to 2 decimal places on blur
                                            const value = parseFloat(e.target.value);
                                            if (!isNaN(value)) {
                                                const rounded = Math.round(value * 100) / 100;
                                                setFormData(prev => ({ ...prev, discount: rounded }));
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="e.g., 10"
                                        min="0"
                                        step="0.01"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        {formData.discountType === 'percentage'
                                            ? 'Enter discount percentage (e.g., 10 for 10%)'
                                            : 'Enter discount amount in ₹ (e.g., 1000)'}
                                    </p>
                                </div>

                                {/* Discount Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Discount Type
                                    </label>
                                    <select
                                        name="discountType"
                                        value={formData.discountType}
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
                                        checked={formData.contactForPrice}
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
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        onBlur={(e) => {
                                            // Round to nearest integer on blur
                                            const value = parseFloat(e.target.value);
                                            if (!isNaN(value)) {
                                                const rounded = Math.round(value);
                                                setFormData(prev => ({ ...prev, stock: rounded }));
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
                                        Delivery Days *
                                    </label>
                                    <input
                                        type="number"
                                        name="deliveryDays"
                                        value={formData.deliveryDays}
                                        onChange={handleInputChange}
                                        onBlur={(e) => {
                                            // Round to nearest integer on blur
                                            const value = parseFloat(e.target.value);
                                            if (!isNaN(value)) {
                                                const rounded = Math.round(value);
                                                setFormData(prev => ({ ...prev, deliveryDays: rounded }));
                                            }
                                        }}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.deliveryDays ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., 7"
                                        min="1"
                                        step="1"
                                    />
                                    {errors.deliveryDays && <p className="text-red-500 text-sm mt-1">{errors.deliveryDays}</p>}
                                </div>
                            </div>

                            {/* Availability Checkbox */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="availability"
                                    checked={formData.availability}
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
                                        Hero Image * (Main display image)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'hero')}
                                            className="hidden"
                                            id="hero-image-upload"
                                            disabled={isSubmitting}
                                        />
                                        <label
                                            htmlFor="hero-image-upload"
                                            className={`cursor-pointer flex flex-col items-center space-y-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <span className="text-sm text-gray-600">
                                                Click to upload hero image
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 5MB
                                            </span>
                                        </label>
                                    </div>
                                    {formData.heroImage && (
                                        <div className="mt-4">
                                            <img
                                                src={formData.heroImage}
                                                alt="Hero image preview"
                                                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, heroImage: '' }))}
                                                className="mt-2 text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Remove Hero Image
                                            </button>
                                        </div>
                                    )}
                                    {errors.heroImage && (
                                        <p className="text-red-500 text-sm mt-1">{errors.heroImage}</p>
                                    )}
                                </div>

                                {/* Additional Images Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Images (Optional)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'additional')}
                                            className="hidden"
                                            id="additional-image-upload"
                                            disabled={isSubmitting}
                                        />
                                        <label
                                            htmlFor="additional-image-upload"
                                            className={`cursor-pointer flex flex-col items-center space-y-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                    {errors.imageUpload && (
                                        <p className="text-red-500 text-sm mt-1">{errors.imageUpload}</p>
                                    )}
                                </div>

                                {/* Additional Images Preview */}
                                {formData.additionalImages.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                                            Additional Images ({formData.additionalImages.length})
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {formData.additionalImages.map((imageUrl, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Additional image ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({
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

                            {/* Images Summary */}
                            {(formData.heroImage || formData.additionalImages.length > 0) && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                    <p className="text-sm text-emerald-800">
                                        Total Images: {(formData.heroImage ? 1 : 0) + formData.additionalImages.length}
                                        {formData.heroImage && ' (1 hero image)'}
                                        {formData.additionalImages.length > 0 && ` (${formData.additionalImages.length} additional images)`}
                                    </p>
                                </div>
                            )}
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
                                        Certification *
                                    </label>
                                    <input
                                        type="text"
                                        name="certification"
                                        value={formData.certification}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.certification ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Govt. Lab Certified"
                                    />
                                    {errors.certification && <p className="text-red-500 text-sm mt-1">{errors.certification}</p>}
                                </div>

                                {/* Origin */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Origin *
                                    </label>
                                    <input
                                        type="text"
                                        name="origin"
                                        value={formData.origin}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.origin ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Sri Lanka"
                                    />
                                    {errors.origin && <p className="text-red-500 text-sm mt-1">{errors.origin}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                    }`}
                            >
                                {isSubmitting ? 'Adding Gem...' : 'Add Gem'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddGem;
