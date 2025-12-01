'use client';

import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Compact Header */}
            <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Terms & Conditions</h1>
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
                <div className="mb-6">
                    <p className="text-base text-gray-700 leading-relaxed">
                        Welcome to Aurelane. By accessing or using our website, services, or purchasing our gemstones, you agree to the following Terms & Conditions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">1. Product Information</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Aurelane deals in natural gemstones, crystals, and certified premium stones. Product images shown on our platform are for representation only. Natural variations in color, clarity, size, and texture may occur.
                        </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">2. Certifications</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Where applicable, gemstones from Aurelane come with third-party lab certifications. Additional certification requests may incur extra charges.
                        </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">3. Pricing</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            All listed prices on Aurelane are subject to change without notice. Prices displayed at checkout are final and binding.
                        </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">4. Payments</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Aurelane accepts payments via secure, trusted payment gateways. Orders are processed only upon successful payment confirmation.
                        </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">5. Order Acceptance</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Placing an order does not guarantee acceptance. Aurelane reserves the right to cancel or refuse orders due to stock unavailability, pricing errors, or suspected fraudulent activity.
                        </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">6. Restrictions</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Users must not attempt unauthorized access to the Aurelane website or engage in activities that may disrupt the platform.
                        </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">7. Liability</h2>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                            Aurelane is not responsible for:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                            <li>Reactions caused by wearing gemstones</li>
                            <li>Astrological interpretations or results</li>
                            <li>Minor natural variations in gemstone appearance</li>
                        </ul>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">8. Governing Law</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            These terms are governed by the laws of India.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default TermsAndConditions;

