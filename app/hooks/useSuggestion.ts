// hooks/useSuggestion.ts

import { useState, useEffect } from 'react';
import mockProducts from '../data/products';

export const useSuggestion = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 1) {
        const lowerQuery = query.toLowerCase();

        // รวม name + tags แล้ว filter
        const matches = mockProducts
          .flatMap(product => [product.name, ...product.tags])
          .filter(text => text.toLowerCase().includes(lowerQuery));

        // ลบคำซ้ำ
        const unique = Array.from(new Set(matches));

        setSuggestions(unique.slice(0, 6)); // จำกัดจำนวนคำแนะนำ
      } else {
        setSuggestions([]);
      }
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return { query, setQuery, suggestions };
};

