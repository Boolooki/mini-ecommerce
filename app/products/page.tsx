"use client";
import mockProducts from "@/app/data/products";
import ProductCard from "@/app/components/ProductCard";
import { usePriceRange } from "@/app/hooks/usePriceRange";
import PriceFilter from "../components/products/PriceFilter";

import { filterProductsByTags } from "../utils/filterProducts";
import TagFilter from "@/app/components/products/TagFilter";
import { useTagFilter } from "../hooks/useTagFilter";

import StarFilter from "../components/products/StarFilter";
import { useStarFilter } from "../hooks/useStarFilter";

const allTags = Array.from(
  new Set(mockProducts.flatMap((product) => product.tags))
);

export default function Products() {
  const {
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    isInRange,
    reset,
    rangeProps,
  } = usePriceRange(0, 100000);
  const { selectedRating,
    updateRating,
    clearRating,
    isMatch, } = useStarFilter();
  const { selectedTags, toggleTag, showAll, toggleShowAll, visibleTags } =
    useTagFilter(allTags);
  const filteredProducts = filterProductsByTags(
    mockProducts,
    selectedTags
  ).filter((product) => isInRange(product.price) && (selectedRating == null || product.rating >= selectedRating));
  return (
    <div className="bg-orange-50 min-h-screen px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">สินค้าในร้าน</h1>

      <div className="flex gap-6 max-w-7xl mx-auto">
        {/* 🔍 Sidebar Filter */}
        <aside className="w-64 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">กรองสินค้า</h2>
          <StarFilter
            selectedRating={selectedRating}
            updateRating={updateRating}
            clearRating={clearRating}
          />
          <TagFilter
            visibleTags={visibleTags}
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            showAll={showAll}
            toggleShowAll={toggleShowAll}
            totalTagCount={allTags.length}
          />
          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
          />
        </aside>

        {/* 🛍️ Product Grid */}
        <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </div>
    </div>
  );
}
