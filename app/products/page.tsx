// products/page.tsx
"use client";
import ProductCard from "@/app/components/ProductCard";
import { usePriceRange } from "@/app/hooks/usePriceRange";
import PriceFilter from "../components/products/PriceFilter";
import { filterProductsByTags } from "../utils/filterProducts";
import TagFilter from "@/app/components/products/TagFilter";
import { useTagFilter } from "../hooks/useTagFilter";
import StarFilter from "../components/products/StarFilter";
import { useStarFilter } from "../hooks/useStarFilter";
import { fetchProducts } from "../utils/fetchProducts";
import { FunnelIcon, XMarkIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const products = await fetchProducts();

const allTags = Array.from(
  new Set(products.flatMap((product) => product.tags))
);

export default function Products() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    isInRange,
    reset,
  } = usePriceRange(0, 100000);
  
  const { 
    selectedRating,
    updateRating,
    clearRating,
  } = useStarFilter();
  
  const { 
    selectedTags, 
    toggleTag, 
    showAll, 
    toggleShowAll, 
    visibleTags 
  } = useTagFilter(allTags);

  const filteredProducts = filterProductsByTags(
    products,
    selectedTags
  ).filter(
    (product) => 
      isInRange(product.price) && 
      (selectedRating == null || product.rating >= selectedRating)
  );

  const activeFiltersCount = 
    selectedTags.length + 
    (selectedRating !== null ? 1 : 0) + 
    (minPrice > 0 || maxPrice < 100000 ? 1 : 0);

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                สินค้าทั้งหมด
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                พบสินค้า {filteredProducts.length} รายการ
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden relative inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium shadow-md hover:bg-orange-600 active:scale-95 transition-all"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>กรอง</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6 relative">
          {/* Desktop Sidebar Filter */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32 space-y-4">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <AdjustmentsHorizontalIcon className="w-5 h-5" />
                      ตัวกรองสินค้า
                    </h2>
                    {activeFiltersCount > 0 && (
                      <span className="bg-white text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <StarFilter
                    selectedRating={selectedRating}
                    updateRating={updateRating}
                    clearRating={clearRating}
                  />
                  <div className="border-t border-gray-200 pt-6">
                    <PriceFilter
                      minPrice={minPrice}
                      maxPrice={maxPrice}
                      setMinPrice={setMinPrice}
                      setMaxPrice={setMaxPrice}
                    />
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <TagFilter
                      visibleTags={visibleTags}
                      selectedTags={selectedTags}
                      toggleTag={toggleTag}
                      showAll={showAll}
                      toggleShowAll={toggleShowAll}
                      totalTagCount={allTags.length}
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Overlay */}
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50 animate-fadeIn">
              <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl animate-slideInRight overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between z-10 shadow-md">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                    ตัวกรองสินค้า
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <StarFilter
                    selectedRating={selectedRating}
                    updateRating={updateRating}
                    clearRating={clearRating}
                  />
                  <div className="border-t border-gray-200 pt-6">
                    <PriceFilter
                      minPrice={minPrice}
                      maxPrice={maxPrice}
                      setMinPrice={setMinPrice}
                      setMaxPrice={setMaxPrice}
                    />
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <TagFilter
                      visibleTags={visibleTags}
                      selectedTags={selectedTags}
                      toggleTag={toggleTag}
                      showAll={showAll}
                      toggleShowAll={toggleShowAll}
                      totalTagCount={allTags.length}
                    />
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 active:scale-95 transition-all shadow-md"
                  >
                    แสดงสินค้า ({filteredProducts.length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <section className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  ไม่พบสินค้าที่ตรงกับเงื่อนไข
                </h3>
                <p className="text-gray-500">ลองปรับเงื่อนไขการค้นหาใหม่</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}