'use client';

import React from 'react';

const CancellationRefundPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Compact Header */}
            <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Cancellation & Refund Policy</h1>
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
                        Please review our policy before making a purchase from Aurelane.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-3">1. Order Cancellation</h2>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 ml-2">
                            <li>Orders can be canceled within 24 hours, only if not yet shipped.</li>
                            <li>Custom gemstone orders cannot be canceled.</li>
                        </ul>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-3">2. Refund Policy</h2>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2 font-semibold">
                            Refunds are accepted only when:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2 mb-3">
                            <li>A wrong item is delivered</li>
                            <li>Item arrives damaged</li>
                            <li>Missing items in delivery</li>
                        </ul>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2 font-semibold">
                            Refunds are not available for:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                            <li>Change of mind</li>
                            <li>Minor variations in gemstone appearance</li>
                            <li>Customized gemstones</li>
                            <li>Astrological advice/services</li>
                        </ul>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-3">3. Refund Process</h2>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 ml-2">
                            <li>Raise the issue within 48 hours of delivery</li>
                            <li>Provide image/video proof</li>
                            <li>Refunds are processed within 7–10 business days post-inspection</li>
                        </ul>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-3">4. Non-Refundable Items</h2>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 ml-2">
                            <li>Customized stones</li>
                            <li>Engraved gemstones</li>
                            <li>Astrological consultations</li>
                            <li>Items without original packaging or certification</li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default CancellationRefundPolicy;

