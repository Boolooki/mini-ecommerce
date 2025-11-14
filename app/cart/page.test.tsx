import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CartPage from "./page";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock useAuth
jest.mock("../app/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock useCart
jest.mock("../app/contexts/CartContext", () => ({
  useCart: jest.fn(),
}));

// Mock next/image (ให้มัน render <img> ธรรมดา)
jest.mock("next/image", () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

describe("CartPage", () => {
  const { useAuth } = require("../app/contexts/AuthContext");
  const { useCart } = require("../app/contexts/CartContext");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to login if not authenticated", () => {
    const pushMock = jest.fn();
    jest.mock("next/navigation", () => ({
      useRouter: () => ({ push: pushMock }),
    }));

    useAuth.mockReturnValue({ isAuthenticated: false });
    useCart.mockReturnValue({ cart: [], removeFromCart: jest.fn(), updateQuantity: jest.fn(), clearCart: jest.fn() });

    render(<CartPage />);
    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  it("renders empty cart message when cart is empty", () => {
    useAuth.mockReturnValue({ isAuthenticated: true });
    useCart.mockReturnValue({ cart: [], removeFromCart: jest.fn(), updateQuantity: jest.fn(), clearCart: jest.fn() });

    render(<CartPage />);
    expect(screen.getByText("ตะกร้าสินค้าว่างเปล่า")).toBeInTheDocument();
    expect(screen.getByText("ยังไม่มีสินค้าในตะกร้า เริ่มช้อปปิ้งกันเลย!")).toBeInTheDocument();
  });

  it("renders cart items and summary when cart has products", () => {
    useAuth.mockReturnValue({ isAuthenticated: true });
    useCart.mockReturnValue({
      cart: [
        { id: "1", name: "Product A", price: 100, quantity: 2, image: "/img.png", tags: ["tag1"] },
      ],
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
    });

    render(<CartPage />);
    expect(screen.getByText("ตะกร้าสินค้า")).toBeInTheDocument();
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("฿100")).toBeInTheDocument();
    expect(screen.getByText("ราคารวม")).toBeInTheDocument();
    expect(screen.getByText("สรุปคำสั่งซื้อ")).toBeInTheDocument();
  });

  it("calls updateQuantity when clicking plus/minus", () => {
    const updateQuantityMock = jest.fn();
    useAuth.mockReturnValue({ isAuthenticated: true });
    useCart.mockReturnValue({
      cart: [{ id: "1", name: "Product A", price: 100, quantity: 2, image: "/img.png" }],
      removeFromCart: jest.fn(),
      updateQuantity: updateQuantityMock,
      clearCart: jest.fn(),
    });

    render(<CartPage />);
    fireEvent.click(screen.getByRole("button", { name: "" })); // plus button
    expect(updateQuantityMock).toHaveBeenCalled();
  });

  it("calls removeFromCart when clicking remove", () => {
    const removeMock = jest.fn();
    useAuth.mockReturnValue({ isAuthenticated: true });
    useCart.mockReturnValue({
      cart: [{ id: "1", name: "Product A", price: 100, quantity: 1, image: "/img.png" }],
      removeFromCart: removeMock,
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
    });

    render(<CartPage />);
    fireEvent.click(screen.getByText("ลบ"));
    expect(removeMock).toHaveBeenCalledWith("1");
  });

  it("calls clearCart when clicking clear cart button", () => {
    const clearMock = jest.fn();
    useAuth.mockReturnValue({ isAuthenticated: true });
    useCart.mockReturnValue({
      cart: [{ id: "1", name: "Product A", price: 100, quantity: 1, image: "/img.png" }],
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: clearMock,
    });

    render(<CartPage />);
    fireEvent.click(screen.getByText("ล้างตะกร้าสินค้า"));
    expect(clearMock).toHaveBeenCalled();
  });

  it("handles checkout success", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ url: "http://stripe.com/checkout" }),
      })
    ) as any;

    delete (window as any).location;
    (window as any).location = { href: "" };

    useAuth.mockReturnValue({ isAuthenticated: true });
    useCart.mockReturnValue({
      cart: [{ id: "1", name: "Product A", price: 100, quantity: 1, image: "/img.png" }],
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
    });

    render(<CartPage />);
    fireEvent.click(screen.getByText("ดำเนินการชำระเงิน"));

    await waitFor(() => {
      expect(window.location.href).toBe("http://stripe.com/checkout");
    });
  });
});
