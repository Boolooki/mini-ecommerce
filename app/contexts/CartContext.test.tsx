// contexts/CartContext.test.tsx
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import "@testing-library/jest-dom";

// สร้าง component สำหรับทดสอบการใช้ useCart
const TestComponent = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, cartLength, clearCart } = useCart();

  return (
    <div>
      <div data-testid="cart-length">{cartLength}</div>
      <div data-testid="cart-items">{JSON.stringify(cart)}</div>
      <button
        onClick={() =>
          addToCart({ id: "1", name: "Item A", price: 100, quantity: 1, image: "a.jpg", tags: [] })
        }
      >
        AddItem
      </button>
      <button onClick={() => removeFromCart("1")}>RemoveItem</button>
      <button onClick={() => updateQuantity("1", 5)}>UpdateQuantity</button>
      <button onClick={clearCart}>ClearCart</button>
    </div>
  );
};

describe("CartProvider & useCart", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should throw error if useCart used outside provider", () => {
    const Broken = () => {
      expect(() => useCart()).toThrow();
      return null;
    };
    render(<Broken />);
  });

  it("should start with empty cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    expect(screen.getByTestId("cart-length")).toHaveTextContent("0");
  });

  it("should add item to cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText("AddItem").click();
    });

    expect(screen.getByTestId("cart-length")).toHaveTextContent("1");
    expect(screen.getByTestId("cart-items")).toHaveTextContent("Item A");
  });

  it("should update quantity of existing item", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText("AddItem").click();
    });
    act(() => {
      screen.getByText("UpdateQuantity").click();
    });

    expect(screen.getByTestId("cart-length")).toHaveTextContent("5");
  });

  it("should remove item from cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText("AddItem").click();
    });
    act(() => {
      screen.getByText("RemoveItem").click();
    });

    expect(screen.getByTestId("cart-length")).toHaveTextContent("0");
  });

  it("should clear cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText("AddItem").click();
    });
    act(() => {
      screen.getByText("ClearCart").click();
    });

    expect(screen.getByTestId("cart-length")).toHaveTextContent("0");
    expect(localStorage.getItem("cart")).toBeNull();
  });

  it("should persist cart in localStorage", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText("AddItem").click();
    });

    expect(localStorage.getItem("cart")).toContain("Item A");
  });
});
