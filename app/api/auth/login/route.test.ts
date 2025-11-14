// route.test.ts
import { POST } from "./route";
import { supabase } from "@/app/libs/supabase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("@/app/libs/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("POST /api/auth/login", () => {
  const JWT_SECRET = "testsecret";
  const user = {
    id: "123",
    email: "test@example.com",
    role: "user",
    password_hash: "hashedpw",
  };

  beforeEach(() => {
    process.env.JWT_SECRET = JWT_SECRET;
    jest.clearAllMocks();
  });

  it("should return 401 if user not found", async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: () => ({
        eq: () => ({
          limit: async () => ({ data: [], error: null }),
        }),
      }),
    });

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ email: "notfound@example.com", password: "pw" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Invalid credentials");
  });

  it("should return 401 if password is invalid", async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: () => ({
        eq: () => ({
          limit: async () => ({ data: [user], error: null }),
        }),
      }),
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ email: user.email, password: "wrongpw" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Invalid credentials");
  });

  it("should return token if login success", async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: () => ({
        eq: () => ({
          limit: async () => ({ data: [user], error: null }),
        }),
      }),
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mocktoken");

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ email: user.email, password: "correctpw" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.token).toBe("mocktoken");
  });
});
