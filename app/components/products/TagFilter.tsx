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
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">กรองตาม Tag</h2>
      <div className="flex flex-col gap-2 text-sm">
        {visibleTags.map((tag) => (
          <label key={tag}>
            <input
              type="checkbox"
              className="mr-2"
              checked={selectedTags.includes(tag)}
              onChange={() => toggleTag(tag)}
            />
            {tag}
          </label>
        ))}
      </div>

      {totalTagCount > visibleTags.length && (
        <button
          onClick={toggleShowAll}
          className="mt-3 text-orange-600 text-sm underline hover:text-orange-800"
        >
          {showAll ? "แสดงน้อยลง" : "ดูเพิ่มเติม"}
        </button>
      )}
    </div>
  );
}
