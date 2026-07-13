"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

// Secret access code that activates a membership for free (for invited people).
// Change it by setting an ACCESS_CODE environment variable, or edit the fallback.
const ACCESS_CODE = process.env.ACCESS_CODE || "Mary";

export async function redeemAccessCode(formData: FormData) {
  const { supabase, user } = await requireUser();
  const code = String(formData.get("code") || "").trim();
  if (code && code.toLowerCase() === ACCESS_CODE.toLowerCase()) {
    await supabase
      .from("profiles")
      .update({ subscription_status: "active", plan: "invite" })
      .eq("id", user.id);
    revalidatePath("/dashboard");
    redirect("/dashboard?code=ok");
  }
  redirect("/dashboard?code=bad");
}

export async function addMaster(formData: FormData) {
  const { supabase, user } = await requireUser();
  const name = String(formData.get("name") || "").trim();
  if (name) await supabase.from("masters").insert({ owner: user.id, name });
  revalidatePath("/dashboard");
}

export async function addChannel(formData: FormData) {
  const { supabase, user } = await requireUser();
  const name = String(formData.get("name") || "").trim();
  const master_id = String(formData.get("master_id") || "") || null;
  if (name) await supabase.from("channels").insert({ owner: user.id, name, master_id });
  revalidatePath("/dashboard");
}

export async function addProduct(formData: FormData) {
  const { supabase, user } = await requireUser();
  const name = String(formData.get("name") || "").trim();
  const channel_id = String(formData.get("channel_id") || "") || null;
  const description = String(formData.get("description") || "").trim();
  const priceDollars = parseFloat(String(formData.get("price") || "0")) || 0;
  let photos: string[] = [];
  try {
    photos = JSON.parse(String(formData.get("photos") || "[]"));
  } catch {
    photos = [];
  }
  if (!name) return;
  await supabase.from("products").insert({
    owner: user.id,
    channel_id,
    name,
    description,
    price_cents: Math.round(priceDollars * 100),
    photos,
    sold: false,
  });
  revalidatePath("/dashboard", "layout");
}

export async function updateProduct(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const channel_id = String(formData.get("channel_id") || "") || null;
  const description = String(formData.get("description") || "").trim();
  const priceDollars = parseFloat(String(formData.get("price") || "0")) || 0;
  let photos: string[] = [];
  try {
    photos = JSON.parse(String(formData.get("photos") || "[]"));
  } catch {
    photos = [];
  }
  if (!id || !name) return;
  await supabase
    .from("products")
    .update({
      name,
      channel_id,
      description,
      price_cents: Math.round(priceDollars * 100),
      photos,
    })
    .eq("id", id)
    .eq("owner", user.id);
  revalidatePath("/dashboard", "layout");
}

export async function toggleSold(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") || "");
  const sold = String(formData.get("sold") || "") === "true";
  await supabase.from("products").update({ sold: !sold }).eq("id", id).eq("owner", user.id);
  revalidatePath("/dashboard", "layout");
}

export async function deleteProduct(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") || "");
  await supabase.from("products").delete().eq("id", id).eq("owner", user.id);
  revalidatePath("/dashboard", "layout");
}

// Add/remove an item from the sales sheet.
export async function toggleSheet(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") || "");
  const on = String(formData.get("on_sheet") || "") === "true";
  await supabase
    .from("products")
    .update({ on_sheet: !on })
    .eq("id", id)
    .eq("owner", user.id);
  revalidatePath("/dashboard", "layout");
}

// ---- Category (master + channel) editing ----
export async function renameMaster(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (id && name)
    await supabase.from("masters").update({ name }).eq("id", id).eq("owner", user.id);
  revalidatePath("/dashboard", "layout");
}

export async function deleteMaster(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") || "");
  if (id) await supabase.from("masters").delete().eq("id", id).eq("owner", user.id);
  revalidatePath("/dashboard", "layout");
}

export async function renameChannel(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (id && name)
    await supabase.from("channels").update({ name }).eq("id", id).eq("owner", user.id);
  revalidatePath("/dashboard", "layout");
}

export async function deleteChannel(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") || "");
  if (id) await supabase.from("channels").delete().eq("id", id).eq("owner", user.id);
  redirect("/dashboard");
}

export async function saveSettings(formData: FormData) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("profiles")
    .update({
      display_name: String(formData.get("display_name") || "").trim(),
      social_url: String(formData.get("social_url") || "").trim(),
      social_label: String(formData.get("social_label") || "").trim(),
      venmo: String(formData.get("venmo") || "").trim(),
      paypal: String(formData.get("paypal") || "").trim(),
      zelle: String(formData.get("zelle") || "").trim(),
    })
    .eq("id", user.id);
  revalidatePath("/dashboard");
}
