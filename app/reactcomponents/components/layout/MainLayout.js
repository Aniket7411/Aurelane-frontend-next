'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import CertificationCarousel from './CertificationCarousel';
import ContactModal from '../common/ContactModal';

const MainLayout = ({ children }) => {
    const [headerHeight, setHeaderHeight] = useState(64);
    const [isMounted, setIsMounted] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const updateHeaderHeight = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };

        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);

        return () => window.removeEventListener('resize', updateHeaderHeight);
    }, [isMounted]);

    return (
        <div className="min-h-screen flex flex-col" style={{ '--header-height': `${headerHeight}px` }}>
            <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
                <Header />
            </header>

            <main
                className="flex-1 bg-white"
                style={{
                    paddingTop: `${headerHeight}px`
                }}
                suppressHydrationWarning
            >
                {children}
            </main>

            {/* Certification Carousel */}
            <CertificationCarousel />

            <footer className=" bottom-0 left-0 right-0 z-40  text-white">
                <Footer />
            </footer>

            {/* Contact Modal */}
            <ContactModal />
        </div>
    );
};

export default MainLayout;
