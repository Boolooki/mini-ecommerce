import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/libs/supabase";

export async function GET(req: NextRequest) {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}