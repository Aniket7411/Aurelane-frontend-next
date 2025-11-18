'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already authenticated on app load
        const checkAuth = () => {
            if (authAPI.isAuthenticated()) {
                const userData = authAPI.getCurrentUser();
                setUser(userData);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            if (response.success) {
                setUser(response.user);
                return response;
            }
            throw new Error(response.message || 'Login failed');
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
    };

    const forgotPassword = async (email) => {
        try {
            const response = await authAPI.forgotPassword(email);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const resetPassword = async (token, password) => {
        try {
            const response = await authAPI.resetPassword(token, password);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const verifyEmail = async (token) => {
        try {
            const response = await authAPI.verifyEmail(token);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;