'use client';

import React from 'react';
import { motion } from 'framer-motion';

const CertificationCarousel = () => {
    const certifications = [
        { name: 'IGI', image: '/gemimages/igi.png' },
        { name: 'Lotus', image: '/gemimages/lotus.png' },
        { name: 'DUNA', image: '/gemimages/duna.png' },
        { name: 'SSEF', image: '/gemimages/ssef.png' },
        { name: 'GemLab', image: '/gemimages/gemlab.png' },
        { name: 'AGL', image: '/gemimages/agl.png' },
    ];

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200 border-b border-gray-200 py-6 sm:py-8 md:py-10 certification-carousel">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-center text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-4 sm:mb-6 md:mb-8">
                    Certified by Leading Gemological Institutes
                </h3>
                
                {/* Mobile/Tablet: Scrolling Carousel */}
                <div className="lg:hidden overflow-hidden relative">
                    <div className="flex items-center gap-4 sm:gap-6 md:gap-8 animate-scroll">
                        {/* Duplicate items for seamless infinite loop */}
                        {[...certifications, ...certifications, ...certifications].map((cert, index) => (
                            <div
                                key={`${cert.name}-${index}`}
                                className="flex-shrink-0 flex items-center justify-center"
                            >
                                <div className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-3 sm:p-4 md:p-5 h-16 sm:h-20 md:h-24 w-auto flex items-center justify-center min-w-[100px] sm:min-w-[120px] md:min-w-[140px]">
                                    <img
                                        src={cert.image}
                                        alt={cert.name}
                                        className="h-full w-auto object-contain max-w-[80px] sm:max-w-[100px] md:max-w-[120px]"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop: Static Grid */}
                <div className="hidden lg:flex items-center justify-center gap-4 xl:gap-6">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={cert.name}
                            className="flex items-center justify-center flex-1"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.1 }}
                        >
                            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 xl:p-6 h-24 xl:h-28 w-full max-w-[160px] xl:max-w-[180px] flex items-center justify-center">
                                <img
                                    src={cert.image}
                                    alt={cert.name}
                                    className="h-full w-auto object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CSS Animation for Mobile Carousel */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes certification-scroll {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(calc(-100% / 3));
                        }
                    }

                    .certification-carousel .animate-scroll {
                        animation: certification-scroll 20s linear infinite;
                        display: flex;
                    }

                    .certification-carousel .animate-scroll:hover {
                        animation-play-state: paused;
                    }
                `
            }} />
        </div>
    );
};

export default CertificationCarousel;

