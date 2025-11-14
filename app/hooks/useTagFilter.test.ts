// hooks/useTagFilter.test.ts
import { renderHook, act } from "@testing-library/react";
import { useTagFilter } from "./useTagFilter";

const tags = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi"];

describe("useTagFilter", () => {
  it("should initialize with empty selectedTags and showAll=false", () => {
    const { result } = renderHook(() => useTagFilter(tags, 5));
    expect(result.current.selectedTags).toEqual([]);
    expect(result.current.showAll).toBe(false);
    expect(result.current.visibleTags).toEqual(tags.slice(0, 5));
  });

  it("should toggle a tag on and off", () => {
    const { result } = renderHook(() => useTagFilter(tags));

    act(() => {
      result.current.toggleTag("apple");
    });
    expect(result.current.selectedTags).toContain("apple");
    expect(result.current.isTagSelected("apple")).toBe(true);

    act(() => {
      result.current.toggleTag("apple");
    });
    expect(result.current.selectedTags).not.toContain("apple");
    expect(result.current.isTagSelected("apple")).toBe(false);
  });

  it("should clear all selected tags", () => {
    const { result } = renderHook(() => useTagFilter(tags));

    act(() => {
      result.current.toggleTag("banana");
      result.current.toggleTag("cherry");
    });
    expect(result.current.selectedTags).toEqual(["banana", "cherry"]);

    act(() => {
      result.current.clearTags();
    });
    expect(result.current.selectedTags).toEqual([]);
  });

  it("should toggle showAll and update visibleTags", () => {
    const { result } = renderHook(() => useTagFilter(tags, 3));

    expect(result.current.visibleTags).toEqual(tags.slice(0, 3));

    act(() => {
      result.current.toggleShowAll();
    });
    expect(result.current.showAll).toBe(true);
    expect(result.current.visibleTags).toEqual(tags);

    act(() => {
      result.current.toggleShowAll();
    });
    expect(result.current.showAll).toBe(false);
    expect(result.current.visibleTags).toEqual(tags.slice(0, 3));
  });

  it("should correctly report isTagSelected", () => {
    const { result } = renderHook(() => useTagFilter(tags));

    act(() => {
      result.current.toggleTag("kiwi");
    });
    expect(result.current.isTagSelected("kiwi")).toBe(true);
    expect(result.current.isTagSelected("apple")).toBe(false);
  });
});
