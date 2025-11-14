import { GET } from "./route";
import { supabaseAdmin } from "@/app/libs/supabase";
import { NextRequest } from "next/server";

// Mock Supabase
jest.mock("@/app/libs/supabase", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("GET /api/orders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return orders when supabase query succeeds", async () => {
    const mockOrders = [
      { id: 1, created_at: "2025-11-14T10:00:00Z", total: 100 },
      { id: 2, created_at: "2025-11-13T09:00:00Z", total: 200 },
    ];

    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: () => ({
        order: async () => ({ data: mockOrders, error: null }),
      }),
    });

    const req = new NextRequest("http://localhost/api/orders");

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.orders).toEqual(mockOrders);
    expect(supabaseAdmin.from).toHaveBeenCalledWith("orders");
  });

  it("should return 500 if supabase returns error", async () => {
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: () => ({
        order: async () => ({ data: null, error: { message: "DB error" } }),
      }),
    });

    const req = new NextRequest("http://localhost/api/orders");

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("DB error");
  });

  it("should return 500 if unexpected exception occurs", async () => {
    (supabaseAdmin.from as jest.Mock).mockImplementation(() => {
      throw new Error("Unexpected failure");
    });

    const req = new NextRequest("http://localhost/api/orders");

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Unexpected failure");
  });
});
