// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/app/libs/supabase";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  const hashed = await bcrypt.hash(password, 10);

  const { data, error } = await supabase.from("users").insert([
    { email, password_hash: hashed, name },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Signup successful" });
}
