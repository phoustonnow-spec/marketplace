import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { storeIsLive } from "@/lib/trial";
import { themeAccent } from "@/lib/themes";
import type { Product, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

function venmoUrl(h?: string | null) {
  const v = (h || "").replace(/^@/, "");
  return v ? `https://venmo.com/u/${encodeURIComponent(v)}` : "";
}
function paypalUrl(v?: string | null) {
  const s = (v || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.includes("@")) return "";
  return `https://paypal.me/${encodeURIComponent(s.replace(/^@/, ""))}`;
}

export default async function ProductPage({
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

  if (!storeIsLive(profile)) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <span className="wordmark text-2xl">market.place</span>
        <h1 className="mt-4 font-serif text-3xl font-bold text-ink">
          {profile.display_name || profile.subdomain}
        </h1>
        <p className="mt-3 text-[#6b6152]">
          This shop is taking a short break and isn’t open right now. Please check
          back soon.
        </p>
      </main>
    );
  }

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .eq("owner", profile.id)
    .maybeSingle<Product>();
  if (!product) notFound();

  const fmt = (c: number) => "$" + (c / 100).toLocaleString("en-US");
  const pay = paypalUrl(profile.paypal);
  const venmo = venmoUrl(profile.venmo);
  const accent = themeAccent(profile.theme);

  return (
    <main
      className="mx-auto max-w-5xl px-6 pb-24"
      style={
        {
          "--accent": accent.accent,
          "--accent-deep": accent.accentDeep,
        } as React.CSSProperties
      }
    >
      <div className="py-6">
        <Link href="/" className="btn-ghost">
          ← {profile.display_name || profile.subdomain}
        </Link>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="grid gap-3">
          {(product.photos || []).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="w-full rounded-xl border border-line object-cover" />
          ))}
          {(!product.photos || product.photos.length === 0) && (
            <div className="aspect-square rounded-xl bg-sand" />
          )}
        </div>

        <div>
          <h1 className="font-serif text-4xl font-bold text-ink">{product.name}</h1>
          <div className="mt-2 text-2xl" style={{ color: "var(--accent-deep)" }}>
            {fmt(product.price_cents)}
          </div>
          {product.sold && (
            <span className="mt-2 inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
              SOLD
            </span>
          )}
          <p className="mt-4 whitespace-pre-wrap text-[#5b5546]">{product.description}</p>

          {!product.sold && (
            <div className="mt-6 border-t border-line pt-5">
              <div className="mb-3 text-xs uppercase tracking-wider text-[#8a8071]">
                Buy this piece
              </div>
              <a
                href={`/checkout/${product.id}`}
                className="btn mb-2 block w-full py-3 text-center"
                style={{ background: "var(--accent)" }}
              >
                Purchase Now
              </a>
              {venmo && (
                <a href={venmo} target="_blank" rel="noreferrer" className="mb-2 block w-full rounded-lg bg-[#3d95ce] py-3 text-center font-semibold text-white">
                  Pay with Venmo
                </a>
              )}
              {pay && (
                <a href={pay} target="_blank" rel="noreferrer" className="mb-2 block w-full rounded-lg bg-[#003087] py-3 text-center font-semibold text-white">
                  Pay with PayPal
                </a>
              )}
              {profile.zelle && (
                <div className="mb-2 block w-full rounded-lg bg-[#6d1ed4] py-3 text-center font-semibold text-white">
                  Zelle: {profile.zelle}
                </div>
              )}
            </div>
          )}

          {profile.social_url && (
            <a
              href={profile.social_url}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-3 block w-full py-3 text-center"
            >
              {profile.social_label || "Visit our page"} ↗
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
