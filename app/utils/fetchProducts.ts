// utils/fetchProducts.ts
import { supabase } from "../libs/supabase";

export async function fetchProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return data;
}
