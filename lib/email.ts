// Tiny email helper. Sends notifications to the store owner via Resend's REST
// API (no extra npm package needed). If RESEND_API_KEY isn't set yet, it simply
// does nothing and returns false — so the app never breaks for a missing key.

export const OWNER_EMAIL = process.env.OWNER_EMAIL || "phoustonnow@gmail.com";

// Resend allows sending from this shared address to your own account email
// without verifying a domain. Swap to a mymarketplace.studio address later.
const FROM = process.env.EMAIL_FROM || "market.place <onboarding@resend.dev>";

export function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

export async function sendOwnerEmail(opts: {
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false; // not configured yet — no-op
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [OWNER_EMAIL],
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
