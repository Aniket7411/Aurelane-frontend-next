'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { gemstonesData } from '../data/gemstonesData';

const Gemstones = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('emerald');

  const activeGemstone = gemstonesData.find(gem => gem.id === activeTab);

  const handleBuyNow = () => {
    navigate(`/shop?query=${encodeURIComponent(activeGemstone.name)}`);
  };

  // Check if gemstone has a light gradient (needs dark text)
  const isLightGradient = ['pearl', 'diamond', 'moonstone', 'opal'].includes(activeGemstone.id);
  const headerTextColor = isLightGradient ? 'text-gray-900' : 'text-white';

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Sacred Gemstones
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover the mystical power and astrological significance of authentic gemstones.
              Each stone carries unique energies that can transform your life when worn with proper guidance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                100% Authentic
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Astrologically Certified
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Energized & Blessed
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
          <div className="flex flex-wrap justify-center gap-2">
            {gemstonesData.map((gem) => (
              <motion.button
                key={gem.id}
                onClick={() => setActiveTab(gem.id)}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${activeTab === gem.id
                  ? `bg-gradient-to-r ${gem.gradient} text-white shadow-lg transform scale-105`
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* <span className="text-xl">{gem.emoji}</span> */}
                <img
                  src={gem.image}
                  alt={gem.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    e.target.src = '/gemimages/greenstone.jpeg';
                  }}
                />
                <span className="hidden sm:block">{gem.name}</span>
                <span className="sm:hidden text-xs">{gem.hindiName.split(' ')[0]}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden"
          >
            {/* Gemstone Header */}
            <div className={`bg-gradient-to-r ${activeGemstone.gradient} p-8 ${headerTextColor} relative`}>
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                  <div className="text-6xl">
                    <img
                      src={activeGemstone.image}
                      alt={activeGemstone.name}
                      className="w-24 h-24 object-contain"
                      onError={(e) => {
                        e.target.src = '/gemimages/greenstone.jpeg';
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                      {activeGemstone.name}
                    </h2>
                    <p className={`text-xl ${isLightGradient ? 'opacity-80' : 'opacity-90'}`}>
                      {activeGemstone.hindiName}
                    </p>
                    <p className={`text-lg ${isLightGradient ? 'opacity-70' : 'opacity-75'}`}>
                      {activeGemstone.planet} ({activeGemstone.planetHindi})
                    </p>
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className={`${isLightGradient ? 'bg-gray-900/20 text-gray-900' : 'bg-white/20'} rounded-lg p-3`}>
                      <div className="font-semibold">Color</div>
                      <div>{activeGemstone.color}</div>
                    </div>
                    <div className={`${isLightGradient ? 'bg-gray-900/20 text-gray-900' : 'bg-white/20'} rounded-lg p-3`}>
                      <div className="font-semibold">Hardness</div>
                      <div>{activeGemstone.hardness}</div>
                    </div>
                    <div className={`${isLightGradient ? 'bg-gray-900/20 text-gray-900' : 'bg-white/20'} rounded-lg p-3`}>
                      <div className="font-semibold">Metal</div>
                      <div className="text-xs">{activeGemstone.metal}</div>
                    </div>
                    <div className={`${isLightGradient ? 'bg-gray-900/20 text-gray-900' : 'bg-white/20'} rounded-lg p-3`}>
                      <div className="font-semibold">Finger</div>
                      <div className="text-xs">{activeGemstone.finger}</div>
                    </div>
                  </div>
                  {/* Buy Now Button */}
                  <motion.button
                    onClick={handleBuyNow}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full lg:w-auto ${isLightGradient ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-white text-gray-900 hover:bg-gray-100'} px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors flex items-center justify-center gap-2`}
                  >
                    <FaShoppingCart className="text-lg" />
                    <span>Buy {activeGemstone.name}</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Description */}
                  <motion.div
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    className={`${activeGemstone.bgColor} ${activeGemstone.borderColor} border rounded-2xl p-6`}
                  >
                    <h3 className={`text-xl font-bold ${activeGemstone.textColor} mb-4`}>
                      About {activeGemstone.name}
                    </h3>
                    <p className={`${activeGemstone.textColor} leading-relaxed`}>
                      {activeGemstone.description}
                    </p>
                  </motion.div>

                  {/* Astrological Significance */}
                  <motion.div
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                    className={`${activeGemstone.bgColor} ${activeGemstone.borderColor} border rounded-2xl p-6`}
                  >
                    <h3 className={`text-xl font-bold ${activeGemstone.textColor} mb-4`}>
                      Astrological Significance
                    </h3>
                    <p className={`${activeGemstone.textColor} leading-relaxed`}>
                      {activeGemstone.astrologicalSignificance}
                    </p>
                  </motion.div>

                  {/* Benefits */}
                  <motion.div
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    className={`${activeGemstone.bgColor} ${activeGemstone.borderColor} border rounded-2xl p-6`}
                  >
                    <h3 className={`text-xl font-bold ${activeGemstone.textColor} mb-4`}>
                      Benefits of Wearing {activeGemstone.name}
                    </h3>
                    <ul className="space-y-2">
                      {activeGemstone.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className={`text-lg ${activeGemstone.textColor} mt-0.5`}>•</span>
                          <span className={activeGemstone.textColor}>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Features */}
                  <motion.div
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">
                      Physical Features
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-emerald-300 mb-2">Color</h4>
                        <p className="text-gray-300 text-sm">{activeGemstone.features.color}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-300 mb-2">Hardness</h4>
                        <p className="text-gray-300 text-sm">{activeGemstone.features.hardness}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-300 mb-2">Best Metal</h4>
                        <p className="text-gray-300 text-sm">{activeGemstone.features.bestMetal}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-300 mb-2">Day to Wear</h4>
                        <p className="text-gray-300 text-sm">{activeGemstone.features.dayToWear || activeGemstone.day}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Wearing Instructions */}
                  <motion.div
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">
                      Wearing Instructions
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          1
                        </div>
                        <span className="text-gray-300">Purify the gemstone with Ganga Jal</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          2
                        </div>
                        <span className="text-gray-300">Energize with proper mantras</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          3
                        </div>
                        <span className="text-gray-300">Wear on {activeGemstone.day}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          4
                        </div>
                        <span className="text-gray-300">Place on {activeGemstone.finger}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                      <p className="text-yellow-200 text-sm">
                        <strong>Mantra:</strong> {activeGemstone.mantra}
                      </p>
                    </div>
                  </motion.div>

                  {/* Suitable For */}
                  <motion.div
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">
                      Suitable For
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeGemstone.suitableFor.map((profession, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm border border-emerald-500/30"
                        >
                          {profession}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* History Section */}
              <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
                className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Historical & Cultural Legacy
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {activeGemstone.history}
                </p>
              </motion.div>


            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gemstones;
