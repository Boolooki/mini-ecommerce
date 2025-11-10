import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/app/libs/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // จัดการ event ต่างๆ
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log("✅ Checkout completed:", session.id);
        await saveOrderToSupabase(session);
        
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("✅ Payment succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.log("❌ Payment failed:", paymentIntent.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// บันทึก Order ลง Supabase
async function saveOrderToSupabase(session: Stripe.Checkout.Session) {
  try {
    const items = JSON.parse(session.metadata?.items || "[]");
    
    const orderData = {
      order_id: session.id,
      customer_email: session.customer_details?.email || "guest@example.com",
      customer_name: session.customer_details?.name || "Guest",
      items: items,
      total: session.amount_total ? session.amount_total / 100 : 0,
      payment_status: session.payment_status,
      shipping_status: "pending",
    };

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      throw error;
    }

    console.log("✅ Order saved to Supabase:", data);
    return data;
  } catch (error) {
    console.error("❌ Error saving order:", error);
    throw error;
  }
}