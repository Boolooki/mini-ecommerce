import { POST } from "./route";
import { supabase } from "@/app/libs/supabase";
import bcrypt from "bcrypt";

// Mock dependencies
jest.mock("@/app/libs/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

describe("POST /api/auth/signup", () => {
  const userInput = {
    email: "test@example.com",
    password: "secretpw",
    name: "Tester",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if supabase returns error", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpw");

    (supabase.from as jest.Mock).mockReturnValue({
      insert: async () => ({ data: null, error: { message: "Insert failed" } }),
    });

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(userInput),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Insert failed");
  });

  it("should return success message if signup works", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpw");

    (supabase.from as jest.Mock).mockReturnValue({
      insert: async () => ({ data: [{ id: "123" }], error: null }),
    });

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(userInput),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("Signup successful");
    expect(bcrypt.hash).toHaveBeenCalledWith("secretpw", 10);
    expect(supabase.from).toHaveBeenCalledWith("users");
  });
});
