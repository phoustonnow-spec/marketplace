import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// The password-reset email link lands here. We exchange the one-time code for a
// logged-in session, then send the user to the "set a new password" form.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL("/reset", request.url));
}
