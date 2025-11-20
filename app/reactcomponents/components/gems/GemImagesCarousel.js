'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const gemImages = [
    { src: '/gemimages/pigeonbloodruby.webp', alt: 'Pigeon Blood Ruby' },
    { src: '/gemimages/ruby.webp', alt: 'Ruby' },
    { src: '/gemimages/swatemrald.webp', alt: 'Swat Emerald' },
    { src: '/gemimages/basrapearls.webp', alt: 'Basra Pearls' },
    { src: '/gemimages/padparadchasapphire.webp', alt: 'Padparadcha Sapphire' },
    { src: '/gemimages/royalbluesapphire.webp', alt: 'Royal Blue Sapphire' },
    { src: '/gemimages/pujshiremrals.webp', alt: 'Pujshire Emeralds' },
    { src: '/gemimages/kashmiribura.webp', alt: 'Kashmiri Blue Sapphire' },
    { src: '/gemimages/nooil.webp', alt: 'No Oil Emerald' },
    { src: '/gemimages/cornflower.webp', alt: 'Cornflower Blue Sapphire' },
    { src: '/gemimages/columbian.webp', alt: 'Columbian Emerald' },
    { src: '/gemimages/burma.webp', alt: 'Burma Ruby' },
    { src: '/gemimages/Alexandrite.webp', alt: 'Alexandrite' },
];

const GemImagesCarousel = () => {
    const carouselRef = useRef(null);
    const animationRef = useRef(null);
    const isPausedRef = useRef(false);

    // Duplicate images for seamless infinite scroll
    const duplicatedImages = [...gemImages, ...gemImages, ...gemImages];

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        let scrollPosition = 0;
        const scrollSpeed = 0.5; // Adjust speed (lower = slower)

        const animate = () => {
            if (!isPausedRef.current) {
                scrollPosition += scrollSpeed;

                // Reset position when we've scrolled through one set of images
                const singleSetWidth = carousel.scrollWidth / 3;
                if (scrollPosition >= singleSetWidth) {
                    scrollPosition = 0;
                }

                carousel.scrollLeft = scrollPosition;
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const handleMouseEnter = () => {
        isPausedRef.current = true;
    };

    const handleMouseLeave = () => {
        isPausedRef.current = false;
    };

    return (
        <div className="w-full py-8 sm:py-12 md:py-16 bg-white">
            {/* Header */}
            {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 md:mb-12">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                        <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Exquisite Gemstone Collection
                        </span>
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                        Discover our handpicked selection of rare and beautiful gemstones
                    </p>
                </div>
            </div> */}

            {/* Infinite Carousel Container - Full Width */}
            <div
                className="relative overflow-hidden w-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Gradient Overlays for smooth fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 md:w-40 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 md:w-40 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />

                {/* Carousel */}
                <div
                    ref={carouselRef}
                    className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-hidden scrollbar-hide px-4 sm:px-6 md:px-8"
                    style={{ scrollBehavior: 'auto' }}
                >
                    {duplicatedImages.map((image, index) => (
                        <motion.div
                            key={`${image.alt}-${index}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0"
                        >
                            <div className="group relative bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                                {/* Gem Image Container - Fixed size to prevent blur - Smaller for more visibility */}
                                <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] overflow-hidden">
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-full object-contain p-2 sm:p-3 md:p-4 transition-transform duration-300 group-hover:scale-110"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    {/* Subtle shadow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none" />
                                </div>

                                {/* Label */}
                                <div className="px-3 sm:px-4 py-2 sm:py-3 bg-white">
                                    <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 text-center truncate">
                                        {image.alt}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GemImagesCarousel;
