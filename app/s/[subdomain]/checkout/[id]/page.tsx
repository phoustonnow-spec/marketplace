import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { storeIsLive } from "@/lib/trial";
import type { Product, Profile } from "@/lib/types";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: { subdomain: string; id: string };
}) {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("subdomain", params.subdomain)
    .maybeSingle<Profile>();
  if (!profile) notFound();
  if (!storeIsLive(profile)) notFound();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .eq("owner", profile.id)
    .maybeSingle<Product>();
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <CheckoutForm
        productName={product.name}
        priceCents={product.price_cents}
        venmo={profile.venmo}
        paypal={profile.paypal}
        zelle={profile.zelle}
      />
    </main>
  );
}
