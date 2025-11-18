'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AmanBirthday = () => {
    const [confettiPieces, setConfettiPieces] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [balloons, setBalloons] = useState([]);

    useEffect(() => {
        // Generate confetti pieces
        const pieces = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 3 + Math.random() * 2,
            color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][Math.floor(Math.random() * 6)]
        }));
        setConfettiPieces(pieces);

        // Generate balloons
        const balloonData = Array.from({ length: 10 }, (_, i) => ({
            id: i,
            left: Math.random() * 90,
            delay: Math.random() * 2,
            color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][Math.floor(Math.random() * 6)]
        }));
        setBalloons(balloonData);

        // Show message after animation
        setTimeout(() => setShowMessage(true), 1000);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 overflow-hidden relative">
            {/* Confetti */}
            {confettiPieces.map((piece) => (
                <motion.div
                    key={piece.id}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                        backgroundColor: piece.color,
                        left: `${piece.left}%`,
                        top: '-10px'
                    }}
                    animate={{
                        y: [0, window.innerHeight + 100],
                        x: [0, Math.random() * 200 - 100],
                        rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)]
                    }}
                    transition={{
                        duration: piece.duration,
                        delay: piece.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Floating Balloons */}
            {balloons.map((balloon) => (
                <motion.div
                    key={balloon.id}
                    className="absolute bottom-0"
                    style={{ left: `${balloon.left}%` }}
                    animate={{
                        y: [0, -window.innerHeight - 200],
                        x: [0, Math.sin(balloon.left) * 50]
                    }}
                    transition={{
                        duration: 6 + Math.random() * 3,
                        delay: balloon.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div
                        className="w-16 h-20 rounded-full relative shadow-2xl"
                        style={{ backgroundColor: balloon.color }}
                    >
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-400" />
                    </div>
                </motion.div>
            ))}

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="text-center z-10">
                    {/* 3D Rotating Gift Box */}
                    <motion.div
                        className="mb-12"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            duration: 1
                        }}
                    >
                        <motion.div
                            animate={{
                                rotateY: [0, 360],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-8xl sm:text-9xl filter drop-shadow-2xl"
                        >
                            🎁
                        </motion.div>
                    </motion.div>

                    {/* Birthday Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: showMessage ? 1 : 0, y: showMessage ? 0 : 50 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Happy Birthday Text */}
                        <motion.h1
                            className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6"
                            style={{
                                background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF69B4, #FFD700)',
                                backgroundSize: '300% 300%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            Happy Birthday
                        </motion.h1>

                        {/* Name with 3D Effect */}
                        <motion.h2
                            className="text-6xl sm:text-8xl md:text-9xl font-extrabold mb-8 relative"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                delay: 0.5
                            }}
                        >
                            <motion.span
                                className="inline-block text-white"
                                style={{
                                    textShadow: `
                                        3px 3px 0 #FF1493,
                                        6px 6px 0 #FF69B4,
                                        9px 9px 0 #FFB6C1,
                                        12px 12px 20px rgba(0,0,0,0.5)
                                    `
                                }}
                                animate={{
                                    textShadow: [
                                        `3px 3px 0 #FF1493, 6px 6px 0 #FF69B4, 9px 9px 0 #FFB6C1, 12px 12px 20px rgba(0,0,0,0.5)`,
                                        `3px 3px 0 #4ECDC4, 6px 6px 0 #45B7D1, 9px 9px 0 #5DADE2, 12px 12px 20px rgba(0,0,0,0.5)`,
                                        `3px 3px 0 #FFD700, 6px 6px 0 #FFA500, 9px 9px 0 #FF8C00, 12px 12px 20px rgba(0,0,0,0.5)`,
                                        `3px 3px 0 #FF1493, 6px 6px 0 #FF69B4, 9px 9px 0 #FFB6C1, 12px 12px 20px rgba(0,0,0,0.5)`
                                    ]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                AMAN
                            </motion.span>
                        </motion.h2>

                        {/* Birthday Cake */}
                        <motion.div
                            className="text-7xl sm:text-8xl mb-8"
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity
                            }}
                        >
                            🎂
                        </motion.div>

                        {/* Wishes */}
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                        >
                            <motion.p
                                className="text-xl sm:text-3xl md:text-4xl text-white font-semibold"
                                animate={{
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity
                                }}
                            >
                                May your day be filled with joy! 🎉
                            </motion.p>

                            <motion.p
                                className="text-lg sm:text-2xl text-pink-200"
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.5 }}
                            >
                                Wishing you all the happiness in the world! 🌟
                            </motion.p>

                            <motion.p
                                className="text-lg sm:text-2xl text-yellow-200"
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 2 }}
                            >
                                Here's to another amazing year! 🥳
                            </motion.p>
                        </motion.div>

                        {/* Decorative Elements */}
                        <motion.div
                            className="mt-12 flex justify-center space-x-4 text-5xl sm:text-6xl"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 2.5 }}
                        >
                            <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                                🎈
                            </motion.span>
                            <motion.span animate={{ y: [0, -20, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                🎊
                            </motion.span>
                            <motion.span animate={{ rotate: [0, -20, 20, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                                🎈
                            </motion.span>
                            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                                ✨
                            </motion.span>
                            <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                                🎈
                            </motion.span>
                        </motion.div>

                        {/* Sparkling Stars */}
                        <div className="absolute inset-0 pointer-events-none">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute text-yellow-300 text-2xl sm:text-3xl"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`
                                    }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        rotate: [0, 180, 360],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 2 + Math.random() * 2,
                                        delay: Math.random() * 3,
                                        repeat: Infinity
                                    }}
                                >
                                    ⭐
                                </motion.div>
                            ))}
                        </div>

                        {/* Pulsating Heart */}
                        <motion.div
                            className="mt-12 text-6xl sm:text-7xl"
                            animate={{
                                scale: [1, 1.3, 1],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            ❤️
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-50"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            delay: Math.random() * 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Bottom Message */}
            <motion.div
                className="absolute bottom-8 left-0 right-0 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3, duration: 1 }}
            >
                <p className="text-xl sm:text-2xl text-white font-medium">
                    🎉 Have a fantastic birthday, Aman! 🎉
                </p>
            </motion.div>
        </div>
    );
};

export default AmanBirthday;


