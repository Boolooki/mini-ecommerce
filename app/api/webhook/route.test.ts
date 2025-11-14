import { POST } from "./route";
import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/app/libs/supabase";
import Stripe from "stripe";

// Mock headers
jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

// Mock Supabase
jest.mock("@/app/libs/supabase", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

// Mock Stripe
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

describe("POST /api/webhook", () => {
  let stripeMock: any;
  const { headers } = require("next/headers");

  beforeEach(() => {
    jest.clearAllMocks();
    stripeMock = new Stripe("fake_key", { apiVersion: "2025-10-29.clover" });
  });

  it("should return 400 if signature verification fails", async () => {
    headers.mockReturnValue({
      get: () => "fake-signature",
    });

    stripeMock.webhooks.constructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const req = new NextRequest("http://localhost/api/webhook", {
      method: "POST",
      body: "fake-body",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid signature");
  });

  it("should handle checkout.session.completed and save order", async () => {
    headers.mockReturnValue({
      get: () => "valid-signature",
    });

    const mockSession: any = {
      id: "sess_123",
      metadata: { items: JSON.stringify([{ name: "Product A", price: 100 }]) },
      customer_details: { email: "test@example.com", name: "Tester" },
      amount_total: 10000,
      payment_status: "paid",
    };

    stripeMock.webhooks.constructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: { object: mockSession },
    });

    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      insert: () => ({
        select: () => ({
          single: async () => ({ data: mockSession, error: null }),
        }),
      }),
    });

    const req = new NextRequest("http://localhost/api/webhook", {
      method: "POST",
      body: "fake-body",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    expect(supabaseAdmin.from).toHaveBeenCalledWith("orders");
  });

  it("should handle payment_intent.succeeded", async () => {
    headers.mockReturnValue({
      get: () => "valid-signature",
    });

    stripeMock.webhooks.constructEvent.mockReturnValue({
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_123" } },
    });

    const req = new NextRequest("http://localhost/api/webhook", {
      method: "POST",
      body: "fake-body",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
  });

  it("should handle payment_intent.payment_failed", async () => {
    headers.mockReturnValue({
      get: () => "valid-signature",
    });

    stripeMock.webhooks.constructEvent.mockReturnValue({
      type: "payment_intent.payment_failed",
      data: { object: { id: "pi_456" } },
    });

    const req = new NextRequest("http://localhost/api/webhook", {
      method: "POST",
      body: "fake-body",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
  });

  it("should return 500 on unexpected error", async () => {
    headers.mockImplementation(() => {
      throw new Error("Unexpected failure");
    });

    const req = new NextRequest("http://localhost/api/webhook", {
      method: "POST",
      body: "fake-body",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Unexpected failure");
  });
});
