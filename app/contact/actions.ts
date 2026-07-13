"use server";

import { redirect } from "next/navigation";
import { sendOwnerEmail, escapeHtml } from "@/lib/email";

export async function sendContact(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!message) {
    redirect("/contact?state=error");
  }

  const ok = await sendOwnerEmail({
    subject: `market.place contact: ${name || "a visitor"}`,
    html:
      `<p><b>From:</b> ${escapeHtml(name) || "(no name)"} ` +
      `&lt;${escapeHtml(email) || "no email"}&gt;</p>` +
      `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    replyTo: email || undefined,
  });

  redirect(ok ? "/contact?state=sent" : "/contact?state=failed");
}
