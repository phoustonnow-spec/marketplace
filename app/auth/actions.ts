"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isValidSubdomain } from "@/lib/subdomain";
import { sendOwnerEmail, escapeHtml } from "@/lib/email";

export async function signup(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const subdomain = String(formData.get("subdomain") || "")
    .trim()
    .toLowerCase();

  if (!email || !password || !subdomain) {
    redirect(
      "/signup?error=" +
        encodeURIComponent("Please enter an email, password, and store address.")
    );
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

  // Notify the owner that a new seller registered (no-op until email is set up).
  await sendOwnerEmail({
    subject: `New store signup: ${subdomain}`,
    html:
      `<p>A new seller just registered on market.place.</p>` +
      `<ul>` +
      `<li><b>Name:</b> ${escapeHtml(name)}</li>` +
      `<li><b>Email:</b> ${escapeHtml(email)}</li>` +
      `<li><b>Store address:</b> ${escapeHtml(subdomain)}</li>` +
      `</ul>`,
  });

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

// Step 1 of "forgot password": email the user a reset link.
export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) {
    redirect("/forgot?state=error");
  }

  const h = headers();
  const host = h.get("host") || "";
  const proto = host.includes("localhost") ? "http" : "https";
  const origin = `${proto}://${host}`;

  const supabase = createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/reset-callback`,
  });

  // Always report success so we don't reveal which emails have accounts.
  redirect("/forgot?state=sent");
}

// Step 2 of "forgot password": save the new password (user arrives with a
// session already established by /auth/reset-callback).
export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (password.length < 6) {
    redirect("/reset?state=short");
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(
      "/login?error=" +
        encodeURIComponent("Your reset link expired. Please request a new one.")
    );
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect("/reset?state=error");
  }
  redirect("/dashboard");
}
