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
    <div className="bg-white p-4 rounded shadow mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">กรองตามคะแนนรีวิว</h2>
        {selectedRating !== null && (
          <button
            onClick={clearRating}
            className="text-orange-600 text-sm underline hover:text-orange-800"
          >
            ล้าง
          </button>
        )}
      </div>

      <div className="flex gap-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 text-sm">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="cursor-pointer">
              <input
                type="radio"
                name="ratingFilter"
                value={rating}
                checked={selectedRating === rating}
                onChange={() => updateRating(rating)}
                className="mr-2"
              />
              คะแนนรีวิว {rating} ⭐{rating === 5 ? "เท่านั้น" : "ขึ้นไป"}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
