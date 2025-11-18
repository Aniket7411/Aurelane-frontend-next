'use client';

import React from "react";
import { Link, useNavigate } from "react-router-dom";

const rings = [
    { name: "Blue Sapphire", src: "/ringimages/bluesaffire.jpg" },
    { name: "Hessonite", src: "/ringimages/hessonite.jpg" },
    { name: "Natural Diamond", src: "/ringimages/naturaldimond.jpg" },
    { name: "Natural Alexandrite", src: "/ringimages/naturalexandrite.jpg" },
    { name: "Natural Fire Opal", src: "/ringimages/naturalfire.jpg" },
    { name: "Natural Pearl", src: "/ringimages/naturalpearl.jpg" },
    { name: "Natural Zircon", src: "/ringimages/naturalzircon.jpg" },
    { name: "Pitambari", src: "/ringimages/pitambari.jpg" },
    { name: "Red Coral", src: "/ringimages/redcoral.jpg" },
    { name: "Ruby Manik", src: "/ringimages/rubymanik.jpg" },
    { name: "Turquoise", src: "/ringimages/turquoise.jpg" },
    { name: "White Sapphire", src: "/ringimages/whitesaffire.jpg" },
    { name: "Yellow Sapphire", src: "/ringimages/yellowsaffire.jpg" },
];

const RingSection = () => {
    const navigate = useNavigate();

    const handleRingClick = (ringName) => {
        navigate(`/shop?query=${encodeURIComponent(ringName)}`);
    };

    return (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 py-10 px-2">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-700 to-teal-800 bg-clip-text text-transparent mb-4">
                Create Your Dream Jewelry
            </h2>

            <div className="flex flex-wrap justify-center gap-4">
                {rings.map((ring, index) => (
                    <div
                        key={index}
                        className="w-[45%] sm:w-1/3 md:w-1/4 lg:w-1/5 flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:scale-105 transition-all duration-300 border border-emerald-100 hover:border-emerald-300 hover:shadow-lg cursor-pointer"
                        onClick={() => handleRingClick(ring.name)}
                    >
                        <img
                            src={ring.src}
                            alt={ring.name}
                            className="w-40 h-40 object-cover rounded-md"
                        />
                        <p className="mt-3 font-medium text-emerald-800 text-center">{ring.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RingSection;
