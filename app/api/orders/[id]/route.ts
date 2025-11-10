import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/libs/supabase";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { shipping_status } = await req.json();

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ shipping_status })
      .eq("order_id", params.id)
      .select()
      .single();

    if (error) {
      console.error("❌ Error updating order:", error);
      throw error;
    }

    return NextResponse.json({ order: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
