"use client";

import { useEffect, useState } from "react";
import { 
  ShoppingBagIcon, 
  ClockIcon, 
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

interface Order {
  id: string;
  order_id: string;
  customer_email: string;
  customer_name: string;
  items: any[];
  total: number;
  payment_status: string;
  shipping_status: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "shipped" | "delivered">("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateShippingStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipping_status: status }),
      });

      if (response.ok) {
        // Reload orders after update
        loadOrders();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    return order.shipping_status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <ClockIcon className="w-5 h-5" />;
      case "shipped": return <TruckIcon className="w-5 h-5" />;
      case "delivered": return <CheckCircleIcon className="w-5 h-5" />;
      case "cancelled": return <XCircleIcon className="w-5 h-5" />;
      default: return <ShoppingBagIcon className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "รอจัดส่ง";
      case "shipped": return "กำลังจัดส่ง";
      case "delivered": return "จัดส่งแล้ว";
      case "cancelled": return "ยกเลิก";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📦 จัดการคำสั่งซื้อ
            </h1>
            <p className="text-gray-600">
              คำสั่งซื้อทั้งหมด {orders.length} รายการ
            </p>
          </div>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
            รีเฟรช
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">รอจัดส่ง</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.shipping_status === "pending").length}
                </p>
              </div>
              <ClockIcon className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">กำลังจัดส่ง</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.shipping_status === "shipped").length}
                </p>
              </div>
              <TruckIcon className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">จัดส่งแล้ว</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.shipping_status === "delivered").length}
                </p>
              </div>
              <CheckCircleIcon className="w-10 h-10 text-green-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: "all", label: "ทั้งหมด" },
            { key: "pending", label: "รอจัดส่ง" },
            { key: "shipped", label: "กำลังจัดส่ง" },
            { key: "delivered", label: "จัดส่งแล้ว" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === item.key
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 hover:bg-orange-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">ไม่มีคำสั่งซื้อ</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        คำสั่งซื้อ #{order.order_id.slice(0, 16)}...
                      </h3>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.shipping_status)}`}>
                        {getStatusIcon(order.shipping_status)}
                        {getStatusText(order.shipping_status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      👤 {order.customer_name} • 📧 {order.customer_email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      📅 {new Date(order.created_at).toLocaleString("th-TH")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">
                      ฿{Number(order.total).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} รายการ
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">สินค้าในคำสั่งซื้อ:</h4>
                  <div className="space-y-2">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-gray-900">
                          ฿{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {order.shipping_status === "pending" && (
                    <button
                      onClick={() => updateShippingStatus(order.order_id, "shipped")}
                      className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      🚚 จัดส่งสินค้า
                    </button>
                  )}
                  {order.shipping_status === "shipped" && (
                    <button
                      onClick={() => updateShippingStatus(order.order_id, "delivered")}
                      className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      ✅ ยืนยันจัดส่งสำเร็จ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}