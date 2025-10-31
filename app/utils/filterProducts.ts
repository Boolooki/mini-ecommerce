type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  quantity: number;
  description: string;
  tags: string[];
};

export function filterProductsByTags(
  products: Product[],
  selectedTags: string[]
) {
  if (selectedTags.length === 0) return products;

  return products.filter((product) =>
    selectedTags.every((tag) => product.tags.includes(tag))
  );
}
