"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import Image from "next/image";
import { 
  ShoppingCartIcon, 
  TrashIcon, 
  MinusIcon, 
  PlusIcon,
  CreditCardIcon,
  ArrowLeftIcon 
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect ไปหน้า Stripe Checkout
        window.location.href = data.url;
      } else {
        alert("เกิดข้อผิดพลาดในการสร้างการชำระเงิน");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6">
              <ShoppingCartIcon className="w-12 h-12 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ตะกร้าสินค้าว่างเปล่า
            </h2>
            <p className="text-gray-600 mb-8">
              ยังไม่มีสินค้าในตะกร้า เริ่มช้อปปิ้งกันเลย!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 active:scale-95 transition-all shadow-md"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              เลือกซื้อสินค้า
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            กลับไปเลือกสินค้า
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCartIcon className="w-8 h-8 text-orange-500" />
            ตะกร้าสินค้า
            <span className="text-lg text-gray-600 font-normal">
              ({itemCount} รายการ)
            </span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-lg font-bold text-orange-600">
                      ฿{item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-white rounded-md transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-white rounded-md transition-colors"
                      >
                        <PlusIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                      <TrashIcon className="w-4 h-4" />
                      ลบ
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-gray-600">ราคารวม</span>
                  <span className="text-lg font-bold text-gray-900">
                    ฿{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                สรุปคำสั่งซื้อ
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>ยอดรวมสินค้า</span>
                  <span>฿{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ค่าจัดส่ง</span>
                  <span className="text-green-600 font-medium">ฟรี</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    ยอดรวมทั้งหมด
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    ฿{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    กำลังประมวลผล...
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="w-6 h-6" />
                    ดำเนินการชำระเงิน
                  </>
                )}
              </button>

              <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  💳 วิธีการชำระเงิน
                </h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✓ บัตรเครดิต/เดบิต</li>
                  <li>✓ พร้อมเพย์</li>
                  <li>✓ ปลอดภัย 100% ด้วย Stripe</li>
                </ul>
              </div>

              <button
                onClick={clearCart}
                className="w-full mt-4 py-2 text-sm text-red-500 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg transition-colors"
              >
                ล้างตะกร้าสินค้า
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}