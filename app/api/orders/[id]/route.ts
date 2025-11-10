import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/libs/supabase";

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = context.params;
    const { shipping_status } = await req.json();

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ shipping_status })
      .eq("order_id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ Error updating order:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
