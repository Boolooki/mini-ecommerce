import { render, screen, fireEvent } from "@testing-library/react";
import Products from "./page";

// Mock child components
jest.mock("@/app/components/ProductCard", () => ({ product }: any) => (
  <div data-testid="product-card">{product.name}</div>
));
jest.mock("../components/products/PriceFilter", () => () => (
  <div data-testid="price-filter">PriceFilter</div>
));
jest.mock("@/app/components/products/TagFilter", () => () => (
  <div data-testid="tag-filter">TagFilter</div>
));
jest.mock("../components/products/StarFilter", () => () => (
  <div data-testid="star-filter">StarFilter</div>
));

// Mock hooks
jest.mock("../hooks/usePriceRange", () => ({
  usePriceRange: () => ({
    minPrice: 0,
    maxPrice: 100000,
    setMinPrice: jest.fn(),
    setMaxPrice: jest.fn(),
    isInRange: () => true,
    reset: jest.fn(),
  }),
}));
jest.mock("../hooks/useTagFilter", () => ({
  useTagFilter: () => ({
    selectedTags: [],
    toggleTag: jest.fn(),
    showAll: false,
    toggleShowAll: jest.fn(),
    visibleTags: [],
  }),
}));
jest.mock("../hooks/useStarFilter", () => ({
  useStarFilter: () => ({
    selectedRating: null,
    updateRating: jest.fn(),
    clearRating: jest.fn(),
  }),
}));

// Mock utils
jest.mock("../utils/filterProducts", () => ({
  filterProductsByTags: (products: any) => products,
}));
jest.mock("../utils/fetchProducts", () => ({
  fetchProducts: async () => [
    { id: 1, name: "Product A", price: 100, rating: 4, tags: ["tag1"] },
    { id: 2, name: "Product B", price: 200, rating: 5, tags: ["tag2"] },
  ],
}));

describe("Products Page", () => {
  it("renders header and product count", async () => {
    render(<Products />);
    expect(await screen.findByText("สินค้าทั้งหมด")).toBeInTheDocument();
    expect(await screen.findByText(/พบสินค้า 2 รายการ/)).toBeInTheDocument();
  });

  it("renders ProductCard components when products exist", async () => {
    render(<Products />);
    const cards = await screen.findAllByTestId("product-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Product A");
    expect(cards[1]).toHaveTextContent("Product B");
  });

  it("shows empty state when no products", async () => {
    // Override fetchProducts mock to return empty
    jest.mock("../utils/fetchProducts", () => ({
      fetchProducts: async () => [],
    }));
    const { default: EmptyProducts } = await import("./page");
    render(<EmptyProducts />);
    expect(await screen.findByText("ไม่พบสินค้าที่ตรงกับเงื่อนไข")).toBeInTheDocument();
  });

  it("toggles mobile filter overlay", async () => {
    render(<Products />);
    const toggleBtn = await screen.findByRole("button", { name: /กรอง/ });
    fireEvent.click(toggleBtn);
    expect(await screen.findByText("ตัวกรองสินค้า")).toBeInTheDocument();
    // Close overlay
    const closeBtn = screen.getByRole("button", { name: "" }); // XMarkIcon button
    fireEvent.click(closeBtn);
    expect(screen.queryByText("ตัวกรองสินค้า")).not.toBeInTheDocument();
  });
});
