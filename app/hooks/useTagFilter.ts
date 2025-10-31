import { useState } from "react";

export function useTagFilter(allTags: string[], initialVisibleCount = 8) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const clearTags = () => setSelectedTags([]);
  const toggleShowAll = () => setShowAll((prev) => !prev);

  const visibleTags = showAll ? allTags : allTags.slice(0, initialVisibleCount);

  return {
    selectedTags,
    toggleTag,
    clearTags,
    showAll,
    toggleShowAll,
    visibleTags,
    isTagSelected: (tag: string) => selectedTags.includes(tag),
  };
}
