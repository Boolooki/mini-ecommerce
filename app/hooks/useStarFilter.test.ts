// hooks/useStarFilter.test.ts
import { renderHook, act } from "@testing-library/react";
import { useStarFilter } from "./useStarFilter";

describe("useStarFilter", () => {
  it("should initialize with defaultRating = null", () => {
    const { result } = renderHook(() => useStarFilter());
    expect(result.current.selectedRating).toBeNull();
    expect(result.current.isMatch(3)).toBe(true); // ไม่มี filter → ทุก product ผ่าน
  });

  it("should initialize with a default rating", () => {
    const { result } = renderHook(() => useStarFilter(4));
    expect(result.current.selectedRating).toBe(4);
    expect(result.current.isMatch(5)).toBe(true);
    expect(result.current.isMatch(3)).toBe(false);
  });

  it("should update rating correctly", () => {
    const { result } = renderHook(() => useStarFilter());

    act(() => {
      result.current.updateRating(3);
    });

    expect(result.current.selectedRating).toBe(3);
    expect(result.current.isMatch(4)).toBe(true);
    expect(result.current.isMatch(2)).toBe(false);
  });

  it("should clear rating", () => {
    const { result } = renderHook(() => useStarFilter(5));

    act(() => {
      result.current.clearRating();
    });

    expect(result.current.selectedRating).toBeNull();
    expect(result.current.isMatch(1)).toBe(true); // กลับมา match ทุก product
  });

  it("should match productRating >= selectedRating", () => {
    const { result } = renderHook(() => useStarFilter());

    act(() => {
      result.current.updateRating(4);
    });

    expect(result.current.isMatch(4)).toBe(true);
    expect(result.current.isMatch(5)).toBe(true);
    expect(result.current.isMatch(3)).toBe(false);
  });
});
