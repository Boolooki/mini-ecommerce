'use client';

import { useEffect, useState } from 'react';

const banners = ['/banner1.png', '/banner2.png'];

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000); // เปลี่ยนภาพทุก 5 วินาที
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-md">
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
        {banners.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Banner ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
