'use client';

import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Compact Header */}
            <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Privacy Policy</h1>
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
                        At Aurelane, we respect your privacy and are committed to protecting your personal information.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-3">1. Information We Collect</h2>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 ml-2">
                            <li>Name, phone number, email address</li>
                            <li>Shipping/billing addresses</li>
                            <li>Payment details (processed through secure gateways)</li>
                            <li>Website usage data (cookies, analytics)</li>
                        </ul>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-3">2. How We Use This Information</h2>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 ml-2">
                            <li>To process and deliver orders</li>
                            <li>To improve customer experience</li>
                            <li>To send order updates, offers, and newsletters</li>
                            <li>To comply with legal and tax requirements</li>
                        </ul>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">3. Safeguarding Your Data</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Aurelane uses secure servers, encryption, and trusted service partners to protect your data. We do not sell or rent personal information.
                        </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">4. Cookies</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            We use cookies to enhance website experience, personalize content, and analyze traffic.
                        </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">5. Third-Party Disclosure</h2>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                            Your information may be shared with:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2 mb-2">
                            <li>Payment gateway providers</li>
                            <li>Courier/logistics partners</li>
                            <li>Certification labs (only upon request)</li>
                        </ul>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            All third parties maintain their own privacy policies.
                        </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">6. Your Rights</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            You may request access, update, or deletion of your personal data (subject to compliance).
                        </p>
                    </section>

                    <section className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">7. Contact</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            For privacy queries, contact: <a href="mailto:support@aurelane.com" className="text-emerald-600 hover:text-emerald-700 underline">support@aurelane.com</a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;

