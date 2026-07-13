import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toggleSheet } from "../actions";
import PrintButton from "./PrintButton";
import type { Product, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SalesSheet() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  const { data: products = [] } = await supabase
    .from("products")
    .select("*")
    .eq("owner", user.id)
    .eq("on_sheet", true)
    .order("created_at", { ascending: false });

  const ps = (products || []) as Product[];
  const fmt = (c: number) => "$" + (c / 100).toLocaleString("en-US");
  const storeName = profile?.display_name || profile?.subdomain || "market.place";

  return (
    <main className="mx-auto max-w-4xl px-6 pb-24">
      <header className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-line py-5">
        <Link href="/dashboard" className="text-sm text-[#8a8071] hover:text-golddeep">
          ← Back to dashboard
        </Link>
        <PrintButton />
      </header>

      <div className="py-6 text-center">
        <h1 className="font-serif text-4xl font-bold text-ink">{storeName}</h1>
        <p className="mt-1 text-sm uppercase tracking-[0.28em] text-gold">
          Sales sheet
        </p>
      </div>

      {ps.length === 0 ? (
        <p className="no-print py-16 text-center text-[#8a8071]">
          Your sales sheet is empty. Open a brand, find an item, and click
          “Add to sales sheet.”
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {ps.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <div className="aspect-[4/3] bg-sand">
                {p.photos?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.photos[0]}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-serif text-xl font-semibold text-ink">
                    {p.name}
                  </h3>
                  <span className="whitespace-nowrap font-semibold text-golddeep">
                    {fmt(p.price_cents)}
                  </span>
                </div>
                {p.description && (
                  <p className="mt-1 text-sm text-[#6b6152]">{p.description}</p>
                )}
                <form action={toggleSheet} className="no-print mt-3">
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="on_sheet" value={String(p.on_sheet)} />
                  <button className="text-xs text-red-600">Remove from sheet</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
