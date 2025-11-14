import { render, screen } from "@testing-library/react";
import ProductPage from "./page";

// Mock ProductDetailCard
jest.mock("../../components/products/ProductDetailCard", () => ({ product }: any) => (
  <div data-testid="product-detail">{product.name}</div>
));

// Mock fetchProducts
jest.mock("../../utils/fetchProducts", () => ({
  fetchProducts: async () => [
    { id: "1", name: "Product A" },
    { id: "2", name: "Product B" },
  ],
}));

// Mock useParams
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

import { useParams } from "next/navigation";

describe("ProductPage", () => {
  it("renders product detail when product exists", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<ProductPage />);
    expect(await screen.findByTestId("product-detail")).toHaveTextContent("Product A");
  });

  it("renders 'ไม่พบสินค้า' when product does not exist", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" });

    render(<ProductPage />);
    expect(await screen.findByText("ไม่พบสินค้า")).toBeInTheDocument();
  });
});
