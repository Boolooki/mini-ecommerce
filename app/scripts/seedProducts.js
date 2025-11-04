require("dotenv").config({ path: ".env.local" }); // โหลด env ก่อนใช้

const { createClient } = require('@supabase/supabase-js');
const mockProducts = require('../libs/products');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedProducts() {
  const { data, error } = await supabase.from('products').upsert(
    mockProducts.map((p) => ({
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image,
      rating: p.rating,
      reviews: p.reviews,
      quantity: p.quantity,
      description: p.description,
      tags: p.tags,
    }))
  );

  if (error) {
  console.error("❌ Failed to insert products:", error.message);
  console.error("📄 Full error:", error);
} else if (data) {
  console.log(`✅ Seeded ${data.length} products`);
} else {
  console.log("⚠️ Insert returned no data and no error.");
}

}

seedProducts();
