'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle, FaTimes, FaShoppingCart } from 'react-icons/fa';

const Toast = ({ message, type = 'info', onClose, duration = 3000, action = null }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        const iconClass = "w-5 h-5";
        switch (type) {
            case 'success':
                return <FaCheckCircle className={`${iconClass} text-emerald-600`} />;
            case 'error':
                return <FaTimesCircle className={`${iconClass} text-red-600`} />;
            case 'warning':
                return <FaExclamationTriangle className={`${iconClass} text-amber-600`} />;
            default:
                return <FaInfoCircle className={`${iconClass} text-blue-600`} />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-white border-l-4 border-emerald-500',
                    shadow: 'shadow-xl shadow-emerald-500/10',
                    text: 'text-gray-800'
                };
            case 'error':
                return {
                    bg: 'bg-white border-l-4 border-red-500',
                    shadow: 'shadow-xl shadow-red-500/10',
                    text: 'text-gray-800'
                };
            case 'warning':
                return {
                    bg: 'bg-white border-l-4 border-amber-500',
                    shadow: 'shadow-xl shadow-amber-500/10',
                    text: 'text-gray-800'
                };
            default:
                return {
                    bg: 'bg-white border-l-4 border-blue-500',
                    shadow: 'shadow-xl shadow-blue-500/10',
                    text: 'text-gray-800'
                };
        }
    };

    const styles = getStyles();

    return (
        <motion.div
            initial={{ opacity: 0, x: 400, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.95 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25
            }}
            className={`${styles.bg} ${styles.shadow} ${styles.text} rounded-xl p-4 flex flex-col gap-3 min-w-[340px] max-w-md backdrop-blur-sm border border-gray-100`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    {getIcon()}
                </div>
                <p className="flex-1 text-sm font-semibold leading-relaxed pr-2">{message}</p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                    aria-label="Close"
                >
                    <FaTimes className="w-4 h-4" />
                </button>
            </div>
            {action && (
                <div className="flex justify-end pt-2 border-t border-gray-100">
                    <button
                        onClick={() => {
                            action.onClick();
                            onClose();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg"
                    >
                        {action.icon && <span>{action.icon}</span>}
                        <span>{action.label}</span>
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default Toast;

