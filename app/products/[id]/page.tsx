"use client";
import { useParams } from 'next/navigation';
import ProductDetailCard from '../../components/products/ProductDetailCard';
import { fetchProducts } from "../../utils/fetchProducts";

const products = await fetchProducts();

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) return <p>ไม่พบสินค้า</p>;

  return <ProductDetailCard product={product} />;
}
