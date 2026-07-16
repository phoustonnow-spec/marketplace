import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { storeIsLive } from "@/lib/trial";
import { themeAccent } from "@/lib/themes";
import ContactSellerButton from "../../ContactSellerButton";
import type { Product, Profile, Master, Channel } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
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

  const { data: master } = await supabase
    .from("masters")
    .select("*")
    .eq("id", params.id)
    .eq("owner", profile.id)
    .maybeSingle<Master>();
  if (!master) notFound();

  const { data: channels = [] } = await supabase
    .from("channels")
    .select("*")
    .eq("owner", profile.id)
    .eq("master_id", master.id)
    .order("created_at");
  const cs = (channels || []) as Channel[];

  let products: Product[] = [];
  if (cs.length) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("owner", profile.id)
      .in(
        "channel_id",
        cs.map((c) => c.id)
      )
      .order("created_at", { ascending: false });
    products = (data || []) as Product[];
  }

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
          {master.name}
        </h1>
        <p className="text-sm text-white/80">
          {products.filter((p) => !p.sold).length} items available
        </p>
      </header>

      {products.length === 0 ? (
        <p className="py-20 text-center text-[#8a8071]">
          Nothing listed in {master.name} yet.
        </p>
      ) : (
        cs
          .filter((c) => products.some((p) => p.channel_id === c.id))
          .map((c) => (
            <section key={c.id} id={c.id} className="scroll-mt-4 py-6">
              <h2
                className="mb-3 font-serif text-xl font-semibold"
                style={{ color: "var(--accent-deep)" }}
              >
                {c.name}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products
                  .filter((p) => p.channel_id === c.id)
                  .map((p) => (
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
                              "h-full w-full object-cover " +
                              (p.sold ? "opacity-50" : "")
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
                        <div className="font-serif text-lg font-semibold">
                          {p.name}
                        </div>
                        <div style={{ color: "var(--accent-deep)" }}>
                          {fmt(p.price_cents)}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          ))
      )}

      <div className="mx-auto max-w-md pt-8 text-center">
        <ContactSellerButton
          subdomain={profile.subdomain}
          sellerName={profile.display_name || profile.subdomain}
          enabled={profile.contact_enabled}
        />
      </div>
    </main>
    </div>
  );
}
