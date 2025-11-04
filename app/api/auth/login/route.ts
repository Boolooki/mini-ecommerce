// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/app/libs/supabase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .limit(1);

  const user = users?.[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return NextResponse.json({ token });
}
