'use client';

import { useCart } from '../contexts/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return <div className="p-4 text-center text-gray-500">ไม่มีสินค้าในตะกร้า</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">ตะกร้าสินค้า</h1>

      <ul className="space-y-2">
        {cart.map(item => (
          <li key={item.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">
                ฿{item.price.toLocaleString()} × {item.quantity}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2 py-1 bg-gray-200 rounded text-sm"
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 py-1 bg-gray-200 rounded text-sm"
              >
                ＋
              </button>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-sm text-red-500 hover:underline ml-4"
              >
                ลบ
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="text-right font-semibold">
        รวมทั้งหมด: ฿{total.toLocaleString()}
      </div>
    </div>
  );
}
