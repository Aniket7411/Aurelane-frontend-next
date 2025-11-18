'use client';

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const TopSection = () => {
    const [showNotification, setShowNotification] = useState(false);
    const hasShownRef = useRef(false);
    const videoRef = useRef(null);

    useEffect(() => {
        let timer;

        if (!hasShownRef.current) {
            timer = setTimeout(() => {
                setShowNotification(true);
                hasShownRef.current = true;
            }, 300);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const tryPlay = () => {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.then === "function") {
                playPromise.catch(() => {
                    video.muted = true;
                    video.play().catch(() => {
                        // Ignore autoplay errors; video will show poster instead
                    });
                });
            }
        };

        tryPlay();
    }, []);

    const handleDismissNotification = useCallback(() => {
        setShowNotification(false);
    }, []);

    useEffect(() => {
        if (!showNotification) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                handleDismissNotification();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showNotification, handleDismissNotification]);

    return (
        <div className="relative min-h-screen flex items-center justify-center lg:justify-start lg:items-center px-4 sm:px-6 lg:px-8 overflow-visible">
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover z-0"
                aria-hidden="true"
            >
                <source src="/images/bannervideo.mp4" type="video/mp4" />
                Your browser does not support the background video.
            </video>

            <div className="absolute inset-0 bg-black/30 z-[1] pointer-events-none"></div>

            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ y: -40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="absolute left-0 right-0 w-full px-4 z-30"
                        style={{ top: "calc(var(--header-height, 64px) - 5.4rem)" }}
                    >
                        <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md border border-emerald-100 shadow-lg rounded-2xl px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-start justify-between gap-3 sm:gap-4">
                                <div className="flex gap-3 sm:gap-4 flex-1">
                                    <div className="flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm sm:text-base font-semibold text-emerald-900">
                                            We&apos;re a digital-first jewellery house
                                        </p>
                                        <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">
                                            No physical stores available at the moment. Enjoy a seamless online experience with insured shipping, secure payments and personal gem consultants available on call.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDismissNotification}
                                    className="flex-shrink-0 p-1.5 rounded-full text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition"
                                    aria-label="Close notification"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 text-center lg:text-left max-w-2xl text-white">
                <h1
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2"
                    style={{
                        textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
                    }}
                >
                    Aurelane
                </h1>

                <p className="text-lg sm:text-xl lg:text-2xl mb-1 font-medium tracking-wide opacity-95">
                    India's fastest growing international gem exporter
                </p>

                <p className="text-base sm:text-lg lg:text-xl mb-6 max-w-xl leading-relaxed">
                    Discover the timeless beauty of precious gemstones. At Aurelane, we bring you
                    handpicked elegance, crafted to shine with sophistication and grace.
                </p>

                <Link to="/shop">
                    <button
                        className="text-emerald-700 hover:text-emerald-800 transition-all duration-300 transform hover:scale-105"
                        style={{
                            marginTop: "10px",
                            padding: "14px 36px",
                            fontSize: "1.1rem",
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                            backdropFilter: "blur(10px)"
                        }}
                    >
                        Explore Collection
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default TopSection;