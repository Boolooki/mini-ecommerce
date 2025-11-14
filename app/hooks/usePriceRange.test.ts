// hooks/usePriceRange.test.ts
import { renderHook, act } from "@testing-library/react";
import { usePriceRange } from "./usePriceRange";

describe("usePriceRange", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => usePriceRange(0, 5000, 50));
    expect(result.current.minPrice).toBe(0);
    expect(result.current.maxPrice).toBe(5000);
    expect(result.current.rangeProps.step).toBe(50);
  });

  it("should update minPrice safely (not greater than maxPrice)", () => {
    const { result } = renderHook(() => usePriceRange(0, 1000));

    act(() => {
      result.current.setMinPrice(500);
    });
    expect(result.current.minPrice).toBe(500);

    act(() => {
      result.current.setMinPrice(2000); // > maxPrice
    });
    expect(result.current.minPrice).toBe(1000); // capped at maxPrice
  });

  it("should update maxPrice safely (not less than minPrice)", () => {
    const { result } = renderHook(() => usePriceRange(0, 1000));

    act(() => {
      result.current.setMaxPrice(800);
    });
    expect(result.current.maxPrice).toBe(800);

    act(() => {
      result.current.setMaxPrice(-10); // < minPrice
    });
    expect(result.current.maxPrice).toBe(result.current.minPrice); // capped at minPrice
  });

  it("should reset to defaults", () => {
    const { result } = renderHook(() => usePriceRange(100, 2000));

    act(() => {
      result.current.setMinPrice(500);
      result.current.setMaxPrice(1500);
    });
    expect(result.current.minPrice).toBe(500);
    expect(result.current.maxPrice).toBe(1500);

    act(() => {
      result.current.reset();
    });
    expect(result.current.minPrice).toBe(100);
    expect(result.current.maxPrice).toBe(2000);
  });

  it("should correctly check isInRange", () => {
    const { result } = renderHook(() => usePriceRange(100, 1000));

    expect(result.current.isInRange(500)).toBe(true);
    expect(result.current.isInRange(50)).toBe(false);
    expect(result.current.isInRange(1500)).toBe(false);
  });

  it("should expose rangeProps with current values", () => {
    const { result } = renderHook(() => usePriceRange(0, 1000, 25));

    expect(result.current.rangeProps.min).toBe(0);
    expect(result.current.rangeProps.max).toBe(1000);
    expect(result.current.rangeProps.step).toBe(25);

    act(() => {
      result.current.setMinPrice(300);
      result.current.setMaxPrice(700);
    });

    expect(result.current.rangeProps.minPrice).toBe(300);
    expect(result.current.rangeProps.maxPrice).toBe(700);
  });
});
