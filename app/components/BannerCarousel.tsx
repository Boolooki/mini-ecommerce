// BannerCarousel.tsx
'use client';

import { useEffect, useState } from 'react';

const banners = ['/banner1.png', '/banner2.png'];

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-orange-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
          {banners.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Banner ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === current ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          
          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === current 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;