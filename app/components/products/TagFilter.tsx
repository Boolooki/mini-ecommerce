// components/products/TagFilter.tsx
export default function TagFilter({
  visibleTags,
  selectedTags,
  toggleTag,
  showAll,
  toggleShowAll,
  totalTagCount,
}: {
  visibleTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  showAll: boolean;
  toggleShowAll: () => void;
  totalTagCount: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">หมวดหมู่สินค้า</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={() => selectedTags.forEach(tag => toggleTag(tag))}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium"
          >
            ล้างทั้งหมด
          </button>
        )}
      </div>

      <div className="space-y-2">
        {visibleTags.map((tag) => (
          <label
            key={tag}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors group"
          >
            <input
              type="checkbox"
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-2 focus:ring-orange-500 cursor-pointer"
              checked={selectedTags.includes(tag)}
              onChange={() => toggleTag(tag)}
            />
            <span className="text-sm text-gray-700 group-hover:text-orange-700 font-medium">
              {tag}
            </span>
          </label>
        ))}
      </div>

      {totalTagCount > visibleTags.length && (
        <button
          onClick={toggleShowAll}
          className="mt-4 w-full py-2 text-sm text-orange-600 hover:text-orange-700 font-medium hover:bg-orange-50 rounded-lg transition-colors"
        >
          {showAll ? "แสดงน้อยลง ↑" : `ดูเพิ่มเติม (${totalTagCount - visibleTags.length}) ↓`}
        </button>
      )}
    </div>
  );
}