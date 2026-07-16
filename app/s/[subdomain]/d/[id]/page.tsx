import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { storeIsLive } from "@/lib/trial";
import { themeAccent } from "@/lib/themes";
import StoreContact from "../../StoreContact";
import type { Product, Profile, Channel } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DesignerPage({
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
        <p className="mt-3 text-[#6b6152]">
          This shop is taking a short break. Please check back soon.
        </p>
      </main>
    );
  }

  const { data: channel } = await supabase
    .from("channels")
    .select("*")
    .eq("id", params.id)
    .eq("owner", profile.id)
    .maybeSingle<Channel>();
  if (!channel) notFound();

  const { data: products = [] } = await supabase
    .from("products")
    .select("*")
    .eq("owner", profile.id)
    .eq("channel_id", channel.id)
    .order("created_at", { ascending: false });
  const ps = (products || []) as Product[];

  const fmt = (c: number) => "$" + (c / 100).toLocaleString("en-US");
  const accent = themeAccent(profile.theme);

  return (
    <div
      className="min-h-screen"
      style={
        {
          "--accent": accent.accent,
          "--accent-deep": accent.accentDeep,
          background: accent.bg,
        } as React.CSSProperties
      }
    >
    <main className="mx-auto max-w-6xl px-6 pb-24">
      <Link
        href="/"
        className="mt-6 inline-block text-sm text-[#8a8071] hover:text-golddeep"
      >
        ← {profile.display_name || profile.subdomain}
      </Link>
      <header
        className="mt-2 rounded-2xl px-6 py-6"
        style={{ background: "var(--accent)" }}
      >
        <h1 className="font-serif text-3xl font-bold text-white">
          {channel.name}
        </h1>
        <p className="text-sm text-white/80">
          {ps.filter((p) => !p.sold).length} items available
        </p>
      </header>

      {ps.length === 0 ? (
        <p className="py-20 text-center text-[#8a8071]">
          Nothing listed under {channel.name} yet.
        </p>
      ) : (
        <div className="grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {ps.map((p) => (
            <Link
              key={p.id}
              href={`/p/${p.id}`}
              className="card overflow-hidden transition hover:-translate-y-1"
            >
              <div className="relative aspect-square bg-sand">
                {p.photos?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.photos[0]}
                    alt={p.name}
                    className={
                      "h-full w-full object-cover " + (p.sold ? "opacity-50" : "")
                    }
                  />
                )}
                {p.sold && (
                  <span className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                    SOLD
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="font-serif text-lg font-semibold">{p.name}</div>
                <div style={{ color: "var(--accent-deep)" }}>
                  {fmt(p.price_cents)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <StoreContact profile={profile} />
    </main>
    </div>
  );
}
