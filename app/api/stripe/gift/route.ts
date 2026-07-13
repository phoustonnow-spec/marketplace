import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { ROOT_DOMAIN } from "@/lib/subdomain";

// One-time $4 gift: a buyer pays to activate someone else's membership.
export async function POST(req: Request) {
  const form = await req.formData();
  const recipient = String(form.get("recipient") || "")
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/\s/g, "");

  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const origin = `${proto}://${ROOT_DOMAIN}`;

  if (!recipient) {
    return NextResponse.redirect(`${origin}/gift?state=missing`, 303);
  }

  // Make sure the recipient store actually exists.
  const supabase = createClient();
  const { data: store } = await supabase
    .from("profiles")
    .select("subdomain")
    .eq("subdomain", recipient)
    .maybeSingle();

  if (!store) {
    return NextResponse.redirect(`${origin}/gift?state=notfound`, 303);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `Gifted membership for ${store.subdomain}` },
          unit_amount: 400,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/gift?state=done`,
    cancel_url: `${origin}/gift?state=cancel`,
    metadata: { gift: "true", recipient: store.subdomain },
  });

  return NextResponse.redirect(session.url!, 303);
}
