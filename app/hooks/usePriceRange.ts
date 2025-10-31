import { useState, useMemo } from "react";

export function usePriceRange(
  defaultMin = 0,
  defaultMax = 100000,
  step = 100
) {
  const [minPrice, setMinPrice] = useState(defaultMin);
  const [maxPrice, setMaxPrice] = useState(defaultMax);

  // ป้องกัน min > max และ max < min
  const updateMin = (value: number) => {
    const safeValue = Math.min(value, maxPrice);
    setMinPrice(Math.max(defaultMin, safeValue));
  };

  const updateMax = (value: number) => {
    const safeValue = Math.max(value, minPrice);
    setMaxPrice(Math.min(defaultMax, safeValue));
  };

  const reset = () => {
    setMinPrice(defaultMin);
    setMaxPrice(defaultMax);
  };

  // ใช้กรองสินค้า
  const isInRange = (price: number) =>
    price >= minPrice && price <= maxPrice;

  // ใช้กับ slider หรือ input
  const rangeProps = useMemo(
    () => ({
      min: defaultMin,
      max: defaultMax,
      step,
      minPrice,
      maxPrice,
      setMinPrice: updateMin,
      setMaxPrice: updateMax,
    }),
    [minPrice, maxPrice]
  );

  return {
    minPrice,
    maxPrice,
    setMinPrice: updateMin,
    setMaxPrice: updateMax,
    reset,
    isInRange,
    rangeProps,
  };
}
