'use client';

import React from 'react';

const AurelaneAbout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50">
            {/* Header Section */}
            <header
                className="relative py-8 sm:py-12 md:py-16 px-4 sm:px-6 text-center bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 text-white"
                style={{
                    backgroundImage: 'linear-gradient(135deg,rgb(9, 119, 63) 0%,rgb(179, 146, 110) 50%,rgb(12, 123, 38) 100%)'
                }}
            >
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 tracking-wide">
                        Aurelane
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light italic max-w-2xl mx-auto leading-relaxed px-2">
                        Where Earth's Ancient Whispers Meet Your Soul's Journey
                    </p>
                </div>

                {/* Decorative Elements */}
                {/* <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-8 py-4">
                    {['🟢', '🔴', '🔵', '✨', '💎'].map((icon, index) => (
                        <span
                            key={index}
                            className="text-2xl opacity-80 transform hover:scale-110 transition-transform duration-300"
                            style={{ animation: `float ${3 + index * 0.5}s infinite ease-in-out` }}
                        >
                            {icon}
                        </span>
                    ))}
                </div> */}
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
                {/* Introduction Section */}
                <section className="mb-8 sm:mb-10 md:mb-12">
                    <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-12">
                        <div className="flex-1 w-full">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-800 mb-4 sm:mb-5 md:mb-6">
                                The Golden Path Awaits
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-5 md:mb-6">
                                At <span className="font-semibold text-amber-700">Aurelane</span>, we believe that gemstones are more than ornaments — they are ancient whispers from the Earth, shaped by time, forged under cosmic pressure, and destined to meet the souls they're meant to empower.
                            </p>
                            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                                Our journey began with a singular vision: to bring the world's purest, rarest, and most spiritually aligned gemstones to people who seek more than beauty — they seek meaning, energy, and truth.
                            </p>
                        </div>
                        <div
                            className="flex-1 w-full bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl border border-amber-200"
                            style={{
                                background: 'linear-gradient(145deg, #ffffff 0%, #fef3c7 100%)'
                            }}
                        >
                            <h3 className="text-xl sm:text-2xl font-bold text-amber-800 mb-3 sm:mb-4 text-center">
                                The Meaning Behind Our Name
                            </h3>
                            <div className="text-center mb-3 sm:mb-4">
                                <span className="text-3xl sm:text-4xl">🌟</span>
                            </div>
                            <p className="text-sm sm:text-base text-gray-700 text-center leading-relaxed">
                                The name <span className="font-semibold text-amber-700">Aurelane</span> comes from a fusion of the word "Aurelia" — signifying golden light — and "lane," representing a path. Together, Aurelane stands for the "Golden Path" — a journey of purity, grace, and alignment with the universe's truest energies.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className="mb-8 sm:mb-10 md:mb-12">
                    <div
                        className="bg-gradient-to-r from-amber-600 to-amber-800 text-white p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl text-center mb-8 sm:mb-10 md:mb-12 shadow-2xl"
                        style={{
                            background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)'
                        }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6">
                            Our Philosophy
                        </h2>
                        <p className="text-lg sm:text-xl md:text-2xl font-light italic max-w-4xl mx-auto leading-relaxed px-2">
                            "Purity is Not a Luxury — It's a Standard"
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
                        <div className="flex-1 bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-amber-100">
                            <h3 className="text-xl sm:text-2xl font-bold text-amber-800 mb-3 sm:mb-4">
                                Scientific Excellence
                            </h3>
                            <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                                We work only with certified gemologists and trusted sources to procure gemstones that are 100% natural, untreated, and ethically mined.
                            </p>
                            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
                                {['🟢 Panna', '🔴 Manik', '🔵 Neelam'].map((gem, index) => (
                                    <span
                                        key={index}
                                        className="px-2 sm:px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs sm:text-sm font-medium"
                                    >
                                        {gem}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-amber-100">
                            <h3 className="text-xl sm:text-2xl font-bold text-amber-800 mb-3 sm:mb-4">
                                Spiritual Alignment
                            </h3>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                We understand the significance of gemstones in one's astrological journey. Our process ensures every stone aligns with its intended purpose, guided by experts in Grah, Dasha, Nakshatra, and cosmic energy balance.
                            </p>
                        </div>
                    </div>
                </section>

                {/* What We Offer Section */}
                <section className="mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-amber-800 mb-8 sm:mb-12 md:mb-16">
                        What We Offer
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {[
                            { icon: '💎', title: '100% Natural Gemstones', desc: 'Untreated, ethically sourced precious stones' },
                            { icon: '📜', title: 'Lab-Certified Purity', desc: 'Government & gemological institute reports' },
                            { icon: '⭐', title: 'Astrological Accuracy', desc: 'Handpicked for planetary alignment' },
                            { icon: '✨', title: 'Energy Cleansed', desc: 'Spiritually activated & purified' },
                            { icon: '👥', title: 'Bespoke Consultation', desc: 'Personalized gem matching service' },
                            { icon: '💰', title: 'Transparent Pricing', desc: 'Lifetime authenticity guarantee' }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                style={{
                                    background: 'linear-gradient(135deg, #ffffff 0%, #fefce8 100%)'
                                }}
                            >
                                <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 text-center">{feature.icon}</div>
                                <h3 className="text-lg sm:text-xl font-bold text-amber-800 mb-2 sm:mb-3 text-center">
                                    {feature.title}
                                </h3>
                                <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Process Section */}
                <section className="mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-amber-800 mb-8 sm:mb-12 md:mb-16">
                        Our Meticulous Process
                    </h2>

                    <div className="flex flex-col space-y-4 sm:space-y-6 md:space-y-8">
                        {[
                            { step: '1', title: 'Ethical Sourcing', desc: 'We source only from approved, conflict-free mines' },
                            { step: '2', title: 'Laboratory Verification', desc: 'Gemstones are lab-verified for origin, cut, clarity, and treatment' },
                            { step: '3', title: 'Astrological Matching', desc: 'Each stone is matched to client\'s astrological requirements' },
                            { step: '4', title: 'Spiritual Cleansing', desc: 'We perform energy cleansing and energization rituals' },
                            { step: '5', title: 'Certified Delivery', desc: 'Final stones are certified and shipped with documentation' }
                        ].map((process, index) => (
                            <div
                                key={index}
                                className="flex flex-col sm:flex-row items-start sm:items-center bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-amber-100"
                                style={{
                                    background: 'linear-gradient(90deg, #fefce8 0%, #ffffff 50%, #fefce8 100%)'
                                }}
                            >
                                <div
                                    className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mb-3 sm:mb-0 sm:mr-4 md:mr-6"
                                    style={{
                                        background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)'
                                    }}
                                >
                                    {process.step}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800 mb-1 sm:mb-2">
                                        {process.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                        {process.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mission & Why Choose Us */}
                <section className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-10 md:mb-12">
                    {/* Mission */}
                    <div className="flex-1 w-full">
                        <div className="bg-amber-900 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-2xl h-full">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-5 md:mb-6 text-center">
                                Our Mission
                            </h2>
                            <p className="text-amber-100 leading-relaxed text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
                                Our mission is to eliminate confusion, mistrust, and misrepresentation in the gemstone market. Far too often, customers fall victim to imitation stones, unverified sources, or unauthenticated claims.
                            </p>
                            <p className="text-amber-100 leading-relaxed text-sm sm:text-base md:text-lg font-semibold text-center">
                                At Aurelane, we stand for something rare: <span className="text-amber-300">Transparency. Truth. Trust.</span>
                            </p>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="flex-1 w-full">
                        <div
                            className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-2xl border border-amber-200 h-full"
                            style={{
                                background: 'linear-gradient(145deg, #ffffff 0%, #fef3c7 100%)'
                            }}
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 mb-4 sm:mb-5 md:mb-6 text-center">
                                Why Choose Aurelane
                            </h2>
                            <div className="space-y-3 sm:space-y-4">
                                {[
                                    'Lab Reports from Reputed Gemological Institutes',
                                    'Ethical Sourcing & Premium Cut Quality',
                                    'Grah-anukool (planet-aligned) gemstones only',
                                    'No synthetics, no glass-fills, no lies',
                                    'Luxury-level packaging with certification',
                                    'Direct consultations for gem matching'
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start sm:items-center">
                                        <span className="text-green-600 text-lg sm:text-xl mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0">✅</span>
                                        <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final Experience Section */}
                <section
                    className="text-center py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 rounded-2xl sm:rounded-3xl shadow-2xl"
                    style={{
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fefce8 50%, #fef3c7 100%)',
                        border: '2px solid #fbbf24'
                    }}
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-800 mb-4 sm:mb-6 md:mb-8">
                        The Aurelane Experience
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8">
                        Every gem sold by Aurelane tells a story — not of just brilliance, but of balance. Not just rarity, but resonance. Not just beauty, but a higher belonging.
                    </p>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8">
                        Whether you wear it for success in your career, harmony in relationships, clarity of thought, or spiritual protection — know that your gem has been chosen with the highest standards and cosmic care.
                    </p>
                    <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-amber-700 italic px-2">
                        Because at Aurelane, we don't just deliver gemstones — we deliver a piece of Earth's soul, aligned with yours.
                    </div>
                </section>
            </main>

            {/* Footer */}
            {/* <footer className="bg-amber-900 text-amber-100 py-12 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold mb-4 font-serif">Aurelane</h3>
                    <p className="text-amber-200 mb-6">
                        The Golden Path to Cosmic Alignment
                    </p>
                    <div className="flex justify-center space-x-6 text-2xl">
                        {['💎', '✨', '🌟', '🔮', '📿'].map((icon, index) => (
                            <span key={index} className="opacity-80 hover:opacity-100 transition-opacity">
                                {icon}
                            </span>
                        ))}
                    </div>
                </div>
            </footer> */}

            {/* Floating Animation */}
            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    );
};

export default AurelaneAbout;
