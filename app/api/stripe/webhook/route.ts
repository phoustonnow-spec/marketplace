import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const admin = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    if (s.metadata?.gift === "true" && s.metadata?.recipient) {
      // A gifted membership — activate the recipient's store by subdomain.
      await admin
        .from("profiles")
        .update({ subscription_status: "active", plan: "gift" })
        .eq("subdomain", s.metadata.recipient);
    } else {
      const uid = s.metadata?.uid;
      if (uid) {
        await admin
          .from("profiles")
          .update({
            subscription_status: "active",
            plan: "seller",
            stripe_customer_id: (s.customer as string) || null,
          })
          .eq("id", uid);
      }
    }
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    await admin
      .from("profiles")
      .update({ subscription_status: sub.status })
      .eq("stripe_customer_id", sub.customer as string);
  }

  return NextResponse.json({ received: true });
}
