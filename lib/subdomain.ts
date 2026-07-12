// Root domain the app runs on, e.g. "market.place" (prod) or "localhost:3000" (dev).
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

// Subdomains that are NOT seller storefronts.
const RESERVED = new Set(["www", "app", "api", "admin", "mail", "static", "assets"]);

/**
 * Given a request Host header, return the seller subdomain, or null if the
 * request is for the apex/root app (marketing site, dashboard, auth, api).
 */
export function getSubdomain(host: string | null): string | null {
  if (!host) return null;
  // strip port
  const hostname = host.split(":")[0].toLowerCase();
  const root = ROOT_DOMAIN.split(":")[0].toLowerCase();

  if (hostname === root || hostname === `www.${root}`) return null;

  // Vercel preview deployments (*.vercel.app) — treat as apex app.
  if (hostname.endsWith(".vercel.app")) return null;

  if (hostname.endsWith(`.${root}`)) {
    const sub = hostname.slice(0, -1 * (root.length + 1));
    // only take the left-most label (jane.market.place -> "jane")
    const label = sub.split(".")[0];
    if (RESERVED.has(label)) return null;
    return label || null;
  }
  return null;
}

export function isValidSubdomain(s: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$/.test(s) && !RESERVED.has(s);
}
