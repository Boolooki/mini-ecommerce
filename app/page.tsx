// homepage.tsx
import ProductCard from "@/app/components/ProductCard";
import BannerCarousel from "./components/BannerCarousel";
import { fetchProducts } from "./utils/fetchProducts";

const products = await fetchProducts();

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <BannerCarousel />
      
      {/* Trust Indicators Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🚚</div>
            <p className="text-sm font-semibold text-gray-800">จัดส่งฟรี</p>
            <p className="text-xs text-gray-500">สั่งซื้อขั้นต่ำ 500 บาท</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-2">✓</div>
            <p className="text-sm font-semibold text-gray-800">ของแท้ 100%</p>
            <p className="text-xs text-gray-500">รับประกันคุณภาพ</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-2">↩️</div>
            <p className="text-sm font-semibold text-gray-800">คืนสินค้าได้</p>
            <p className="text-xs text-gray-500">ภายใน 7 วัน</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-sm font-semibold text-gray-800">บริการตลอด 24/7</p>
            <p className="text-xs text-gray-500">ทีมงานพร้อมช่วยเหลือ</p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">สินค้าแนะนำ</h1>
              <p className="text-gray-600 mt-1">คัดสรรสินค้าคุณภาพเพื่อคุณ</p>
            </div>
            <button className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
              ดูทั้งหมด
              <span>→</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}