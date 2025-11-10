import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/libs/supabase";

export async function GET(req: NextRequest) {
  try {
    // ดึงยอดขายทั้งหมด
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("total, shipping_status, created_at");

    if (ordersError) throw ordersError;

    // ดึงจำนวนสินค้า
    const { count: productCount, error: productsError } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true });

    if (productsError) throw productsError;

    // คำนวณสถิติ
    const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.shipping_status === "pending").length;
    const shippedOrders = orders.filter(o => o.shipping_status === "shipped").length;
    const deliveredOrders = orders.filter(o => o.shipping_status === "delivered").length;

    // ยอดขายวันนี้
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySales = orders
      .filter(o => new Date(o.created_at) >= today)
      .reduce((sum, order) => sum + Number(order.total), 0);

    // ยอดขายเดือนนี้
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlySales = orders
      .filter(o => new Date(o.created_at) >= firstDayOfMonth)
      .reduce((sum, order) => sum + Number(order.total), 0);

    return NextResponse.json({
      stats: {
        totalSales,
        totalOrders,
        totalProducts: productCount || 0,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        todaySales,
        monthlySales,
      },
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}