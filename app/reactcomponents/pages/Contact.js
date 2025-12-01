'use client';

import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock } from 'react-icons/fa';

const Contact = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Compact Header */}
            <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Contact Us</h1>
                    <p className="text-sm sm:text-base text-emerald-100 mt-1">Get in Touch with Aurelane</p>
                </div>
            </header>

            {/* Main Content - Full Width Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Phone */}
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-all hover:border-emerald-300">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <FaPhone className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-emerald-700">Phone</h3>
                        </div>
                        <a 
                            href="tel:9999888800" 
                            className="text-base text-gray-700 hover:text-emerald-600 transition-colors block"
                        >
                            +91 9374 455 555
                        </a>
                    </div>

                    {/* Email */}
                    {/* <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-all hover:border-emerald-300">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <FaEnvelope className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-emerald-700">Email</h3>
                        </div>
                        <a 
                            href="mailto:support@aurelane.com" 
                            className="text-base text-gray-700 hover:text-emerald-600 transition-colors break-all block"
                        >
                            support@aurelane.com
                        </a>
                    </div> */}

                    {/* WhatsApp */}
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-all hover:border-emerald-300">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <FaWhatsapp className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-emerald-700">WhatsApp</h3>
                        </div>
                        <a 
                            href="https://wa.me/9999888800" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base text-gray-700 hover:text-emerald-600 transition-colors block"
                        >
                            +91 9374 455 555
                        </a>
                    </div>

                    {/* Address */}
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-all hover:border-emerald-300">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <FaMapMarkerAlt className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-emerald-700">Address</h3>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                        70/38, Patel Marg, Mansarovar, Jaipur<br />
                        Jaipur, Rajasthan<br />
                        India
                        </p>
                    </div>
                </div>

                {/* Business Hours - Full Width */}
                <div className="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                        <FaClock className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-xl font-bold text-emerald-700">Business Hours</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-300 sm:border-b-0 sm:border-r sm:pr-4">
                            <span className="text-sm font-semibold text-gray-700">Monday - Friday</span>
                            <span className="text-sm text-gray-600">9:00 AM - 6:00 PM IST</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-300 sm:border-b-0 sm:border-r sm:pr-4">
                            <span className="text-sm font-semibold text-gray-700">Saturday</span>
                            <span className="text-sm text-gray-600">10:00 AM - 4:00 PM IST</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-700">Sunday</span>
                            <span className="text-sm text-gray-600">Closed</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4 italic">
                        We're here to help! Feel free to reach out through any of the contact methods above.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Contact;

