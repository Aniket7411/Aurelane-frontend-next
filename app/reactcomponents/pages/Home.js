'use client';

import React from 'react';
import GemCards from '../components/gemcard';
import TopSection from './homepage/topsection';
import GemsCarousel from './homepage/gemscarausel';
import RingSection from './homepage/ringsection';
import GemInquirySection from './homepage/topcarausel';
import TestimonialCarousel from './homepage/testimonialcarousel';
import GemImagesCarousel from '../components/gems/GemImagesCarousel';

const Home = () => {
    return (
        <div className="overflow-hidden">
            <TopSection />

            <GemsCarousel />
            <GemInquirySection />

            <RingSection />
            <GemCards />
            <GemImagesCarousel />

            <TestimonialCarousel />

        </div>
    );
};

export default Home;

