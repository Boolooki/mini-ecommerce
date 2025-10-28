import mockProducts from "@/app/data/products";
import ProductCard from "@/app/components/ProductCard";

export default function Products() {
  return (
    //Products Section
    <div className="bg-orange-200 text-center p-4">
      <h1 className="text-2xl font-bold">สินค้าในร้าน</h1>
      <div className="flex overflow-x-auto gap-4 p-4 scrollbar-hide snap-x snap-mandatory">
        {mockProducts.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-64 snap-center">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
