// components/products/StarFilter.tsx
type StarFilterProps = {
  selectedRating: number | null;
  updateRating: (rating: number) => void;
  clearRating: () => void;
};

export default function StarFilter({
  selectedRating,
  updateRating,
  clearRating,
}: StarFilterProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">คะแนนรีวิว</h3>
        {selectedRating !== null && (
          <button
            onClick={clearRating}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium"
          >
            ล้าง
          </button>
        )}
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <label
            key={rating}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors group"
          >
            <input
              type="radio"
              name="ratingFilter"
              value={rating}
              checked={selectedRating === rating}
              onChange={() => updateRating(rating)}
              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-2 focus:ring-orange-500 cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sm">
                    {i < rating ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-700 group-hover:text-orange-700 font-medium">
                {rating === 5 ? "5 ดาวเท่านั้น" : `${rating} ดาวขึ้นไป`}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}