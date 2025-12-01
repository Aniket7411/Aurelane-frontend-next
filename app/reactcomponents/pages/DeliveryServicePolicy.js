'use client';

import React from 'react';

const DeliveryServicePolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Compact Header */}
            <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Delivery / Service Policy</h1>
                            <p className="text-sm sm:text-base text-emerald-100 mt-1">Aurelane</p>
                        </div>
                        <p className="text-xs sm:text-sm text-emerald-100">
                            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content - Full Width Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-3">1. Shipping Timelines</h2>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                            Aurelane ships gemstones within:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                            <li>India: 3–7 business days</li>
                            <li>International: 7–15 business days</li>
                        </ul>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-3">2. Packaging</h2>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                            All gemstones are shipped with:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                            <li>Secure, tamperproof packaging</li>
                            <li>Bubble-wrap protection</li>
                            <li>Certificate of authenticity (if applicable)</li>
                        </ul>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">3. Shipping Fees</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Shipping fees vary depending on location and package weight. Free shipping may be offered for select orders.
                        </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">4. Tracking</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Customers receive tracking details via email/SMS once dispatched.
                        </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">5. Shipping Delays</h2>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                            Aurelane is not responsible for delays caused by:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                            <li>Weather conditions</li>
                            <li>Customs procedures</li>
                            <li>Courier partner issues</li>
                        </ul>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">6. Service Delivery</h2>
                        <p className="text-xs text-gray-600 mb-2 italic">(For Astrological/Consultation Services)</p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                            <li>Consultation fees are non-refundable</li>
                            <li>Digital reports are delivered on schedule</li>
                            <li>Aurelane does not guarantee outcomes of astrological recommendations</li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default DeliveryServicePolicy;

