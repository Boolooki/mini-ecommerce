'use client';

import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline'; // ต้องติดตั้ง heroicons ก่อน

const Header = () => {
  const { cartLength } = useCart();

  return (
    <header className="w-full bg-orange-500 text-white shadow-md">
      <nav className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Mini E-commerce
          </Link>

          <div className="flex items-center gap-6">
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
