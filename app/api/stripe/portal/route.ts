import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { ROOT_DOMAIN } from "@/lib/subdomain";

// Opens Stripe's Customer Portal so a seller can cancel or manage their
// membership. Triggered by a POST form from the dashboard.
export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const origin = `${proto}://${ROOT_DOMAIN}`;

  if (!user) return NextResponse.redirect(`${origin}/login`, 303);

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  const customer = profile?.stripe_customer_id as string | undefined;
  if (!customer) return NextResponse.redirect(`${origin}/dashboard`, 303);

  const session = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `${origin}/dashboard`,
  });

  return NextResponse.redirect(session.url, 303);
}
