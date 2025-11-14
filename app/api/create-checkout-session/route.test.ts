import { POST } from "./route";
import Stripe from "stripe";
import { NextRequest } from "next/server";

// Mock Stripe
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  }));
});

describe("POST /api/auth/checkout", () => {
  let stripeMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    stripeMock = new Stripe("fake_key", { apiVersion: "2025-10-29.clover" });
  });

  const mockItems = [
    { name: "Product A", price: 100, quantity: 2, image: "http://img.com/a.png" },
    { name: "Product B", price: 50, quantity: 1 },
  ];

  it("should create a checkout session successfully", async () => {
    // Mock session return
    stripeMock.checkout.sessions.create.mockResolvedValue({
      id: "sess_123",
      url: "http://stripe.com/checkout/sess_123",
    });

    const req = new NextRequest("http://localhost/api/auth/checkout", {
      method: "POST",
      body: JSON.stringify({ items: mockItems }),
      headers: { origin: "http://localhost:3000" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.sessionId).toBe("sess_123");
    expect(json.url).toBe("http://stripe.com/checkout/sess_123");

    // ตรวจสอบว่า Stripe ถูกเรียกด้วย line_items ที่ถูกต้อง
    expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              currency: "thb",
              product_data: expect.objectContaining({ name: "Product A" }),
              unit_amount: 10000, // 100 * 100
            }),
            quantity: 2,
          }),
        ]),
      })
    );
  });

  it("should return 500 if Stripe throws error", async () => {
    stripeMock.checkout.sessions.create.mockRejectedValue(new Error("Stripe failed"));

    const req = new NextRequest("http://localhost/api/auth/checkout", {
      method: "POST",
      body: JSON.stringify({ items: mockItems }),
      headers: { origin: "http://localhost:3000" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Stripe failed");
  });
});
