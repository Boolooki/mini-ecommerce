"use client";

import Link from "next/link";
import { useCart } from "../../contexts/CartContext";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useSuggestion } from "../../hooks/useSuggestion";
import { useAuth } from "@/app/contexts/AuthContext";
import { useState } from "react";

const Header = () => {
  const { cartLength } = useCart();
  const { query, setQuery, suggestions } = useSuggestion();
  const { isAuthenticated, logout, userRole } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
      <nav className="container mx-auto px-4">
        {/* Desktop & Mobile Top Bar */}
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xl lg:text-2xl font-bold hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-lg lg:text-xl font-black">M</span>
            </div>
            <span className="hidden sm:inline">Mini E-commerce</span>
            <span className="sm:hidden">Mini Shop</span>
          </Link>

          {/* Desktop Search Box */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า ลองพิมพ์ชื่อสินค้าหรือหมวดหมู่..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-5 py-3 pr-12 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md bg-white"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors">
                  <MagnifyingGlassIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Suggestion Dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white text-gray-800 shadow-xl rounded-xl mt-2 overflow-hidden z-20 border border-gray-100">
                  {suggestions.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setQuery(item.text);
                      }}
                      className="px-5 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{item.text}</span>
                        <span className="text-xs text-white bg-orange-500 px-2 py-1 rounded-full">
                          {item.type === "name" ? "สินค้า" : "แท็ก"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <Link 
              href="/products" 
              className="px-4 py-2 hover:bg-white/10 rounded-lg transition-all font-medium"
            >
              สินค้าทั้งหมด
            </Link>

            <Link 
              href="/cart" 
              className="relative p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <ShoppingCartIcon className="w-7 h-7" />
              {cartLength > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-pulse">
                  {cartLength}
                </span>
              )}
            </Link>

            {userRole === "admin" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-orange-600 px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-orange-50 active:scale-95 transition-all"
              >
                <ShieldCheckIcon className="h-5 w-5" />
                <span className="hidden xl:inline">Admin</span>
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 text-sm font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
              >
                <UserCircleIcon className="h-5 w-5" />
                ออกจากระบบ
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-orange-600 px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-orange-50 active:scale-95 transition-all"
              >
                <UserCircleIcon className="h-5 w-5" />
                เข้าสู่ระบบ
              </Link>
            )}
          </div>

          {/* Mobile Icons */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>

            {/* Mobile Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-lg transition-all">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartLength > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartLength}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4 animate-slideDown">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md bg-white"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {/* Mobile Suggestions */}
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white text-gray-800 shadow-xl rounded-xl mt-2 overflow-hidden z-20 max-h-64 overflow-y-auto">
                  {suggestions.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setQuery(item.text);
                        setIsSearchOpen(false);
                      }}
                      className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{item.text}</span>
                        <span className="text-xs text-white bg-orange-500 px-2 py-1 rounded-full">
                          {item.type === "name" ? "สินค้า" : "แท็ก"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/20 animate-slideDown">
            <div className="flex flex-col gap-3">
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 hover:bg-white/10 rounded-lg transition-all font-medium"
              >
                📦 สินค้าทั้งหมด
              </Link>

              {userRole === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 hover:bg-white/10 rounded-lg transition-all font-medium flex items-center gap-2"
                >
                  <ShieldCheckIcon className="h-5 w-5" />
                  แดชบอร์ดผู้ดูแลระบบ
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all font-medium text-left flex items-center gap-2"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  ออกจากระบบ
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 bg-white text-orange-600 hover:bg-orange-50 rounded-lg transition-all font-semibold flex items-center gap-2 shadow-md"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;