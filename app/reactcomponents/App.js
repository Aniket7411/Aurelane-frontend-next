'use client';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';
import { CartProvider } from './contexts/CartContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SellerDashboard from './pages/SellerDashboard';
import SellerOrders from './pages/SellerOrders';
import AddGem from './pages/AddGem';
import EditGem from './pages/EditGem';
import GemDetail from './pages/GemDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Gemstones from './pages/Gemstones';
import Shop from './pages/Shop';
import MyOrders from './pages/MyOrders';
import AmanBirthday from './pages/AmanBirthday';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import OrderTracking from './pages/OrderTracking';
import Wishlist from './pages/Wishlist';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminBuyers from './pages/AdminBuyers';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyEmail from './components/auth/VerifyEmail';

// Layout Components
import AuthLayout from './components/layout/AuthLayout';
import MainLayout from './components/layout/MainLayout';
import AdminLogin from './components/auth/admin';
import SellerDetails from './components/admin/sellerdetail';
import AdminSellers from './components/admin/allsellers';
import SellerProfileSetup from './components/seller/seller';
import BuyerProfile from './pages/buyerprofile';
import AurelaneAbout from './pages/aboutus';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CancellationRefundPolicy from './pages/CancellationRefundPolicy';
import DeliveryServicePolicy from './pages/DeliveryServicePolicy';
import Contact from './pages/Contact';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return authAPI.isAuthenticated() ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect based on role if already authenticated)
const PublicRoute = ({ children }) => {
  if (!authAPI.isAuthenticated()) {
    return children;
  }

  const user = authAPI.getCurrentUser();
  if (user?.role === 'admin') {
    return <Navigate to="/admin-dashboard" />;
  } else if (user?.role === 'seller') {
    return <Navigate to="/seller-dashboard" />;
  } else {
    return <Navigate to="/" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <MainLayout>
                  <Home />
                </MainLayout>
              } />
              <Route path="/gemstones" element={
                <MainLayout>
                  <Gemstones />
                </MainLayout>
              } />
              <Route path="/shop" element={
                <MainLayout>
                  <Shop />
                </MainLayout>
              } />

              {/* Auth Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <Login />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/seller-login"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <Login />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <AdminLogin />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AdminDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/sellers"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AdminSellers />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/sellers/:sellerId"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SellerDetails />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/buyers"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AdminBuyers />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AdminProducts />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AdminOrders />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller-detail"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SellerProfileSetup />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <Register />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/seller"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <Register />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <ForgotPassword />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <PublicRoute>
                    <ResetPasswordPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/reset-password/:token"
                element={
                  <PublicRoute>
                    <ResetPassword />
                  </PublicRoute>
                }
              />
              <Route
                path="/verify-email/:token"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <VerifyEmail />
                    </AuthLayout>
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller-dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SellerDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller-orders"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SellerOrders />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-gem"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AddGem />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-gem/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <EditGem />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gem/:id"
                element={
                  <MainLayout>
                    <GemDetail />
                  </MainLayout>
                }
              />
              <Route
                path="/cart"
                element={
                  <MainLayout>
                    <Cart />
                  </MainLayout>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Wishlist />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <MainLayout>
                    <MyOrders />
                  </MainLayout>
                }
              />
              <Route
                path="/order-tracking/:orderId"
                element={
                  <MainLayout>
                    <OrderTracking />
                  </MainLayout>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <MainLayout>
                    <PaymentSuccess />
                  </MainLayout>
                }
              />
              <Route
                path="/payment-failure"
                element={
                  <MainLayout>
                    <PaymentFailure />
                  </MainLayout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Checkout />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-detail"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <BuyerProfile />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/aman_birthday"
                element={<AmanBirthday />}
              />
              <Route
                path="/aboutus"
                element={<MainLayout>
                  <AurelaneAbout />
                </MainLayout>}
              />
              <Route
                path="/terms-and-conditions"
                element={<MainLayout>
                  <TermsAndConditions />
                </MainLayout>}
              />
              <Route
                path="/privacy-policy"
                element={<MainLayout>
                  <PrivacyPolicy />
                </MainLayout>}
              />
              <Route
                path="/cancellation-refund-policy"
                element={<MainLayout>
                  <CancellationRefundPolicy />
                </MainLayout>}
              />
              <Route
                path="/delivery-service-policy"
                element={<MainLayout>
                  <DeliveryServicePolicy />
                </MainLayout>}
              />
              <Route
                path="/contact"
                element={<MainLayout>
                  <Contact />
                </MainLayout>}
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
