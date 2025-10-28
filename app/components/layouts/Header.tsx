'use client';
// Components/layout/Header.tsx
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSuggestion } from '../../hooks/useSuggestion';


const Header = () => {
  const { cartLength } = useCart();
  const { query, setQuery, suggestions } = useSuggestion();
  return (
    <header className="sticky top-0 z-50 w-full bg-orange-500 text-white shadow-md">
      <nav className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-3 items-center">
          {/* Left: Logo */}
          <div>
            <Link href="/" className="text-xl font-bold">
              Mini E-commerce
            </Link>
          </div>

          {/* Center: Search Box */}
          <div className="flex justify-center bg-white rounded-md">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-md text-black focus:outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {/* Suggestion Dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white text-black shadow-md rounded-md mt-1 z-10">
                  {suggestions.map((item, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                      onClick={() => setQuery(item)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right: Links + Cart */}
          <div className="flex justify-end items-center gap-6">
            <Link href="/products" className="hover:text-gray-200">
              Products
            </Link>

            <Link href="/cart" className="relative hover:text-gray-200">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartLength > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartLength}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
