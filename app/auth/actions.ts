"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidSubdomain } from "@/lib/subdomain";

export async function signup(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const subdomain = String(formData.get("subdomain") || "")
    .trim()
    .toLowerCase();

  if (!name || !email || !password || !subdomain) {
    redirect("/signup?error=" + encodeURIComponent("Please fill in every field."));
  }
  if (!isValidSubdomain(subdomain)) {
    redirect(
      "/signup?error=" +
        encodeURIComponent("Subdomain must be 2–32 letters, numbers or hyphens.")
    );
  }

  const supabase = createClient();

  // subdomain must be unique
  const { data: taken } = await supabase
    .from("profiles")
    .select("id")
    .eq("subdomain", subdomain)
    .maybeSingle();
  if (taken) {
    redirect(
      "/signup?error=" + encodeURIComponent(`“${subdomain}” is already taken.`)
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: name, subdomain } },
  });
  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message));
  }
  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }
  redirect("/dashboard");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
