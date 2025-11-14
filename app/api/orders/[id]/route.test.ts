import { PATCH } from "./route";
import { supabaseAdmin } from "@/app/libs/supabase";
import { NextRequest } from "next/server";

// Mock Supabase
jest.mock("@/app/libs/supabase", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("PATCH /api/orders/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockContext = {
    params: Promise.resolve({ id: "order123" }),
  };

  it("should update order and return data when successful", async () => {
    const mockOrder = { order_id: "order123", shipping_status: "shipped" };

    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: mockOrder, error: null }),
          }),
        }),
      }),
    });

    const req = new NextRequest("http://localhost/api/orders/order123", {
      method: "PATCH",
      body: JSON.stringify({ shipping_status: "shipped" }),
    });

    const res = await PATCH(req, mockContext);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.order).toEqual(mockOrder);
    expect(supabaseAdmin.from).toHaveBeenCalledWith("orders");
  });

  it("should return 500 if supabase returns error", async () => {
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: { message: "DB error" } }),
          }),
        }),
      }),
    });

    const req = new NextRequest("http://localhost/api/orders/order123", {
      method: "PATCH",
      body: JSON.stringify({ shipping_status: "shipped" }),
    });

    const res = await PATCH(req, mockContext);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("DB error");
  });

  it("should return 500 if unexpected exception occurs", async () => {
    (supabaseAdmin.from as jest.Mock).mockImplementation(() => {
      throw new Error("Unexpected failure");
    });

    const req = new NextRequest("http://localhost/api/orders/order123", {
      method: "PATCH",
      body: JSON.stringify({ shipping_status: "shipped" }),
    });

    const res = await PATCH(req, mockContext);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Unexpected failure");
  });
});
