// utils/filterProductsByTags.test.ts
import { filterProductsByTags } from "./filterProducts";

const products = [
  {
    id: "1",
    name: "iPhone 15",
    price: 35000,
    category: "smartphone",
    image: "/iphone.jpg",
    rating: 4.8,
    reviews: 120,
    quantity: 5,
    description: "Apple smartphone",
    tags: ["apple", "smartphone", "premium"],
  },
  {
    id: "2",
    name: "Galaxy S24",
    price: 28000,
    category: "smartphone",
    image: "/galaxy.jpg",
    rating: 4.5,
    reviews: 90,
    quantity: 10,
    description: "Samsung smartphone",
    tags: ["samsung", "smartphone", "android"],
  },
  {
    id: "3",
    name: "MacBook Pro",
    price: 75000,
    category: "laptop",
    image: "/macbook.jpg",
    rating: 4.9,
    reviews: 200,
    quantity: 3,
    description: "Apple laptop",
    tags: ["apple", "laptop", "premium"],
  },
];

describe("filterProductsByTags", () => {
  it("returns all products when selectedTags is empty", () => {
    const result = filterProductsByTags(products, []);
    expect(result).toEqual(products);
  });

  it("filters products by a single tag", () => {
    const result = filterProductsByTags(products, ["apple"]);
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.name)).toEqual(["iPhone 15", "MacBook Pro"]);
  });

  it("filters products by multiple tags (AND logic)", () => {
    const result = filterProductsByTags(products, ["apple", "premium"]);
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.name)).toEqual(["iPhone 15", "MacBook Pro"]);
  });

  it("returns empty array if no product matches all selected tags", () => {
    const result = filterProductsByTags(products, ["apple", "android"]);
    expect(result).toEqual([]);
  });

  it("filters products by non-existing tag", () => {
    const result = filterProductsByTags(products, ["nonexistent"]);
    expect(result).toEqual([]);
  });
});
