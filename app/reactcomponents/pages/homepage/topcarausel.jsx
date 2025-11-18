'use client';

import React, { useState } from "react";
import { useToast } from "../../contexts/ToastContext";

export default function GemInquirySection() {
  const { showError, showWarning, showSuccess } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gemstone: "",
    details: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name || !formData.email || !formData.gemstone) {
      showWarning("Please fill in all required fields!");
      return;
    }

    setLoading(true);

    try {
      // Replace this URL with your backend API endpoint
      const response = await fetch("https://your-api.com/gem-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", gemstone: "", details: "" });
        showSuccess("Inquiry submitted successfully!");
      } else {
        showError("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showError("Error submitting form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen  relative flex items-center overflow-hidden">
      {/* Background Video */}
      <video
        src="/images/gemsvideo.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      ></video>

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 "></div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto gap-4 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-16">
        {/* LEFT SIDE - FORM */}
        <div className="lg:w-1/2 w-full bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-2xl mb-8 lg:mb-0 border border-emerald-100">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-800 bg-clip-text text-transparent mb-4 text-center lg:text-left">
            Ask About Your Gem
          </h2>
          <p className="text-gray-700 mb-6 text-center lg:text-left">
            Fill the form and we will get back to you with your dream gemstone.
          </p>

          {submitted ? (
            <div className="text-emerald-700 font-semibold text-center py-4">
              ✅ Thank you! Your inquiry has been submitted.
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
              <input
                type="text"
                name="gemstone"
                value={formData.gemstone}
                onChange={handleChange}
                placeholder="Gemstone Interested In"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="Additional Details"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-md font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>
          )}
        </div>

        {/* RIGHT SIDE - CONTENT */}
        <div className="lg:w-1/2 w-full relative">
          {/* Text Content */}
          <div className="flex flex-col justify-center px-6 lg:px-10 text-white space-y-6">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-wide">
              Unlock the Beauty of <span className="text-emerald-300">Natural Gems</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-100 leading-relaxed">
              Each gemstone holds a story — of passion, power, and purity. From rare sapphires to fiery rubies,
              we bring you treasures crafted by nature and polished to perfection.
            </p>
            <p className="text-base text-gray-200">
              Share your desire, and let our gem experts guide you to a piece that reflects your soul.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
