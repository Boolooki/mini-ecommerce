// components/products/PriceFilter.tsx
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
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">ช่วงราคา</h3>

      {/* Display Price Range */}
      <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 font-medium">
            ฿{minPrice.toLocaleString()}
          </span>
          <span className="text-gray-400">-</span>
          <span className="text-gray-700 font-medium">
            ฿{maxPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Dual Range Slider */}
      <div className="space-y-6 mb-6">
        <div>
          <label className="text-sm text-gray-600 mb-2 block">
            ราคาต่ำสุด: ฿{minPrice.toLocaleString()}
          </label>
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={500}
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-2 block">
            ราคาสูงสุด: ฿{maxPrice.toLocaleString()}
          </label>
          <input
            type="range"
            min={minPrice}
            max={100000}
            step={500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>
      </div>

      {/* Manual Input */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600 mb-1 block">ต่ำสุด</label>
          <input
            type="number"
            min={0}
            max={maxPrice}
            step={500}
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">สูงสุด</label>
          <input
            type="number"
            min={minPrice}
            max={100000}
            step={500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}