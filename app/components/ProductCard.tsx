// ProductCard.tsx
"use client";
import Link from "next/link";
import { useCart } from "../contexts/CartContext";
import Image from "next/image";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  quantity: number;
  description: string;
  tags: string[];
};

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [showAddedNotification, setShowAddedNotification] = useState(false);

  const itemCart = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    image: product.image,
    tags: product.tags,
  };

  const handleAddToCart = () => {
    addToCart(itemCart);
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 2000);
  };

  const isLowStock = product.quantity < 10;

  return (
    <div 
      className="group relative border border-gray-200 rounded-xl bg-white overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stock Badge */}
      {isLowStock && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
          เหลือน้อย!
        </div>
      )}

      {/* Added to Cart Notification */}
      {showAddedNotification && (
        <div className="absolute top-3 right-3 z-10 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg animate-bounce">
          ✓ เพิ่มลงตะกร้าแล้ว
        </div>
      )}

      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-md font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Product Name */}
          <h2 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm">
                  {i < Math.floor(product.rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Stock Info */}
          <p className={`text-sm mb-3 ${isLowStock ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
            {isLowStock ? `🔥 เหลือเพียง ${product.quantity} ชิ้น` : `มีสินค้า ${product.quantity} ชิ้น`}
          </p>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price */}
          <div className="mb-3">
            <div className="text-2xl font-bold text-orange-600">
              ฿{product.price.toLocaleString()}
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="p-4 pt-0 mt-auto">
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 px-4 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            🛒 เพิ่มลงตะกร้า
          </button>
          <Link 
            href={`/products/${product.id}`}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-green-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg text-center"
          >
            ซื้อเลย
          </Link>
        </div>
      </div>

      {/* Hover Overlay Effect */}
      <div className={`absolute inset-0 bg-orange-500/5 pointer-events-none transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
};

export default ProductCard;