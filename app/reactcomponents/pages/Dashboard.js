'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authAPI.isAuthenticated()) {
            navigate('/login');
            return;
        }

        const currentUser = authAPI.getCurrentUser();
        setUser(currentUser);
        
        // Redirect based on role
        if (currentUser?.role === 'admin') {
            navigate('/admin-dashboard');
            return;
        } else if (currentUser?.role === 'seller') {
            navigate('/seller-dashboard');
            return;
        } else if (currentUser?.role === 'buyer' || !currentUser?.role) {
            navigate('/my-orders');
            return;
        }
        
        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        authAPI.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
            <div className="px-4 py-6 sm:px-0">
                <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Welcome to Jewel Dashboard
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            You have successfully logged in to your account.
                        </p>

                        {/* User Info Card */}
                        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Name:</span>
                                    <span className="font-medium">{user?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{user?.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phone:</span>
                                    <span className="font-medium">{user?.phoneNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email Verified:</span>
                                    <span className={`font-medium ${user?.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                                        {user?.isEmailVerified ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <div className="text-sm text-gray-500">
                                This is a basic dashboard. More features will be added based on your requirements.
                            </div>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    Refresh
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Dashboard;

