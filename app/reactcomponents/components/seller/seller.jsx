'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const SellerProfileSetup = () => {
    const navigate = useNavigate();
    const { showSuccess, showError, showWarning } = useToast();
    const [formData, setFormData] = useState({
        // Personal Information
        fullName: '',
        email: '',
        phone: '',
        alternatePhone: '',

        // Shop Information
        shopName: '',
        shopType: '',
        businessType: '',
        yearEstablished: '',

        // Address Information
        address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
        },

        // Business Documents
        gstNumber: '',
        panNumber: '',
        aadharNumber: '',

        // Bank Details
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',

        // Business Description
        businessDescription: '',
        specialization: [],
        gemTypes: [],

        // Social Media & Links
        website: '',
        instagram: '',
        facebook: '',

        // Verification
        isVerified: false,
        documentsUploaded: false
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingProfile, setIsFetchingProfile] = useState(true);
    const [activeSection, setActiveSection] = useState('personal');
    const [imagePreview, setImagePreview] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [originalData, setOriginalData] = useState(null);

    // Available options
    const shopTypes = [
        'Retail Store',
        'Wholesaler',
        'Manufacturer',
        'Online Store',
        'Exporter',
        'Importer'
    ];

    const businessTypes = [
        'Individual Proprietorship',
        'Partnership',
        'Private Limited',
        'LLP',
        'Other'
    ];

    const gemCategories = [
        'Diamonds',
        'Emeralds',
        'Rubies',
        'Sapphires',
        'Pearls',
        'Opals',
        'Topaz',
        'Amethyst',
        'Citrine',
        'Garnet',
        'Peridot',
        'Turquoise',
        'Lapis Lazuli',
        'Moonstone',
        'Aquamarine',
        'Tanzanite',
        'Tourmaline',
        'Zircon',
        'Alexandrite'
    ];

    const specializationOptions = [
        'Loose Gemstones',
        'Jewelry',
        'Rough Stones',
        'Custom Designs',
        'Antique Pieces',
        'Certified Gems',
        'Birthstones',
        'Healing Crystals'
    ];

    useEffect(() => {
        // Fetch seller profile from backend
        const fetchSellerProfile = async () => {
            setIsFetchingProfile(true);
            try {
                const response = await authAPI.getSellerProfile();

                if (response.success && response.seller) {
                    // Update formData with data from backend
                    setFormData({
                        fullName: response.seller.fullName || '',
                        email: response.seller.email || '',
                        phone: response.seller.phone || '',
                        alternatePhone: response.seller.alternatePhone || '',
                        shopName: response.seller.shopName || '',
                        shopType: response.seller.shopType || '',
                        businessType: response.seller.businessType || '',
                        yearEstablished: response.seller.yearEstablished || '',
                        address: {
                            street: response.seller.address?.street || '',
                            city: response.seller.address?.city || '',
                            state: response.seller.address?.state || '',
                            pincode: response.seller.address?.pincode || '',
                            country: response.seller.address?.country || 'India'
                        },
                        gstNumber: response.seller.gstNumber || '',
                        panNumber: response.seller.panNumber || '',
                        aadharNumber: response.seller.aadharNumber || '',
                        bankName: response.seller.bankName || '',
                        accountNumber: response.seller.accountNumber || '',
                        ifscCode: response.seller.ifscCode || '',
                        accountHolderName: response.seller.accountHolderName || '',
                        businessDescription: response.seller.businessDescription || '',
                        specialization: response.seller.specialization || [],
                        gemTypes: response.seller.gemTypes || [],
                        website: response.seller.website || '',
                        instagram: response.seller.instagram || '',
                        facebook: response.seller.facebook || '',
                        isVerified: response.seller.isVerified || false,
                        documentsUploaded: response.seller.documentsUploaded || false
                    });

                    // Also save to localStorage as backup
                    localStorage.setItem('sellerProfile', JSON.stringify(response.seller));
                }
            } catch (error) {
                console.error('Error fetching seller profile:', error);

                // Fallback to localStorage if API fails
                const savedData = localStorage.getItem('sellerProfile');
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    setFormData({
                        ...formData,
                        ...parsed,
                        address: parsed.address || formData.address
                    });
                }
            } finally {
                setIsFetchingProfile(false);
            }
        };

        fetchSellerProfile();
    }, []);

    // Handle Edit Mode
    const handleEditMode = () => {
        setOriginalData({ ...formData });
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setFormData(originalData);
        setIsEditMode(false);
        setOriginalData(null);
        setErrors({});
    };

    const handleSaveChanges = async () => {
        if (validateSection(activeSection)) {
            setIsLoading(true);
            try {
                // Call PUT API to update seller profile
                const response = await authAPI.updateProfile(formData);

                if (response.success && response.seller) {
                    // Update formData with the response from backend
                    setFormData({
                        ...formData,
                        ...response.seller,
                        // Ensure nested address object is properly merged
                        address: response.seller.address || formData.address
                    });

                    // Save updated profile to localStorage
                    localStorage.setItem('sellerProfile', JSON.stringify(response.seller));

                    setIsEditMode(false);
                    setOriginalData(null);
                    showSuccess(response.message || 'Profile updated successfully!');
                } else {
                    showError(response.message || 'Error updating profile. Please try again.');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                showError(error.message || 'Error updating profile. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else if (type === 'checkbox') {
            if (name === 'specialization' || name === 'gemTypes') {
                setFormData(prev => ({
                    ...prev,
                    [name]: checked
                        ? [...prev[name], value]
                        : prev[name].filter(item => item !== value)
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showWarning('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateSection = (section) => {
        const newErrors = {};

        switch (section) {
            case 'personal':
                if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
                if (!formData.email.trim()) newErrors.email = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
                if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
                else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
                break;

            case 'shop':
                if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
                if (!formData.shopType) newErrors.shopType = 'Shop type is required';
                if (!formData.businessType) newErrors.businessType = 'Business type is required';
                if (!formData.yearEstablished) newErrors.yearEstablished = 'Year established is required';
                break;

            case 'address':
                if (!formData.address.street.trim()) newErrors['address.street'] = 'Street address is required';
                if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
                if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
                if (!formData.address.pincode.trim()) newErrors['address.pincode'] = 'Pincode is required';
                break;

            case 'documents':
                if (!formData.gstNumber.trim()) newErrors.gstNumber = 'GST number is required';
                else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber))
                    newErrors.gstNumber = 'Invalid GST number format';
                if (!formData.panNumber.trim()) newErrors.panNumber = 'PAN number is required';
                else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber))
                    newErrors.panNumber = 'Invalid PAN number format';
                break;

            case 'bank':
                if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
                if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
                if (!formData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
                if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSectionSubmit = (section) => {
        if (validateSection(section)) {
            // Move to next section or save data
            const sections = ['personal', 'shop', 'address', 'documents', 'bank', 'business'];
            const currentIndex = sections.indexOf(section);
            if (currentIndex < sections.length - 1) {
                setActiveSection(sections[currentIndex + 1]);
            }

            // Save to localStorage
            localStorage.setItem('sellerProfile', JSON.stringify(formData));

        }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();

        if (validateSection(activeSection)) {
            setIsLoading(true);

            try {
                // Submit complete seller profile
                const response = await authAPI.updateProfile(formData);

                if (response.success && response.seller) {
                    // Update formData with the response from backend
                    setFormData({
                        ...formData,
                        ...response.seller,
                        address: response.seller.address || formData.address
                    });

                    // Save updated profile to localStorage
                    localStorage.setItem('sellerProfile', JSON.stringify(response.seller));

                    showSuccess(response.message || 'Profile submitted successfully! It will be reviewed by our team.');

                    // Redirect to dashboard or seller home
                    navigate('/dashboard');
                } else {
                    showError(response.message || 'Profile submission failed');
                }
            } catch (err) {
                console.error('Error submitting profile:', err);
                showError(err.message || 'An error occurred during profile submission');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const progress = {
        personal: 20,
        shop: 40,
        address: 60,
        documents: 80,
        bank: 100
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Loading State */}
                {isFetchingProfile && (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <svg className="animate-spin h-12 w-12 mx-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-4 text-gray-600">Loading seller profile...</p>
                        </div>
                    </div>
                )}

                {/* Main Content - Only show when not loading */}
                {!isFetchingProfile && (
                    <>
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Seller Profile</h1>
                                    <p className="mt-2 text-sm sm:text-base text-gray-600">Manage your seller profile and business information</p>
                                    {formData.isVerified && (
                                        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Verified Seller
                                        </div>
                                    )}
                                </div>

                                {/* Edit/Save/Cancel Buttons */}
                                <div className="flex space-x-3">
                                    {!isEditMode ? (
                                        <button
                                            onClick={handleEditMode}
                                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleSaveChanges}
                                                disabled={isLoading}
                                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {isLoading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                disabled={isLoading}
                                                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                                <span className="text-sm font-medium text-gray-700">{progress[activeSection]}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress[activeSection]}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {/* Navigation Tabs */}
                            <div className="border-b border-gray-200">
                                <nav className="flex overflow-x-auto">
                                    {['personal', 'shop', 'address', 'documents', 'bank', 'business'].map((section) => (
                                        <button
                                            key={section}
                                            onClick={() => setActiveSection(section)}
                                            className={`flex-1 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${activeSection === section
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            {section.charAt(0).toUpperCase() + section.slice(1)}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Form Content */}
                            <div className="p-6">
                                <form onSubmit={handleFinalSubmit}>
                                    {/* Personal Information */}
                                    {activeSection === 'personal' && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                                        Full Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="fullName"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditMode}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                                            } ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                        placeholder="Enter your full name"
                                                    />
                                                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                        Email Address *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        disabled
                                                        className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300 bg-gray-50 cursor-not-allowed"
                                                        placeholder="your@email.com"
                                                    />
                                                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                                                </div>

                                                <div>
                                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                        Phone Number *
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        id="phone"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditMode}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                            } ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                        placeholder="10-digit mobile number"
                                                    />
                                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-700">
                                                        Alternate Phone
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        id="alternatePhone"
                                                        name="alternatePhone"
                                                        value={formData.alternatePhone}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditMode}
                                                        className={`mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!isEditMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                        placeholder="Optional alternate number"
                                                    />
                                                </div>
                                            </div>

                                            {isEditMode && (
                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveSection('shop')}
                                                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                                                    >
                                                        Next: Shop Information →
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Shop Information */}
                                    {activeSection === 'shop' && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-medium text-gray-900">Shop Information</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2">
                                                    <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
                                                        Shop/Business Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="shopName"
                                                        name="shopName"
                                                        value={formData.shopName}
                                                        onChange={handleInputChange}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.shopName ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Enter your shop name"
                                                    />
                                                    {errors.shopName && <p className="mt-1 text-sm text-red-600">{errors.shopName}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="shopType" className="block text-sm font-medium text-gray-700">
                                                        Shop Type *
                                                    </label>
                                                    <select
                                                        id="shopType"
                                                        name="shopType"
                                                        value={formData.shopType}
                                                        onChange={handleInputChange}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.shopType ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                    >
                                                        <option value="">Select shop type</option>
                                                        {shopTypes.map(type => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                    </select>
                                                    {errors.shopType && <p className="mt-1 text-sm text-red-600">{errors.shopType}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                                                        Business Type *
                                                    </label>
                                                    <select
                                                        id="businessType"
                                                        name="businessType"
                                                        value={formData.businessType}
                                                        onChange={handleInputChange}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.businessType ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                    >
                                                        <option value="">Select business type</option>
                                                        {businessTypes.map(type => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                    </select>
                                                    {errors.businessType && <p className="mt-1 text-sm text-red-600">{errors.businessType}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="yearEstablished" className="block text-sm font-medium text-gray-700">
                                                        Year Established *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="yearEstablished"
                                                        name="yearEstablished"
                                                        value={formData.yearEstablished}
                                                        onChange={handleInputChange}
                                                        min="1900"
                                                        max={new Date().getFullYear()}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.yearEstablished ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="e.g., 2010"
                                                    />
                                                    {errors.yearEstablished && <p className="mt-1 text-sm text-red-600">{errors.yearEstablished}</p>}
                                                </div>
                                            </div>

                                            <div className="flex justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveSection('personal')}
                                                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSectionSubmit('shop')}
                                                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                                                >
                                                    Next: Address
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Address Information */}
                                    {activeSection === 'address' && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-medium text-gray-900">Address Information</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2">
                                                    <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                                                        Street Address *
                                                    </label>
                                                    <textarea
                                                        id="address.street"
                                                        name="address.street"
                                                        value={formData.address.street}
                                                        onChange={handleInputChange}
                                                        rows={3}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors['address.street'] ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Enter complete street address"
                                                    />
                                                    {errors['address.street'] && <p className="mt-1 text-sm text-red-600">{errors['address.street']}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                                                        City *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="address.city"
                                                        name="address.city"
                                                        value={formData.address.city}
                                                        onChange={handleInputChange}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors['address.city'] ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Enter city"
                                                    />
                                                    {errors['address.city'] && <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                                                        State *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="address.state"
                                                        name="address.state"
                                                        value={formData.address.state}
                                                        onChange={handleInputChange}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors['address.state'] ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Enter state"
                                                    />
                                                    {errors['address.state'] && <p className="mt-1 text-sm text-red-600">{errors['address.state']}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="address.pincode" className="block text-sm font-medium text-gray-700">
                                                        Pincode *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="address.pincode"
                                                        name="address.pincode"
                                                        value={formData.address.pincode}
                                                        onChange={handleInputChange}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors['address.pincode'] ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Enter pincode"
                                                    />
                                                    {errors['address.pincode'] && <p className="mt-1 text-sm text-red-600">{errors['address.pincode']}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                                                        Country
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="address.country"
                                                        name="address.country"
                                                        value={formData.address.country}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        disabled
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveSection('shop')}
                                                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSectionSubmit('address')}
                                                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                                                >
                                                    Next: Documents
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Business Documents */}
                                    {activeSection === 'documents' && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-medium text-gray-900">Business Documents</h3>
                                            <p className="text-sm text-gray-600">Please provide your business registration documents for verification</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
                                                        GST Number *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="gstNumber"
                                                        name="gstNumber"
                                                        value={formData.gstNumber}
                                                        onChange={handleInputChange}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.gstNumber ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="e.g., 07AABCU9603R1ZM"
                                                    />
                                                    {errors.gstNumber && <p className="mt-1 text-sm text-red-600">{errors.gstNumber}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700">
                                                        PAN Number *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="panNumber"
                                                        name="panNumber"
                                                        value={formData.panNumber}
                                                        onChange={handleInputChange}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.panNumber ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="e.g., ABCDE1234F"
                                                    />
                                                    {errors.panNumber && <p className="mt-1 text-sm text-red-600">{errors.panNumber}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700">
                                                        Aadhar Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="aadharNumber"
                                                        name="aadharNumber"
                                                        value={formData.aadharNumber}
                                                        onChange={handleInputChange}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="12-digit Aadhar number"
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Upload Business Documents
                                                    </label>
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                                        <input
                                                            type="file"
                                                            id="documentUpload"
                                                            onChange={handleImageUpload}
                                                            className="hidden"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                        />
                                                        <label htmlFor="documentUpload" className="cursor-pointer">
                                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            <div className="mt-2">
                                                                <span className="text-sm font-medium text-indigo-600">Upload documents</span>
                                                                <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                                                            </div>
                                                        </label>
                                                    </div>
                                                    {imagePreview && (
                                                        <div className="mt-2">
                                                            <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveSection('address')}
                                                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSectionSubmit('documents')}
                                                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                                                >
                                                    Next: Bank Details
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bank Details */}
                                    {activeSection === 'bank' && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-medium text-gray-900">Bank Account Details</h3>
                                            <p className="text-sm text-gray-600">For payment settlements and transactions</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                                                        Bank Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="bankName"
                                                        name="bankName"
                                                        value={formData.bankName}
                                                        onChange={handleInputChange}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.bankName ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Enter bank name"
                                                    />
                                                    {errors.bankName && <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                                                        Account Number *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="accountNumber"
                                                        name="accountNumber"
                                                        value={formData.accountNumber}
                                                        onChange={handleInputChange}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Enter account number"
                                                    />
                                                    {errors.accountNumber && <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
                                                        IFSC Code *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="ifscCode"
                                                        name="ifscCode"
                                                        value={formData.ifscCode}
                                                        onChange={handleInputChange}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.ifscCode ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="e.g., SBIN0000123"
                                                    />
                                                    {errors.ifscCode && <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p>}
                                                </div>

                                                <div>
                                                    <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
                                                        Account Holder Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="accountHolderName"
                                                        name="accountHolderName"
                                                        value={formData.accountHolderName}
                                                        onChange={handleInputChange}
                                                        className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Name as in bank account"
                                                    />
                                                    {errors.accountHolderName && <p className="mt-1 text-sm text-red-600">{errors.accountHolderName}</p>}
                                                </div>
                                            </div>

                                            <div className="flex justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveSection('documents')}
                                                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSectionSubmit('bank')}
                                                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                                                >
                                                    Next: Business Details
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Business Details */}
                                    {activeSection === 'business' && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-medium text-gray-900">Business Details</h3>

                                            <div className="space-y-6">
                                                <div>
                                                    <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700">
                                                        Business Description
                                                    </label>
                                                    <textarea
                                                        id="businessDescription"
                                                        name="businessDescription"
                                                        value={formData.businessDescription}
                                                        onChange={handleInputChange}
                                                        rows={4}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="Tell us about your business, expertise, and experience in the gem industry..."
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        Specialization *
                                                    </label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {specializationOptions.map((option) => (
                                                            <label key={option} className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    name="specialization"
                                                                    value={option}
                                                                    checked={formData.specialization.includes(option)}
                                                                    onChange={handleInputChange}
                                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                                />
                                                                <span className="ml-2 text-sm text-gray-700">{option}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        Gem Types You Deal With *
                                                    </label>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                        {gemCategories.map((gem) => (
                                                            <label key={gem} className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    name="gemTypes"
                                                                    value={gem}
                                                                    checked={formData.gemTypes.includes(gem)}
                                                                    onChange={handleInputChange}
                                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                                />
                                                                <span className="ml-2 text-sm text-gray-700">{gem}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                                                            Website
                                                        </label>
                                                        <input
                                                            type="url"
                                                            id="website"
                                                            name="website"
                                                            value={formData.website}
                                                            onChange={handleInputChange}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            placeholder="https://yourwebsite.com"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                                                            Instagram
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="instagram"
                                                            name="instagram"
                                                            value={formData.instagram}
                                                            onChange={handleInputChange}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            placeholder="@username"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveSection('bank')}
                                                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                                                >
                                                    {isLoading ? 'Submitting...' : 'Complete Profile'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Help Text */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Need help? Contact our support team at{' '}
                                <a href="mailto:support@gemseller.com" className="text-indigo-600 hover:text-indigo-500">
                                    support@gemseller.com
                                </a>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SellerProfileSetup;