import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { ROOT_DOMAIN } from "@/lib/subdomain";

// Seller subscription checkout ($1.99/mo). Triggered by a POST form from the dashboard.
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

  let customer = profile?.stripe_customer_id as string | undefined;
  if (!customer) {
    const c = await stripe.customers.create({
      email: user.email || undefined,
      metadata: { uid: user.id },
    });
    customer = c.id;
    await supabase.from("profiles").update({ stripe_customer_id: customer }).eq("id", user.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Seller membership" },
          unit_amount: 199,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/dashboard?sub=success`,
    cancel_url: `${origin}/dashboard?sub=cancel`,
    metadata: { uid: user.id },
  });

  return NextResponse.redirect(session.url!, 303);
}
