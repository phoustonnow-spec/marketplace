import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { storeIsLive } from "@/lib/trial";
import type { Product, Profile, Master, Channel } from "@/lib/types";

export const dynamic = "force-dynamic";

function StorePaused({ name }: { name: string }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <span className="wordmark text-2xl">market.place</span>
      <h1 className="mt-4 font-serif text-3xl font-bold text-ink">{name}</h1>
      <p className="mt-3 text-[#6b6152]">
        This shop is taking a short break and isn’t open right now. Please check
        back soon.
      </p>
    </main>
  );
}

export default async function Storefront({
  params,
}: {
  params: { subdomain: string };
}) {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("subdomain", params.subdomain)
    .maybeSingle<Profile>();

  if (!profile) notFound();

  if (!storeIsLive(profile)) {
    return <StorePaused name={profile.display_name || profile.subdomain} />;
  }

  const { data: products = [] } = await supabase
    .from("products")
    .select("*")
    .eq("owner", profile.id)
    .order("created_at", { ascending: false });

  const { data: masters = [] } = await supabase
    .from("masters")
    .select("*")
    .eq("owner", profile.id)
    .order("created_at");
  const { data: channels = [] } = await supabase
    .from("channels")
    .select("*")
    .eq("owner", profile.id)
    .order("created_at");
  const ms = (masters || []) as Master[];
  const cs = (channels || []) as Channel[];

  const ps = (products || []) as Product[];
  const fmt = (c: number) => "$" + (c / 100).toLocaleString("en-US");

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24">
      <header className="flex items-center justify-between border-b border-line py-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">
            {profile.display_name || profile.subdomain}
          </h1>
          <p className="text-sm text-[#8a8071]">
            {ps.filter((p) => !p.sold).length} items available
          </p>
        </div>
        {profile.social_url && (
          <a
            href={profile.social_url}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            {profile.social_label || "Visit our page"} ↗
          </a>
        )}
      </header>

      {ms.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line py-4">
          <span className="mr-1 text-xs uppercase tracking-wider text-[#8a8071]">
            Shop by category
          </span>
          {ms.map((m) => {
            const designers = cs.filter((c) => c.master_id === m.id);
            return (
              <details key={m.id} className="relative">
                <summary className="btn-ghost cursor-pointer list-none !py-1.5 text-sm">
                  {m.name} ▾
                </summary>
                <div className="absolute z-10 mt-1 min-w-[190px] rounded-lg border border-line bg-white p-2 shadow-lg">
                  <Link
                    href={`/c/${m.id}`}
                    className="block rounded px-2 py-1 text-sm font-semibold text-golddeep hover:bg-cream"
                  >
                    View all {m.name} →
                  </Link>
                  {designers.map((c) => (
                    <Link
                      key={c.id}
                      href={`/c/${m.id}#${c.id}`}
                      className="block rounded px-2 py-1 text-sm text-[#6b6152] hover:bg-cream"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      )}

      {ps.length === 0 ? (
        <p className="py-20 text-center text-[#8a8071]">
          This store hasn’t listed anything yet.
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
                    className={"h-full w-full object-cover " + (p.sold ? "opacity-50" : "")}
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
                <div className="text-golddeep">{fmt(p.price_cents)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <footer className="border-t border-line py-6 text-center text-xs text-[#a89e8b]">
        Powered by <span className="wordmark">market.place</span>
      </footer>
    </main>
  );
}
