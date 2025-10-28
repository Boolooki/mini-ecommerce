'use client';

import { useCart } from "../contexts/CartContext";

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

  const itemCart = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    image: product.image,
    tags: product.tags,
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 hover:shadow-md transition duration-200">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        <p className="text-sm text-gray-600">{product.description}</p>
        <p className="text-sm text-gray-700">⭐ {product.rating} ({product.reviews} รีวิว)</p>
        <p className="text-sm text-gray-700">คงเหลือ: {product.quantity} ชิ้น</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {product.tags.map(tag => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center gap-2">
        <div className="text-lg font-bold text-orange-600">
          ฿{product.price.toLocaleString()}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => addToCart(itemCart)}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-700 transition"
          >
            + Add to cart
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
