import { GET } from "./route";
import { supabaseAdmin } from "@/app/libs/supabase";
import { NextRequest } from "next/server";

// Mock Supabase
jest.mock("@/app/libs/supabase", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("GET /api/stats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return stats when supabase queries succeed", async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const mockOrders = [
      { total: 100, shipping_status: "pending", created_at: today.toISOString() },
      { total: 200, shipping_status: "shipped", created_at: today.toISOString() },
      { total: 300, shipping_status: "delivered", created_at: firstDayOfMonth.toISOString() },
    ];

    // Mock orders query
    (supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "orders") {
        return {
          select: () => ({ data: mockOrders, error: null }),
        };
      }
      if (table === "products") {
        return {
          select: () => ({ count: 5, error: null }),
        };
      }
    });

    const req = new NextRequest("http://localhost/api/stats");

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.stats.totalSales).toBe(600);
    expect(json.stats.totalOrders).toBe(3);
    expect(json.stats.totalProducts).toBe(5);
    expect(json.stats.pendingOrders).toBe(1);
    expect(json.stats.shippedOrders).toBe(1);
    expect(json.stats.deliveredOrders).toBe(1);
    expect(json.stats.todaySales).toBe(300); // two orders today
    expect(json.stats.monthlySales).toBe(600); // all three orders this month
  });

  it("should return 500 if orders query fails", async () => {
    (supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "orders") {
        return {
          select: () => ({ data: null, error: { message: "Orders error" } }),
        };
      }
      return { select: () => ({ count: 0, error: null }) };
    });

    const req = new NextRequest("http://localhost/api/stats");

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Orders error");
  });

  it("should return 500 if products query fails", async () => {
    (supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "orders") {
        return {
          select: () => ({ data: [], error: null }),
        };
      }
      if (table === "products") {
        return {
          select: () => ({ count: null, error: { message: "Products error" } }),
        };
      }
    });

    const req = new NextRequest("http://localhost/api/stats");

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Products error");
  });

  it("should return 500 if unexpected exception occurs", async () => {
    (supabaseAdmin.from as jest.Mock).mockImplementation(() => {
      throw new Error("Unexpected failure");
    });

    const req = new NextRequest("http://localhost/api/stats");

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Unexpected failure");
  });
});
