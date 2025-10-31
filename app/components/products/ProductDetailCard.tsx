import Image from "next/image";
import { useCart } from "../../contexts/CartContext";

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

export default function ProductDetailCard({ product }: { product: Product }) {
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
    <section className="bg-white px-4 py-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* 🖼️ Product Image */}
      <div className="flex flex-col items-center">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="rounded-lg object-cover shadow"
        />
        {/* 🔄 Carousel thumbnails (optional) */}
        <div className="flex gap-2 mt-4">
          {/* Add thumbnails here if needed */}
        </div>
      </div>

      {/* 📄 Product Info */}
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-sm text-gray-600 mt-2">{product.description}</p>

          {/* ⭐ Rating */}
          <p className="text-sm text-gray-500 mt-2">
            ⭐ {product.rating} ({product.reviews} รีวิว)
          </p>

          {/* 💰 Price */}
          <div className="mt-4">
            <span className="text-2xl font-semibold text-pink-600">
              ฿{product.price.toLocaleString()}
            </span>
            {/* Optional: original price + discount */}
            {/* <span className="line-through text-sm text-gray-400 ml-2">฿899.00</span> */}
            {/* <span className="text-sm text-red-500 ml-2">-36%</span> */}
          </div>

          {/* 🚚 Shipping Info */}
          <p className="text-xs text-gray-500 mt-2">
            จัดส่งจากร้านค้าอย่างเป็นทางการในกรุงเทพฯ
          </p>

          {/* 🏷️ Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 🛒 Add to Cart */}
        <div className="mt-6">
          <label
            htmlFor="quantity"
            className="text-sm text-gray-700 mb-1 block"
          >
            จำนวน
          </label>
          <input
            type="number"
            id="quantity"
            defaultValue={1}
            min={1}
            max={product.quantity}
            className="w-20 border rounded px-2 py-1 text-sm"
          />
          <button
            className="mt-4 w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
            onClick={() => addToCart(itemCart)}
          >
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </section>
  );
}
