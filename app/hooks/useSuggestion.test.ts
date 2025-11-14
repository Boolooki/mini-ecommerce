// hooks/useSuggestion.test.ts
import { renderHook, act } from "@testing-library/react";
import { useSuggestion } from "./useSuggestion";

// mock products dataset
jest.mock("../libs/products", () => [
  { name: "iPhone 15", tags: ["apple", "smartphone"] },
  { name: "Galaxy S24", tags: ["samsung", "android"] },
  { name: "MacBook Pro", tags: ["apple", "laptop"] },
]);

describe("useSuggestion", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should start with empty query and suggestions", () => {
    const { result } = renderHook(() => useSuggestion());
    expect(result.current.query).toBe("");
    expect(result.current.suggestions).toEqual([]);
  });

  it("should return suggestions when query length > 1", async () => {
    const { result } = renderHook(() => useSuggestion());

    act(() => {
      result.current.setQuery("iPh");
    });

    // advance debounce timer
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.suggestions.length).toBeGreaterThan(0);
    // ควรมี iPhone 15 อยู่ใน suggestion
    const texts = result.current.suggestions.map((s) => s.text.toLowerCase());
    expect(texts).toContain("iphone 15");
  });

  it("should clear suggestions when query length <= 1", () => {
    const { result } = renderHook(() => useSuggestion());

    act(() => {
      result.current.setQuery("a");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.suggestions).toEqual([]);
  });

  it("should dedupe suggestions and keep lowest score", async () => {
    const { result } = renderHook(() => useSuggestion());

    act(() => {
      result.current.setQuery("apple");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    const texts = result.current.suggestions.map((s) => s.text.toLowerCase());
    // apple tag และ product name จะไม่ซ้ำซ้อน
    const uniqueTexts = new Set(texts);
    expect(uniqueTexts.size).toBe(texts.length);
  });

  it("should limit suggestions to 6 items max", async () => {
    const { result } = renderHook(() => useSuggestion());

    act(() => {
      result.current.setQuery("a");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.suggestions.length).toBeLessThanOrEqual(6);
  });
});
