import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROOT_DOMAIN } from "@/lib/subdomain";
import { toggleSheet } from "../actions";
import PrintButton from "./PrintButton";
import type { Product, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SalesSheet({
  searchParams,
}: {
  searchParams: { preview?: string };
}) {
  const previewMode = searchParams?.preview === "1";
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
    .order("created_at", { ascending: false });

  const all = (products || []) as Product[];
  const onSheet = all.filter((p) => p.on_sheet);
  const available = all.filter((p) => !p.on_sheet);

  const fmt = (c: number) => "$" + (c / 100).toLocaleString("en-US");
  const storeName = profile?.display_name || profile?.subdomain || "market.place";
  const root = ROOT_DOMAIN.split(":")[0];
  const storeBase = profile ? `https://${profile.subdomain}.${root}` : "";

  return (
    <main className="mx-auto max-w-4xl px-6 pb-24">
      <header className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-line py-5">
        {previewMode ? (
          <Link
            href="/dashboard/sales-sheet"
            className="text-sm text-[#8a8071] hover:text-golddeep"
          >
            ← Exit preview
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="text-sm text-[#8a8071] hover:text-golddeep"
          >
            ← Back to dashboard
          </Link>
        )}
        <div className="flex items-center gap-2">
          {!previewMode && onSheet.length > 0 && (
            <Link href="/dashboard/sales-sheet?preview=1" className="btn-ghost">
              Preview
            </Link>
          )}
          <PrintButton />
        </div>
      </header>

      {previewMode && (
        <p className="no-print mt-3 rounded-lg border border-gold bg-[#faf3e3] px-3 py-2 text-center text-sm text-golddeep">
          Preview — this is exactly how your printed / PDF sheet will look.
        </p>
      )}

      {/* Item picker — build the sheet from here. Hidden when printing/previewing. */}
      {!previewMode && (
      <details className="no-print mt-5 rounded-xl border border-line bg-cream p-4" open={onSheet.length === 0}>
        <summary className="cursor-pointer font-serif text-lg font-semibold text-ink">
          ＋ Add items to this sheet
          {available.length > 0 ? ` (${available.length} available)` : ""}
        </summary>
        {available.length === 0 ? (
          <p className="mt-3 text-sm text-[#8a8071]">
            All of your items are already on the sheet.
          </p>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {available.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-lg border border-line bg-white p-2"
              >
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-sand">
                  {p.photos?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.photos[0]} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ink">{p.name}</div>
                  <div className="text-xs text-golddeep">{fmt(p.price_cents)}</div>
                </div>
                <form action={toggleSheet}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="on_sheet" value={String(p.on_sheet)} />
                  <button className="btn !px-3 !py-1 text-xs">Add</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </details>
      )}

      <div className="py-6 text-center">
        <h1 className="font-serif text-4xl font-bold text-ink">{storeName}</h1>
        <p className="mt-1 text-sm uppercase tracking-[0.28em] text-gold">
          Sales sheet
        </p>
      </div>

      {(profile?.venmo || profile?.paypal || profile?.zelle) && (
        <div className="mb-6 rounded-xl border border-line bg-cream p-4 text-center text-sm">
          <span className="text-xs uppercase tracking-wider text-[#8a8071]">
            How to pay
          </span>
          <div className="mt-1 flex flex-wrap justify-center gap-x-6 gap-y-1 text-ink">
            {profile?.venmo && (
              <span>
                <b>Venmo:</b> @{profile.venmo.replace(/^@/, "")}
              </span>
            )}
            {profile?.paypal && (
              <span>
                <b>PayPal:</b> {profile.paypal}
              </span>
            )}
            {profile?.zelle && (
              <span>
                <b>Zelle:</b> {profile.zelle}
              </span>
            )}
          </div>
        </div>
      )}

      {onSheet.length === 0 ? (
        <p className="no-print py-10 text-center text-[#8a8071]">
          Your sales sheet is empty. Use “Add items to this sheet” above to add some.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {onSheet.map((p) => (
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
                {storeBase && !p.sold && (
                  <a
                    href={`${storeBase}/p/${p.id}`}
                    className="mt-2 inline-block rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink"
                  >
                    Purchase this item →
                  </a>
                )}
                {!previewMode && (
                  <form action={toggleSheet} className="no-print mt-3">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="on_sheet" value={String(p.on_sheet)} />
                    <button className="text-xs text-red-600">
                      Remove from sheet
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
