'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '../../lib/nextRouterAdapter';
import { FaPhone, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative z-40 bg-white border-t border-gray-200">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Contact Icons, Shipping Partners, and Secure Payments */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 mb-6 sm:mb-8">
                    {/* Contact Icons */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <a
                            href="tel:9999888800"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700 hover:bg-gray-800 flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                            aria-label="Call us"
                        >
                            <FaPhone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </a>
                        <a
                            href="https://wa.me/9999888800"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                            aria-label="WhatsApp us"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                        </a>
                    </div>

                    {/* Shipping Partners */}
                    <div className="flex-1 flex flex-col items-center lg:items-start">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Shipping Partners</h3>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-6">
                            <div className="flex items-center gap-2">
                                <img 
                                    src="/gemimages/sequel.png" 
                                    alt="SEQUEL" 
                                    className="h-6 sm:h-8 md:h-10 object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <span className="text-xs sm:text-sm font-medium text-gray-700">SEQUEL</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <img 
                                    src="/gemimages/dtdc.svg" 
                                    alt="DTDC" 
                                    className="h-6 sm:h-8 md:h-10 object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <span className="text-xs sm:text-sm font-medium text-gray-700">DTDC</span>
                            </div>
                            <img 
                                src="/gemimages/feddx.svg" 
                                alt="FedEx" 
                                className="h-6 sm:h-8 md:h-10 object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <img 
                                src="/gemimages/dhl.svg" 
                                alt="DHL" 
                                className="h-6 sm:h-8 md:h-10 object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <img 
                                src="/gemimages/ups.svg" 
                                alt="UPS" 
                                className="h-6 sm:h-8 md:h-10 object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    </div>

                    {/* Secure Payments */}
                    <div className="flex-1 flex flex-col items-center lg:items-end">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Secure Payments</h3>
                        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 sm:gap-3 md:gap-4">
                            <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-gray-100 rounded border border-gray-300">
                                <img 
                                    src="/gemimages/cod.png" 
                                    alt="Cash on Delivery" 
                                    className="h-5 sm:h-6 object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <span className="text-[10px] sm:text-xs font-medium text-gray-700">CASH ON<br />DELIVERY</span>
                            </div>
                            <img 
                                src="/gemimages/master.svg" 
                                alt="Mastercard" 
                                className="h-6 sm:h-8 md:h-10 object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <img 
                                src="/gemimages/visa.svg" 
                                alt="VISA" 
                                className="h-6 sm:h-8 md:h-10 object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <img 
                                src="/gemimages/maestro.svg" 
                                alt="Maestro" 
                                className="h-6 sm:h-8 md:h-10 object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <img 
                                src="/gemimages/gpay.svg" 
                                alt="Google Pay" 
                                className="h-6 sm:h-8 md:h-10 object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center pt-4 sm:pt-6 border-t border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600">
                        Copyright © {new Date().getFullYear()} All Rights Reserved by{' '}
                        <span className="font-semibold text-emerald-600">Aurelane</span>
                        {' '}Powered by{' '}
                        <span className="font-semibold text-gray-800">THE GEM STONE CO.</span>
                    </p>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 sm:bottom-8 right-4 sm:right-6 md:right-8 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-gray-300 rounded-lg shadow-lg hover:shadow-xl hover:border-emerald-500 transition-all duration-300 flex items-center justify-center group"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                </button>
            )}
        </footer>
    );
};

export default Footer;
