// components/products/ProductDetailCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ProductDetailCard from "./ProductDetailCard";
import { useCart } from "../../contexts/CartContext";

// mock useCart
const mockAddToCart = jest.fn();
jest.mock("../../contexts/CartContext", () => ({
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

describe("ProductDetailCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product details correctly", () => {
    render(<ProductDetailCard product={product} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("This is a test product")).toBeInTheDocument();
    expect(screen.getByText(/⭐ 4.5/)).toBeInTheDocument();
    expect(screen.getByText("฿1,999")).toBeInTheDocument();
    expect(screen.getByText("#tech")).toBeInTheDocument();
    expect(screen.getByText("#new")).toBeInTheDocument();
  });

  it("renders product image with alt text", () => {
    render(<ProductDetailCard product={product} />);
    const img = screen.getByAltText("Test Product");
    expect(img).toBeInTheDocument();
  });

  it("calls addToCart when button clicked", () => {
    render(<ProductDetailCard product={product} />);
    const button = screen.getByRole("button", { name: "เพิ่มลงตะกร้า" });
    fireEvent.click(button);

    expect(mockAddToCart).toHaveBeenCalledWith({
      id: "p1",
      name: "Test Product",
      price: 1999,
      quantity: 1,
      image: "/test.jpg",
      tags: ["tech", "new"],
    });
  });

  it("renders quantity input with correct default and limits", () => {
    render(<ProductDetailCard product={product} />);
    const input = screen.getByLabelText("จำนวน") as HTMLInputElement;
    expect(input.value).toBe("1");
    expect(input.min).toBe("1");
    expect(input.max).toBe("5");
  });
});
