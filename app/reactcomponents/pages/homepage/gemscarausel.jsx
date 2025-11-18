'use client';

import React from "react";
import styles from "./gemscarausel.module.css";

const gems = [
  { name: "Blue Topaz", src: "/gemimages/bluetopaz.png" },
  { name: "Carnelian", src: "/gemimages/carnelianstone.png" },
  { name: "Citrine", src: "/gemimages/citrinestone.png" },
  { name: "Peridot", src: "/gemimages/peridotstone.png" },
  { name: "Rose Quartz", src: "/gemimages/rosequartz.png" },
  { name: "Amethyst", src: "/gemimages/amethuststone.png" },
];

const GemsCarousel = () => {
  return (
    <div className={styles["gems-carousel-container"]}>
      <div className={styles["gems-track"]}>
        {/* Render multiple copies for seamless infinite loop */}
        {[...Array(3)].map((_, copyIndex) =>
          gems.map((gem, index) => (
            <div key={`${copyIndex}-${index}`} className={styles["gem-item"]}>
              <img src={gem.src} alt={gem.name} />
              <p>{gem.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GemsCarousel;
