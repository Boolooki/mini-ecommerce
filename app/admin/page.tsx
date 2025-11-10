"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChartBarIcon,
  ShoppingBagIcon,
  CubeIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  CalendarIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";

interface Stats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  todaySales: number;
  monthlySales: number;
}

interface RecentOrder {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  shipping_status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const role = useAuth().userRole;

  useEffect(() => {
    if (role !== "admin") {
      window.location.href = "/";
    }
  }, [role]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const statsResponse = await fetch("/api/admin/stats");
      const statsData = await statsResponse.json();
      setStats(statsData.stats);

      // Load recent orders
      const ordersResponse = await fetch("/api/admin/recent-orders");
      const ordersData = await ordersResponse.json();
      setRecentOrders(ordersData.orders || []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "รอจัดส่ง";
      case "shipped": return "กำลังจัดส่ง";
      case "delivered": return "จัดส่งแล้ว";
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <ChartBarIcon className="w-8 h-8 text-orange-500" />
              แดชบอร์ดผู้ดูแลระบบ
            </h1>
            <p className="text-gray-600">ภาพรวมและสถิติของร้านค้า</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowPathIcon className="w-5 h-5" />
            รีเฟรช
          </button>
        </div>

        {/* Quick Stats - Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Sales */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <BanknotesIcon className="w-8 h-8" />
              </div>
              <ArrowTrendingUpIcon className="w-6 h-6 opacity-80" />
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">ยอดขายทั้งหมด</h3>
            <p className="text-3xl font-bold">
              ฿{stats?.totalSales.toLocaleString()}
            </p>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <ShoppingBagIcon className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">คำสั่งซื้อทั้งหมด</h3>
            <p className="text-3xl font-bold">{stats?.totalOrders}</p>
          </div>

          {/* Pending Orders */}
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <ClockIcon className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">รอจัดส่ง</h3>
            <p className="text-3xl font-bold">{stats?.pendingOrders}</p>
          </div>

          {/* Total Products */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <CubeIcon className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">สินค้าทั้งหมด</h3>
            <p className="text-3xl font-bold">{stats?.totalProducts}</p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Today Sales */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="w-6 h-6 text-green-500" />
              <h3 className="text-sm font-semibold text-gray-700">ยอดขายวันนี้</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ฿{stats?.todaySales.toLocaleString()}
            </p>
          </div>

          {/* Monthly Sales */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-2">
              <ChartBarIcon className="w-6 h-6 text-blue-500" />
              <h3 className="text-sm font-semibold text-gray-700">ยอดขายเดือนนี้</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ฿{stats?.monthlySales.toLocaleString()}
            </p>
          </div>

          {/* Delivery Progress */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-3">
              <TruckIcon className="w-6 h-6 text-orange-500" />
              <h3 className="text-sm font-semibold text-gray-700">สถานะการจัดส่ง</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">กำลังจัดส่ง</span>
                <span className="font-semibold text-blue-600">{stats?.shippedOrders}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">จัดส่งแล้ว</span>
                <span className="font-semibold text-green-600">{stats?.deliveredOrders}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/orders"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <ShoppingBagIcon className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">จัดการคำสั่งซื้อ</h3>
                <p className="text-sm text-gray-600">ดูและจัดการออเดอร์ทั้งหมด</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/products"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <CubeIcon className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">จัดการสินค้า</h3>
                <p className="text-sm text-gray-600">เพิ่ม แก้ไข ลบสินค้า</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/customers"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <ChartBarIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">รายงานยอดขาย</h3>
                <p className="text-sm text-gray-600">วิเคราะห์และรายงาน</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBagIcon className="w-6 h-6" />
              คำสั่งซื้อล่าสุด
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm text-white hover:text-orange-100 font-medium underline"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ShoppingBagIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>ยังไม่มีคำสั่งซื้อ</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          #{order.order_id.slice(0, 16)}...
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.shipping_status)}`}>
                          {getStatusText(order.shipping_status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        👤 {order.customer_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        📅 {new Date(order.created_at).toLocaleString("th-TH")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-orange-600">
                        ฿{Number(order.total).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}