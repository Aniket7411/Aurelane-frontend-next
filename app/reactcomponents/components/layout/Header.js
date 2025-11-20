'use client';

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "../../lib/nextRouterAdapter";
import { CiSearch } from "react-icons/ci";
import { FaBars, FaTimes, FaHeart, FaChevronDown, FaUser, FaBox, FaSignOutAlt, FaCog, FaSearch } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { gemAPI } from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { CgProfile } from "react-icons/cg";

const gemstoneMenuSections = [
  {
    title: "Navratna",
    highlight: "text-emerald-600",
    items: [
      { label: "Blue Sapphire (Neelam)", category: "Blue Sapphire" },
      { label: "Yellow Sapphire (Pukhraj)", category: "Yellow Sapphire" },
      { label: "Ruby (Manik)", category: "Ruby" },
      { label: "Emerald (Panna)", category: "Emerald" },
      { label: "Diamond (Heera)", category: "Diamond" },
      { label: "Pearl (Moti)", category: "Pearl" },
      { label: "Red Coral (Moonga)", category: "Red Coral" },
      { label: "Gomed (Hessonite)", category: "Gomed" },
      { label: "Cat's Eye (Lehsunia)", category: "Cat's Eye" },
    ],
  },
  {
    title: "Exclusive Gemstones",
    highlight: "text-blue-600",
    items: [
      { label: "Alexandrite", category: "Alexandrite" },
      { label: "Basra Pearl", category: "Basra Pearl" },
      { label: "Burma Ruby", category: "Burma Ruby" },
      { label: "Zambian Emerald", category: "Zambian Emerald" },
      { label: "Tanzanite", category: "Tanzanite" },
      { label: "Paraiba Tourmaline", category: "Paraiba Tourmaline" },
    ],
  },
  {
    title: "Sapphire",
    highlight: "text-indigo-600",
    items: [
      { label: "Bi-Colour Sapphire (Pitambari)", category: "Pitambari Sapphire" },
      { label: "Blue Sapphire (Neelam)", category: "Blue Sapphire" },
      { label: "Color Change Sapphire", category: "Color Change Sapphire" },
      { label: "Pink Sapphire", category: "Pink Sapphire" },
      { label: "Yellow Sapphire", category: "Yellow Sapphire" },
    ],
  },
  {
    title: "More Vedic Ratna (Upratan)",
    highlight: "text-purple-600",
    items: [
      { label: "Amethyst", category: "Amethyst" },
      { label: "Aquamarine", category: "Aquamarine" },
      { label: "Blue Topaz", category: "Blue Topaz" },
      { label: "Peridot", category: "Peridot" },
      { label: "Garnet", category: "Garnet" },
    ],
  },
  {
    title: "Specific Collections",
    highlight: "text-rose-600",
    items: [
      { label: "Gemstone Pairs", category: "Gemstone Pair" },
      { label: "Gemstone Set", category: "Gemstone Set" },
      { label: "GRS Certified Gemstones", category: "GRS Certified" },
      { label: "Investment Grade Gems", category: "Investment Grade" },
    ],
  },
];

const birthstoneMenuSections = [
  {
    title: "Quarter 1",
    highlight: "text-sky-600",
    items: [
      { label: "January Birthstone", birthMonth: "January" },
      { label: "February Birthstone", birthMonth: "February" },
      { label: "March Birthstone", birthMonth: "March" },
    ],
  },
  {
    title: "Quarter 2",
    highlight: "text-teal-600",
    items: [
      { label: "April Birthstone", birthMonth: "April" },
      { label: "May Birthstone", birthMonth: "May" },
      { label: "June Birthstone", birthMonth: "June" },
    ],
  },
  {
    title: "Quarter 3",
    highlight: "text-amber-600",
    items: [
      { label: "July Birthstone", birthMonth: "July" },
      { label: "August Birthstone", birthMonth: "August" },
      { label: "September Birthstone", birthMonth: "September" },
    ],
  },
  {
    title: "Quarter 4",
    highlight: "text-pink-600",
    items: [
      { label: "October Birthstone", birthMonth: "October" },
      { label: "November Birthstone", birthMonth: "November" },
      { label: "December Birthstone", birthMonth: "December" },
    ],
  },
];

const getCategoryFilterValue = (item) => {
  if (!item) {
    return undefined;
  }

  const { category, label } = item;

  if (category) {
    if (category.includes("(")) {
      return category;
    }
    if (!label?.includes("(")) {
      return category;
    }
  }

  return label;
};

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const megaMenuTimeout = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (megaMenuTimeout.current) {
        clearTimeout(megaMenuTimeout.current);
      }
    };
  }, []);

  const openMegaMenu = (menu) => {
    if (megaMenuTimeout.current) {
      clearTimeout(megaMenuTimeout.current);
    }
    setActiveMegaMenu(menu);
  };

  const closeMegaMenuWithDelay = () => {
    if (megaMenuTimeout.current) {
      clearTimeout(megaMenuTimeout.current);
    }
    megaMenuTimeout.current = setTimeout(() => setActiveMegaMenu(null), 120);
  };

  const buildShopQueryString = (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === "string" && value.trim() === "") return;
      params.set(key, value);
    });
    return params.toString();
  };

  const navigateToShop = (filters = {}) => {
    const queryString = buildShopQueryString(filters);
    const path = queryString ? `/shop?${queryString}` : "/shop";
    navigate(path);
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    setSearchBarOpen(false);
  };

  const handleMegaMenuNavigation = ({ category, birthMonth, query } = {}) => {
    navigateToShop({ category, birthMonth, query });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fetch gem suggestions from API
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() && value.length >= 2) {
      setIsSearching(true);
      try {
        const response = await gemAPI.getGems({ search: value, limit: 5 });
        if (response.success) {
          const gems = response.data?.gems || response.gems || [];
          const gemNames = gems.map(gem => gem.name);
          setSuggestions(gemNames);
        }
      } catch (error) {
        console.error('Error fetching gem suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSelect = (gem) => {
    setSearchTerm(gem);
    setSuggestions([]);
    navigateToShop({ query: gem });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSuggestions([]);
      navigateToShop({ query: searchTerm.trim() });
    }
  };

  const handleSearchIconClick = () => {
    setSearchBarOpen(true);
    // Focus the input after animation
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 300);
  };

  const handleSearchClose = () => {
    setSearchBarOpen(false);
    setSearchTerm("");
    setSuggestions([]);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 py-3 sm:px-6 lg:px-8">
        {/* Mobile Header - Logo and Search Bar */}
        <div className="md:hidden mb-2">
          <div className="flex items-center gap-2">
            {/* Logo - smaller on mobile */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <img src="/images/aurelane.png" alt="Aurelane Logo" className="h-20 w-20 object-contain" />

              </Link>
            </div>

            {/* <div className="h-16 w-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-1.5 shadow-sm group-hover:shadow-md transition-shadow">
                  <img src="/images/aurelane.png" alt="Aurelane Logo" className="h-full w-full object-contain" />
                </div> */}

            {/* Spacer when search is closed - pushes icons to the right */}
            {!searchBarOpen && <div className="flex-1" />}

            {/* Mobile Search Bar - Animated */}
            {searchBarOpen && (
              <div className="flex-1 relative animate-slide-in-left">
                <form onSubmit={handleSearchSubmit}>
                  <div className="flex items-center border-2 border-gray-200 rounded-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-white shadow-sm hover:border-emerald-400 focus-within:border-emerald-500 focus-within:shadow-md transition-all duration-200">
                    <button
                      type="button"
                      onClick={handleSearchClose}
                      className="text-gray-400 hover:text-gray-600 mr-2"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                    <CiSearch className="text-gray-400 text-lg flex-shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search gems..."
                      className="ml-2 bg-transparent outline-none w-full text-sm text-gray-700 placeholder:text-gray-400"
                    />
                  </div>
                </form>

                {suggestions.length > 0 && (
                  <ul className="absolute mt-2 w-full bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50">
                    {isSearching && <li className="px-4 py-3 text-gray-500 text-sm text-center">Searching...</li>}
                    {suggestions.map((gem, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-700 transition-all duration-200 border-b border-gray-50 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                        onClick={() => handleSearchSelect(gem)}
                      >
                        <div className="flex items-center">
                          <CiSearch className="text-emerald-500 mr-3" />
                          <span className="font-medium text-gray-800">{gem}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Cart and Menu Icons - Pushed to the right */}
            <div className="flex items-center space-x-2 ml-auto">
              {/* Search Icon */}
              {!searchBarOpen && (
                <button
                  onClick={handleSearchIconClick}
                  className="p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                  title="Search"
                >
                  <FaSearch size={20} />
                </button>
              )}

              {/* Wishlist Icon - Only for buyers on mobile */}
              {isAuthenticated && (user?.role === "buyer" || !user?.role) && (
                <Link to="/wishlist" className="relative p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200" title="My Wishlist">
                  <FaHeart size={20} />
                </Link>
              )}

              <Link to="/cart" className="relative p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200" title="Cart">
                <FaShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated && (
                <Link
                  to={
                    user?.role === "admin" ? "/admin/sellers" :
                      user?.role === "seller" ? "/seller-dashboard" :
                        "/my-orders"
                  }
                  className="p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                  title="My Account"
                >
                  <CgProfile size={22} />
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
              >
                {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <img src="/images/aurelane.png" alt="Aurelane Logo" className="h-28 w-28 object-contain" />

            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 relative">
            {/* <Link
              to="/"
              className="relative px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 rounded-lg hover:bg-emerald-50 group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link> */}

            {/* Gemstones Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => openMegaMenu("gemstones")}
              onMouseLeave={closeMegaMenuWithDelay}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeMegaMenu === "gemstones" ? "text-emerald-600 bg-emerald-50 shadow-sm" : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"}`}
              >
                Gemstones
                <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMegaMenu === "gemstones" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {activeMegaMenu === "gemstones" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="fixed left-1/2 top-[108px] -translate-x-1/2 w-[min(1100px,calc(100vw-2rem))] px-4 z-[70]"
                    onMouseEnter={() => openMegaMenu("gemstones")}
                    onMouseLeave={closeMegaMenuWithDelay}
                  >
                    <div className="rounded-[32px] border border-slate-200 bg-gradient-to-b from-white via-white/95 to-white shadow-[0px_25px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
                      {gemstoneMenuSections.map((section) => (
                        <div key={section.title} className="space-y-3">
                          <p className={`text-xs font-semibold tracking-[0.08em] uppercase ${section.highlight}`}>{section.title}</p>
                          <ul className="rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden bg-white/70 shadow-inner">
                            {section.items.map((item) => {
                              const categoryValue = getCategoryFilterValue(item);
                              return (
                                <li key={item.label}>
                                  <button
                                    type="button"
                                    onClick={() => handleMegaMenuNavigation({ category: categoryValue, query: item.query })}
                                    className="w-full text-left text-sm text-slate-600 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50/70 hover:to-blue-50/70 px-4 py-2.5 transition-all duration-200 font-medium"
                                  >
                                    {item.label}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Birthstones Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => openMegaMenu("birthstones")}
              onMouseLeave={closeMegaMenuWithDelay}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeMegaMenu === "birthstones" ? "text-emerald-600 bg-emerald-50 shadow-sm" : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"}`}
              >
                Birthstones
                <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMegaMenu === "birthstones" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {activeMegaMenu === "birthstones" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="fixed left-1/2 top-[108px] -translate-x-1/2 w-[min(900px,calc(100vw-2rem))] px-4 z-[70]"
                    onMouseEnter={() => openMegaMenu("birthstones")}
                    onMouseLeave={closeMegaMenuWithDelay}
                  >
                    <div className="rounded-[32px] border border-slate-200 bg-gradient-to-b from-white via-white/95 to-white shadow-[0px_25px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                      {birthstoneMenuSections.map((section) => (
                        <div key={section.title} className="space-y-3">
                          <p className={`text-xs font-semibold tracking-[0.08em] uppercase ${section.highlight}`}>{section.title}</p>
                          <ul className="rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden bg-white/70 shadow-inner">
                            {section.items.map((item) => (
                              <li key={item.label}>
                                <button
                                  type="button"
                                  onClick={() => handleMegaMenuNavigation({ birthMonth: item.birthMonth })}
                                  className="w-full text-left text-sm text-slate-600 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50/70 hover:to-blue-50/70 px-4 py-2.5 transition-all duration-200 font-medium"
                                >
                                  {item.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/shop"
              className="relative px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 rounded-lg hover:bg-emerald-50 group"
            >
              Shop Gems
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/gemstones"
              className="relative px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 rounded-lg hover:bg-emerald-50 group"
            >
              About Gems
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {isAuthenticated && (
              <>
                {user?.role === "admin" && (
                  <Link
                    to="/admin-dashboard"
                    className="relative px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-blue-50 group"
                  >
                    Admin Dashboard
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
                {user?.role === "seller" && (
                  <>
                    <Link
                      to="/seller-dashboard"
                      className="relative px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 rounded-lg hover:bg-emerald-50 group"
                    >
                      Seller Dashboard
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link
                      to="/add-gem"
                      className="relative px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 rounded-lg hover:bg-emerald-50 group"
                    >
                      Add Gem
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </>
                )}
                {(user?.role === "buyer" || !user?.role) && (
                  <Link
                    to="/my-orders"
                    className="relative px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 rounded-lg hover:bg-emerald-50 group"
                  >
                    My Orders
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
              </>
            )}
            <Link
              to="/aboutus"
              className="relative px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 rounded-lg hover:bg-emerald-50 group"
            >
              About Aurelane
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Desktop Search bar - Animated */}
          {searchBarOpen && (
            <div className="relative hidden md:block w-72 animate-slide-in-left">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center border-2 border-gray-200 rounded-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-white shadow-sm hover:border-emerald-400 focus-within:border-emerald-500 focus-within:shadow-md transition-all duration-200">
                  <button
                    type="button"
                    onClick={handleSearchClose}
                    className="text-gray-400 hover:text-gray-600 mr-2"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                  <CiSearch className="text-gray-400 text-lg" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search gems..."
                    className="ml-3 bg-transparent outline-none w-full text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </form>

              {suggestions.length > 0 && (
                <ul className="absolute mt-2 w-full bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50">
                  {isSearching && <li className="px-4 py-3 text-gray-500 text-sm text-center">Searching...</li>}
                  {suggestions.map((gem, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-700 transition-all duration-200 border-b border-gray-50 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                      onClick={() => handleSearchSelect(gem)}
                    >
                      <div className="flex items-center">
                        <CiSearch className="text-emerald-500 mr-3" />
                        <span className="font-medium text-gray-800">{gem}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Cart and User menu */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search Icon */}
            {!searchBarOpen && (
              <button
                onClick={handleSearchIconClick}
                className="p-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
                title="Search"
              >
                <FaSearch className="w-5 h-5" />
              </button>
            )}

            {/* Wishlist Icon - Only for buyers */}
            {isAuthenticated && (user?.role === "buyer" || !user?.role) && (
              <Link
                to="/wishlist"
                className="relative p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                title="My Wishlist"
              >
                <FaHeart className="w-5 h-5" />
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
              title="Shopping Cart"
            >
              <FaShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Button with Dropdown */}
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-semibold">{user?.name || "User"}</span>
                  <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{user?.name || "User"}</p>
                          <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-xs rounded-full font-semibold capitalize shadow-md">
                        {user?.role || "Buyer"}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {user?.role === "admin" ? (
                        <>
                          <Link
                            to="/admin-dashboard"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 group"
                          >
                            <FaCog className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="text-sm font-medium">Admin Dashboard</span>
                          </Link>
                        </>
                      ) : user?.role === "seller" ? (
                        <>
                          <Link
                            to="/seller-dashboard"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-600 transition-all duration-200 group"
                          >
                            <FaCog className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="text-sm font-medium">My Dashboard</span>
                          </Link>
                          <Link
                            to="/seller-orders"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-600 transition-all duration-200"
                          >
                            <FaBox className="w-4 h-4" />
                            <span className="text-sm font-medium">My Orders</span>
                          </Link>
                          <Link
                            to="/seller-detail"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-600 transition-all duration-200"
                          >
                            <FaUser className="w-4 h-4" />
                            <span className="text-sm font-medium">My Profile</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/my-orders"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-600 transition-all duration-200"
                          >
                            <FaBox className="w-4 h-4" />
                            <span className="text-sm font-medium">My Orders</span>
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-600 transition-all duration-200"
                          >
                            <FaHeart className="w-4 h-4" />
                            <span className="text-sm font-medium">My Wishlist</span>
                          </Link>
                          <Link
                            to="/user-detail"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-600 transition-all duration-200"
                          >
                            <FaUser className="w-4 h-4" />
                            <span className="text-sm font-medium">My Profile</span>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-gray-100 py-2 bg-gradient-to-r from-red-50 to-pink-50">
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileDropdown(false);
                        }}
                        className="flex items-center space-x-3 px-5 py-3 text-red-600 hover:bg-red-100 transition-all duration-200 w-full rounded-lg mx-2 mb-1"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span className="text-sm font-semibold">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-semibold transition-all duration-200 rounded-lg hover:bg-emerald-50"
                >
                  Login
                </Link> */}
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl">
          <div className="p-5 space-y-4">
            {/* User Info Section - Only if authenticated */}
            {isAuthenticated && (
              <div className="pb-4 border-b border-gray-100 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 -mx-5 px-5 py-4 mb-4 rounded-b-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">👋 {user?.name || "User"}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{user?.email}</p>
                  </div>
                </div>
                <span className="inline-block mt-3 px-3 py-1 bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-xs rounded-full font-semibold capitalize shadow-md">
                  {user?.role || "Buyer"}
                </span>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase px-2 mb-3">Navigate</p>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-600 rounded-xl transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
              >
                <span>Home</span>
              </Link>

              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-600 rounded-xl transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
              >
                <span>Shop Gems</span>
              </Link>

              <Link
                to="/gemstones"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-600 rounded-xl transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
              >
                <span>About Gems</span>
              </Link>

              <Link
                to="/aboutus"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-600 rounded-xl transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
              >
                <span>About Aurelane</span>
              </Link>
            </div>

            {/* Role-Specific Quick Actions */}
            {isAuthenticated && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase px-2 mb-3">
                  {user?.role === "admin" ? "⚙️ Admin Tools" :
                    user?.role === "seller" ? "🏪 My Business" :
                      "👤 My Account"}
                </p>

                {user?.role === "admin" ? (
                  <>
                    <Link
                      to="/admin-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">📊</span>
                      <span>Admin Dashboard</span>
                    </Link>
                  </>
                ) : user?.role === "seller" ? (
                  <>
                    <Link
                      to="/seller-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      {/* <span className="text-lg">📊</span> */}
                      <span>My Dashboard</span>
                    </Link>
                    <Link
                      to="/seller-orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      {/* <span className="text-lg">📦</span> */}
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/add-gem"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">➕</span>
                      <span>Add New Gem</span>
                    </Link>
                    <Link
                      to="/seller-detail"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">✏️</span>
                      <span>Edit Profile</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/my-orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      {/* <span className="text-lg">📦</span> */}
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">❤️</span>
                      <span>Wishlist</span>
                    </Link>
                    <Link
                      to="/user-detail"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">👤</span>
                      <span>My Profile</span>
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Auth Section */}
            <div className="pt-3 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-center text-sm text-gray-500 mb-3">
                    Logged in as <span className="font-semibold text-emerald-600">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-xl w-full text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-emerald-400 px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Register Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
