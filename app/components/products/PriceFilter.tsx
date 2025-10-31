type PriceFilterProps = {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
};

export default function PriceFilter({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}: PriceFilterProps) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">กรองตามช่วงราคา</h2>

      {/* 🔘 Slider */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-gray-700">ราคาต่ำสุด:</label>
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={100}
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">ราคาสูงสุด:</label>
          <input
            type="range"
            min={minPrice}
            max={100000}
            step={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>
      </div>

      {/* 💬 Input */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <label htmlFor="minInput" className="block mb-1 text-gray-700">
            ราคาต่ำสุด
          </label>
          <input
            id="minInput"
            type="number"
            min={0}
            max={maxPrice}
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        <div>
          <label htmlFor="maxInput" className="block mb-1 text-gray-700">
            ราคาสูงสุด
          </label>
          <input
            id="maxInput"
            type="number"
            min={minPrice}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full px-2 py-1 border rounded"
          />
        </div>
      </div>
    </div>
  );
}
