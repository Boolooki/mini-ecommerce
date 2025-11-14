// utils/fetchProducts.test.ts
import { fetchProducts } from "./fetchProducts";
import { supabase } from "../libs/supabase";

// mock supabase
jest.mock("../libs/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn(),
  },
}));

describe("fetchProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns data when query succeeds", async () => {
    const mockData = [
      { id: "1", name: "Product A" },
      { id: "2", name: "Product B" },
    ];
    (supabase.select as jest.Mock).mockResolvedValueOnce({ data: mockData, error: null });

    const result = await fetchProducts();
    expect(result).toEqual(mockData);
    expect(supabase.from).toHaveBeenCalledWith("products");
    expect(supabase.select).toHaveBeenCalledWith("*");
  });

  it("throws error when query fails", async () => {
    const mockError = new Error("Database error");
    (supabase.select as jest.Mock).mockResolvedValueOnce({ data: null, error: mockError });

    await expect(fetchProducts()).rejects.toThrow("Database error");
  });
});
