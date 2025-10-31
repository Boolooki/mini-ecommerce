import { useState } from "react";

export function useStarFilter(defaultRating: number | null = null) {
  const [selectedRating, setSelectedRating] = useState<number | null>(defaultRating);

  const updateRating = (rating: number) => {
    setSelectedRating(rating);
  };

  const clearRating = () => {
    setSelectedRating(null);
  };

  const isMatch = (productRating: number) => {
    if (selectedRating === null) return true;
    return productRating >= selectedRating;
  };

  return {
    selectedRating,
    updateRating,
    clearRating,
    isMatch,
  };
}
