'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";

const gems = [
    {
        name: "Emerald Stone",
        image: "/gemimages/emrald.webp",
        description:
            "Adorned by Elizabeth Taylor and Angelina Jolie, and coveted by Cleopatra, emeralds outshine diamonds in rarity and allure. This opulent gem whispers legacy, prestige, and timeless power crafted for the truly elite.",
        benefits: [
            "Growth in business",
            "Eloquence & Charisma",
            "Sharper Intellect & Memory",
            "Growth In Speculation",
        ],
    },
    {
        name: "Yellow Sapphire (Pukhraj)",
        image: "/gemimages/yellowsapphire.webp",
        description:
            "Unlock prosperity and wisdom with Yellow Sapphire, the gemstone of Jupiter. Enhance intellect, boost financial stability, and attract positive energy. Wear the power of Pukhraj for growth and success.",
        benefits: [
            "Financial Growth",
            "Promotes Good Health",
            "Stability in domestic life",
            "Good for education",
        ],
    },
    {
        name: "Blue Sapphire (Neelam Stone)",
        image: "/gemimages/bluesapphire.webp",
        description:
            "Blue Sapphire (Neelam Stone) is a precious, blue-coloured gemstone of the Corundum mineral family. Recognized as the most powerful and fastest-acting gemstone in Vedic astrology, Neelam Ratna brings instant wealth, fame, and success to the wearer's life.",
        benefits: [
            "Alleviates Misfortune",
            "Supports Mental Health",
            "Increases Wisdom",
            "Success in business",
        ],
    },
    {
        name: "Ruby Stone (Manik Stone)",
        image: "/gemimages/ruby.webp",
        description:
            "Experience the pinnacle of luxury with a rare, investment-worthy ruby symbolizes power, passion, and exclusivity. Own a timeless masterpiece treasured by royalty, designed to elevate your legacy forever.",
        benefits: [
            "Professional Success",
            "Boosts Financial Status",
            "Overall Good Health",
            "Better Paternal Relationships",
        ],
    },
    {
        name: "Pearl Stone (Moti)",
        image: "/gemimages/pearl.webp",
        description:
            "Pearl also known as Moti, has adorned celebrities like Audrey Hepburn and Meghan Markle. This gemstone symbolizes purity, wisdom, and emotional balance, making it a sophisticated choice for those seeking classic beauty and spiritual harmony.",
        benefits: [
            "Better Maternal Relations",
            "Physical Healing",
            "Mental Strength",
            "Calmer Personality",
        ],
    },
    {
        name: "Red Coral (Moonga Stone)",
        image: "/gemimages/redcoral.webp",
        description:
            "Red Coral (Moonga), also called 'OX blood' in the trade, is a precious gemstone formed in the deep sea by marine creatures called coral polyps (Corallium rubrum). It is a popular astrological gemstone worn to ensure success in leadership roles, sports, business, and health.",
        benefits: [
            "Gives Courage",
            "Cures Blood Disorders",
            "Athletic Capabilities",
            "Overcoming Obstacles",
        ],
    },
    {
        name: "Gomed Stone (Hessonite)",
        image: "/gemimages/hessonite.webp",
        description:
            "Hessonite (Gomed Stone) is a deep brown or honey-coloured, semi-precious gemstone from the grossular Garnet mineral family. It is worn to overcome the adverse effects of Rahu and gain power, wealth, and success in public careers, jobs, and businesses.",
        benefits: [
            "Sudden Gain",
            "Growth in politics",
            "Control Gastric problems",
            "Provides Spiritual Protection",
        ],
    },
];

const GemCards = () => {
    const [currentMobileSlide, setCurrentMobileSlide] = useState(0);

    const nextSlide = () => {
        setCurrentMobileSlide((prev) =>
            prev === gems.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentMobileSlide((prev) =>
            prev === 0 ? gems.length - 1 : prev - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentMobileSlide(index);
    };

    return (
        <motion.section
            className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl flex flex-col mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-6 sm:mb-8 lg:mb-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 px-2">
                        Explore Our Precious Gems
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-3xl mx-auto px-4">
                        Discover the mystical power and timeless beauty of authentic gemstones, each carefully selected for their spiritual significance and exceptional quality.
                    </p>
                </motion.div>

                {/* Desktop Grid - 3 columns */}
                <div className="hidden lg:flex lg:flex-wrap lg:justify-center gap-6 xl:gap-8">
                    {gems.map((gem, index) => (
                        <motion.div
                            key={index}
                            className="group w-full lg:w-[30%] xl:w-[30%] max-w-sm"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <div className="bg-white/10 backdrop-blur-lg  rounded-3xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/25 flex flex-col h-full">
                                <motion.div
                                    className="flex justify-center items-center p-4 xl:p-5 flex-shrink-0 h-32 xl:h-36"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        src={gem.image}
                                        alt={gem.name}
                                        className="max-h-full w-auto object-contain drop-shadow-lg"
                                    />
                                </motion.div>

                                <div className="p-4 xl:p-6 flex flex-col flex-grow">
                                    <h2 className="text-lg xl:text-xl font-bold text-white mb-2 text-center group-hover:text-purple-300 transition-colors">
                                        {gem.name}
                                    </h2>

                                    <p className="text-white/80 text-xs xl:text-sm mb-3 leading-relaxed flex-grow line-clamp-3">
                                        {gem.description}
                                    </p>

                                    <div className="space-y-1.5 mb-4">
                                        {gem.benefits.map((benefit, i) => (
                                            <motion.div
                                                key={i}
                                                className="flex items-center text-white/90 text-xs xl:text-sm"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                            >
                                                <span className="text-purple-400 mr-2">✨</span>
                                                {benefit}
                                            </motion.div>
                                        ))}
                                    </div>
                                    {/* 
                                    <motion.button
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Discover Power
                                    </motion.button> */}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tablet Grid - 2 columns */}
                <div className="hidden md:flex lg:hidden md:flex-wrap md:justify-center gap-6">
                    {gems.map((gem, index) => (
                        <motion.div
                            key={index}
                            className="group w-full max-w-sm md:max-w-md"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <div className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/25 flex flex-col h-full">
                                <motion.div
                                    className="flex justify-center items-center p-4 flex-shrink-0 h-32"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        src={gem.image}
                                        alt={gem.name}
                                        className="max-h-full w-auto object-contain drop-shadow-lg"
                                    />
                                </motion.div>

                                <div className="p-4 flex flex-col flex-grow">
                                    <h2 className="text-lg font-bold text-white mb-2 text-center group-hover:text-purple-300 transition-colors">
                                        {gem.name}
                                    </h2>

                                    <p className="text-white/80 text-xs mb-3 leading-relaxed flex-grow line-clamp-2">
                                        {gem.description}
                                    </p>

                                    <div className="space-y-1.5 mb-4">
                                        {gem.benefits.map((benefit, i) => (
                                            <motion.div
                                                key={i}
                                                className="flex items-center text-white/90 text-xs"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                            >
                                                <span className="text-purple-400 mr-2">✨</span>
                                                {benefit}
                                            </motion.div>
                                        ))}
                                    </div>

                                    <motion.button
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 text-sm"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Discover
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Carousel */}
                <div className="md:hidden">
                    <div className="relative">
                        <div className="overflow-hidden px-2 sm:px-4">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentMobileSlide * 100}%)` }}
                            >
                                {gems.map((gem, index) => (
                                    <div key={index} className="w-full flex-shrink-0 px-2 sm:px-3">
                                        <motion.div
                                            className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 p-4 sm:p-5 min-h-[320px] sm:min-h-[340px] flex flex-col"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div className="flex justify-center items-center mb-2 sm:mb-3 flex-shrink-0 h-28 sm:h-32">
                                                <motion.img
                                                    src={gem.image}
                                                    alt={gem.name}
                                                    className="max-h-full w-auto object-contain drop-shadow-lg"
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>

                                            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 text-center">
                                                {gem.name}
                                            </h2>

                                            <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed flex-grow line-clamp-3">
                                                {gem.description}
                                            </p>

                                            <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5">
                                                {gem.benefits.map((benefit, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="flex items-center text-white/90 text-xs sm:text-sm"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                                    >
                                                        <span className="text-purple-400 mr-2">✨</span>
                                                        {benefit}
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* <motion.button
                                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 sm:py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Discover Power
                                            </motion.button> */}
                                        </motion.div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-lg rounded-full p-2 sm:p-3 hover:bg-white/30 transition-all duration-300 z-20 shadow-lg"
                            aria-label="Previous gem"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-lg rounded-full p-2 sm:p-3 hover:bg-white/30 transition-all duration-300 z-20 shadow-lg"
                            aria-label="Next gem"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Dots Indicator */}
                        <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
                            {gems.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${index === currentMobileSlide
                                        ? 'w-6 sm:w-8 bg-purple-500'
                                        : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/60'
                                        }`}
                                    aria-label={`Go to gem ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default GemCards;