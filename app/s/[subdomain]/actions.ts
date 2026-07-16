"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// A buyer sends a message to a seller from their storefront.
export async function sendStoreMessage(formData: FormData) {
  const subdomain = String(formData.get("subdomain") || "")
    .trim()
    .toLowerCase();
  const buyer_name = String(formData.get("name") || "").trim();
  const buyer_email = String(formData.get("email") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!subdomain || !body) {
    redirect(`/?contact=error`);
  }

  // Look up the seller by their store address.
  const supabase = createClient();
  const { data: store } = await supabase
    .from("profiles")
    .select("id")
    .eq("subdomain", subdomain)
    .maybeSingle();

  if (!store) {
    redirect(`/?contact=error`);
  }

  const admin = createAdminClient();
  await admin.from("store_messages").insert({
    seller: store.id,
    buyer_name: buyer_name || null,
    buyer_email: buyer_email || null,
    body,
  });

  redirect(`/?contact=sent`);
}
