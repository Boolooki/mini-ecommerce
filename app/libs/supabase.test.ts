// lib/supabase.test.ts
import { supabase, supabaseAdmin } from "./supabase";
import { createClient } from "@supabase/supabase-js";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({})),
}));

describe("supabase clients", () => {
  it("creates client-side supabase with anon key", () => {
    expect(createClient).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  });

  it("creates server-side supabaseAdmin with service role key", () => {
    expect(createClient).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  });
});
