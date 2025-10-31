"use client";
import { useParams } from 'next/navigation';
import mockProducts from '@/app/data/products';
import ProductDetailCard from '../../components/products/ProductDetailCard';

export default function ProductPage() {
  const { id } = useParams();
  const product = mockProducts.find((p) => p.id === id);

  if (!product) return <p>ไม่พบสินค้า</p>;

  return <ProductDetailCard product={product} />;
}
