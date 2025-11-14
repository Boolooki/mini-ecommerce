// components/ProductCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "./ProductCard";
import { useCart } from "../contexts/CartContext";

// mock useCart
const mockAddToCart = jest.fn();
jest.mock("../contexts/CartContext", () => ({
  useCart: () => ({ addToCart: mockAddToCart }),
}));

const product = {
  id: "p1",
  name: "Test Product",
  price: 1999,
  category: "electronics",
  image: "/test.jpg",
  rating: 4.5,
  reviews: 12,
  quantity: 5,
  description: "This is a test product",
  tags: ["tech", "new"],
};

describe("ProductCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product details correctly", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("🔥 เหลือเพียง 5 ชิ้น")).toBeInTheDocument();
    expect(screen.getByText("฿1,999")).toBeInTheDocument();
    expect(screen.getByText("tech")).toBeInTheDocument();
    expect(screen.getByText("new")).toBeInTheDocument();
  });

  it("renders stock badge when quantity < 10", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText("เหลือน้อย!")).toBeInTheDocument();
  });

  it("calls addToCart and shows notification when add button clicked", () => {
    render(<ProductCard product={product} />);
    const button = screen.getByRole("button", { name: /เพิ่มลงตะกร้า/i });
    fireEvent.click(button);

    expect(mockAddToCart).toHaveBeenCalledWith({
      id: "p1",
      name: "Test Product",
      price: 1999,
      quantity: 1,
      image: "/test.jpg",
      tags: ["tech", "new"],
    });

    expect(screen.getByText("✓ เพิ่มลงตะกร้าแล้ว")).toBeInTheDocument();
  });

  it("renders rating stars and reviews", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText("4.5 (12)")).toBeInTheDocument();
    // ตรวจสอบว่ามีดาว ★ และ ☆
    expect(screen.getAllByText("★").length).toBeGreaterThan(0);
  });

  it("renders buy now link", () => {
    render(<ProductCard product={product} />);
    const buyNowLink = screen.getByText("ซื้อเลย");
    expect(buyNowLink).toHaveAttribute("href", "/products/p1");
  });
});
