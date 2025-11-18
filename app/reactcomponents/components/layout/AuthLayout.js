'use client';

import React from 'react';
import Header from './Header';
import { Link } from '../../lib/nextRouterAdapter';
import { FaHeart, FaEnvelope } from 'react-icons/fa';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
                <Header />
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-20 pb-32">
                {children}
            </main>

            {/* Premium Footer */}
            <footer className="relative z-40 bg-white backdrop-blur-xl border-t border-gray-100 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                        {/* Brand Section */}
                        <div className="col-span-1">
                            <Link to="/" className="flex items-center space-x-3 mb-4 group">
                                <img src="/images/aurelane.png" alt="Aurelane Logo" className="h-28 w-28 object-contain" />

                                {/* <div>
                                    <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                        Aurelane
                                    </h3>
                                    <p className="text-xs text-gray-500">Premium Gemstones</p>
                                </div> */}
                            </Link>
                            <p className="text-sm text-gray-600 mb-4">
                                Your trusted platform for authentic gemstones and jewelry management.
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <FaHeart className="text-red-500" />
                                <span>Made with love for gemstone enthusiasts</span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                Quick Links
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        to="/"
                                        className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center space-x-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        <span>Home</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/shop"
                                        className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center space-x-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        <span>Shop</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/gemstones"
                                        className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center space-x-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        <span>Gallery</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/aboutus"
                                        className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center space-x-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        <span>About Us</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support & Contact */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                Support
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        to="/login"
                                        className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center space-x-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        <span>Login</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/register"
                                        className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center space-x-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        <span>Register</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/seller"
                                        className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center space-x-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        <span>Become a Seller</span>
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="mailto:support@aurelane.com"
                                        className="text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center space-x-2 group"
                                    >
                                        <FaEnvelope className="w-3 h-3" />
                                        <span>Contact Us</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p className="text-sm text-gray-600">
                                © {new Date().getFullYear()} <span className="font-semibold text-emerald-600">Aurelane</span>. All rights reserved.
                            </p>
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AuthLayout;

