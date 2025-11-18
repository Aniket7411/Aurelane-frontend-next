'use client';

import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '../components/common/Toast';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info', duration = 3000, action = null) => {
        // Use a combination of timestamp and random number to ensure unique IDs
        const id = typeof window !== 'undefined' 
            ? Date.now() + Math.random() 
            : Math.random();
        setToasts((prev) => [...prev, { id, message, type, duration, action }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const showSuccess = (message, action = null) => addToast(message, 'success', 4000, action);
    const showError = (message, action = null) => addToast(message, 'error', 4000, action);
    const showWarning = (message, action = null) => addToast(message, 'warning', 4000, action);
    const showInfo = (message, action = null) => addToast(message, 'info', 3000, action);

    return (
        <ToastContext.Provider value={{ addToast, showSuccess, showError, showWarning, showInfo }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <div key={toast.id} className="pointer-events-auto">
                            <Toast
                                message={toast.message}
                                type={toast.type}
                                duration={toast.duration}
                                action={toast.action}
                                onClose={() => removeToast(toast.id)}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

