import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROOT_DOMAIN } from "@/lib/subdomain";
import { logout } from "@/app/auth/actions";
import {
  addMaster,
  addChannel,
  toggleSold,
  deleteProduct,
  saveSettings,
  redeemAccessCode,
  renameMaster,
  deleteMaster,
  renameChannel,
  deleteChannel,
  toggleSheet,
} from "./actions";
import ProductForm from "./ProductForm";
import ShareButton from "./ShareButton";
import MoveSelect from "./MoveSelect";
import { storeIsLive, trialHoursLeft } from "@/lib/trial";
import type { Master, Channel, Product, Profile } from "@/lib/types";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { code?: string; sub?: string; saved?: string };
}) {
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

  const { data: masters = [] } = await supabase
    .from("masters")
    .select("*")
    .order("created_at");
  const { data: channels = [] } = await supabase
    .from("channels")
    .select("*")
    .order("created_at");
  const { data: products = [] } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const ms = (masters || []) as Master[];
  const cs = (channels || []) as Channel[];
  const ps = (products || []) as Product[];

  const channelOpts = cs.map((c) => ({
    id: c.id,
    name: c.name,
    masterName: ms.find((m) => m.id === c.master_id)?.name || "—",
  }));

  const root = ROOT_DOMAIN.split(":")[0];
  const storeUrl = profile ? `https://${profile.subdomain}.${root}` : "#";
  const fmt = (cents: number) => "$" + (cents / 100).toLocaleString("en-US");
  const payLine = [
    profile?.venmo ? `Venmo @${profile.venmo.replace(/^@/, "")}` : "",
    profile?.paypal ? `PayPal ${profile.paypal}` : "",
    profile?.zelle ? `Zelle ${profile.zelle}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-5">
        <span className="wordmark text-2xl">market.place</span>
        <div className="flex items-center gap-3 text-sm">
          {profile && (
            <a href={storeUrl} target="_blank" className="btn-ghost" rel="noreferrer">
              View store ↗ {profile.subdomain}.{root}
            </a>
          )}
          <form action={logout}>
            <button className="btn-ghost">Sign out</button>
          </form>
        </div>
      </header>

      {profile && profile.subscription_status !== "active" && (
        <div className="mt-4 rounded-xl border border-gold bg-[#faf3e3] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-golddeep">
              {storeIsLive(profile) ? (
                <>
                  Free trial —{" "}
                  <b>
                    about {trialHoursLeft(profile)} hour
                    {trialHoursLeft(profile) === 1 ? "" : "s"} left
                  </b>
                  . Activate your <b>$4/month</b> membership to keep your store
                  live.
                </>
              ) : (
                <>
                  ⚠️ Your free trial has ended and your store is{" "}
                  <b>paused for shoppers</b>. Activate your <b>$4/month</b>
                  membership (or enter an access code) to bring it back.
                </>
              )}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <form action="/api/stripe/checkout" method="post">
                <button className="btn">Activate membership →</button>
              </form>
              <form action={redeemAccessCode} className="flex items-center gap-1">
                <input
                  name="code"
                  className="input !w-36 !py-1.5"
                  placeholder="Access code"
                  aria-label="Access code"
                  autoComplete="off"
                />
                <button className="btn-ghost">Apply</button>
              </form>
            </div>
          </div>
          {searchParams?.code === "bad" && (
            <p className="mt-2 text-sm text-red-700">
              That code isn’t valid. Check it and try again.
            </p>
          )}
        </div>
      )}

      {profile && profile.subscription_status === "active" && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold bg-[#faf3e3] p-3 text-sm">
          <span className="text-golddeep">
            ✓ Your membership is active.
            {searchParams?.sub === "success" && " Thank you for subscribing!"}
            {searchParams?.code === "ok" && " Welcome!"}
          </span>
          {profile.stripe_customer_id && (
            <form action="/api/stripe/portal" method="post">
              <button className="btn-ghost !py-1 text-xs">
                Manage / cancel membership
              </button>
            </form>
          )}
        </div>
      )}

      <div className="grid gap-8 py-8 md:grid-cols-[280px_1fr]">
        {/* sidebar: categories */}
        <aside>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-wider text-[#8a8071]">
              Master categories
            </h2>
          </div>
          <div className="mb-3 flex gap-4 text-xs">
            <Link href="/dashboard/sold" className="text-golddeep hover:underline">
              Sold →
            </Link>
            <Link
              href="/dashboard/sales-sheet"
              className="text-golddeep hover:underline"
            >
              Sales sheet →
            </Link>
          </div>
          <ul className="space-y-2">
            {ms.map((m) => (
              <li key={m.id} className="text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-ink">{m.name}</span>
                  <details className="text-xs">
                    <summary className="cursor-pointer list-none text-[#a89e8b]">
                      ⋯
                    </summary>
                    <div className="mt-1 rounded-lg border border-line bg-cream p-2">
                      <form action={renameMaster} className="flex gap-1">
                        <input type="hidden" name="id" value={m.id} />
                        <input
                          name="name"
                          defaultValue={m.name}
                          className="input !py-1 !text-xs"
                        />
                        <button className="btn-ghost !px-2 !py-1 text-xs">Save</button>
                      </form>
                      <form action={deleteMaster} className="mt-1">
                        <input type="hidden" name="id" value={m.id} />
                        <button className="text-xs text-red-600">
                          Delete category
                        </button>
                      </form>
                    </div>
                  </details>
                </div>
                <ul className="ml-3 mt-1 space-y-1">
                  {cs
                    .filter((c) => c.master_id === m.id)
                    .map((c) => (
                      <li
                        key={c.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <Link
                          href={`/dashboard/channel/${c.id}`}
                          className="text-sm text-[#6b6152] hover:text-golddeep hover:underline"
                        >
                          {c.name} →
                        </Link>
                        <details className="text-xs">
                          <summary className="cursor-pointer list-none text-[#a89e8b]">
                            ⋯
                          </summary>
                          <div className="mt-1 rounded-lg border border-line bg-cream p-2">
                            <form action={renameChannel} className="flex gap-1">
                              <input type="hidden" name="id" value={c.id} />
                              <input
                                name="name"
                                defaultValue={c.name}
                                className="input !py-1 !text-xs"
                              />
                              <button className="btn-ghost !px-2 !py-1 text-xs">
                                Save
                              </button>
                            </form>
                            <form action={deleteChannel} className="mt-1">
                              <input type="hidden" name="id" value={c.id} />
                              <button className="text-xs text-red-600">
                                Delete brand
                              </button>
                            </form>
                          </div>
                        </details>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
            {ms.length === 0 && (
              <li className="text-sm text-[#8a8071]">No categories yet.</li>
            )}
          </ul>

          <form action={addMaster} className="mt-4 flex gap-2">
            <input name="name" className="input" placeholder="New master category" />
            <button className="btn-ghost">Add</button>
          </form>

          {ms.length > 0 && (
            <form action={addChannel} className="mt-2 space-y-2">
              <input name="name" className="input" placeholder="New channel (brand)" />
              <select name="master_id" className="input">
                {ms.map((m) => (
                  <option key={m.id} value={m.id}>
                    under {m.name}
                  </option>
                ))}
              </select>
              <button className="btn-ghost w-full">Add channel</button>
            </form>
          )}
        </aside>

        {/* main: inventory */}
        <section>
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-3xl font-bold">Inventory</h1>
            <span className="text-sm text-[#8a8071]">
              {ps.length} items · {ps.filter((p) => p.sold).length} sold
            </span>
          </div>

          <ProductForm channels={channelOpts} userId={user.id} />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ps.map((p) => (
              <div key={p.id} className="card overflow-hidden">
                <div className="aspect-square bg-sand">
                  {p.photos?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.photos[0]}
                      alt=""
                      className={
                        "h-full w-full object-cover " + (p.sold ? "opacity-50" : "")
                      }
                    />
                  )}
                </div>
                <div className="p-3">
                  <div className="font-serif text-lg font-semibold">{p.name}</div>
                  <div className="text-golddeep">{fmt(p.price_cents)}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <ProductForm
                      channels={channelOpts}
                      userId={user.id}
                      product={p}
                    />
                    <ShareButton
                      title={p.name}
                      price={fmt(p.price_cents)}
                      text={p.description}
                      url={`${storeUrl}/p/${p.id}`}
                      image={p.photos?.[0]}
                      pay={payLine}
                    />
                    <form action={toggleSheet}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="on_sheet" value={String(p.on_sheet)} />
                      <button className="btn-ghost !px-2 !py-1 text-xs">
                        {p.on_sheet ? "On sheet ✓" : "+ Sheet"}
                      </button>
                    </form>
                    <form action={toggleSold}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="sold" value={String(p.sold)} />
                      <button className="btn-ghost !px-2 !py-1 text-xs">
                        {p.sold ? "Mark available" : "Mark sold"}
                      </button>
                    </form>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="btn-ghost !px-2 !py-1 text-xs">Delete</button>
                    </form>
                  </div>
                  <div className="mt-2">
                    <MoveSelect
                      productId={p.id}
                      currentChannelId={p.channel_id}
                      channels={channelOpts}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* settings */}
          <details className="card mt-10 p-5" open={searchParams?.saved === "1"}>
            <summary className="cursor-pointer font-serif text-xl font-semibold">
              Store settings — page link &amp; payments
            </summary>

            {searchParams?.saved === "1" && (
              <p className="mt-3 rounded-lg border border-gold bg-[#faf3e3] px-3 py-2 text-sm text-golddeep">
                ✓ Saved! Your store settings were updated.
              </p>
            )}

            <p className="mt-3 max-w-lg text-sm text-[#6b6152]">
              These are your public shop details. Add a payment option (Venmo,
              PayPal, or Zelle) and it becomes a button buyers can tap to pay you
              directly. Leave a box empty to hide it. <b>Click “Save settings”
              after any change</b> — the panel closes when it saves.
            </p>

            <form action={saveSettings} className="mt-3 max-w-lg">
              <label className="label">Store display name</label>
              <input
                name="display_name"
                className="input"
                defaultValue={profile?.display_name || ""}
              />
              <label className="label">Your page / social link (optional)</label>
              <input
                name="social_url"
                className="input"
                defaultValue={profile?.social_url || ""}
                placeholder="https://instagram.com/yourshop"
              />
              <label className="label">Link button label</label>
              <input
                name="social_label"
                className="input"
                defaultValue={profile?.social_label || ""}
                placeholder="Follow us on Instagram"
              />
              <label className="label">Venmo handle</label>
              <input name="venmo" className="input" defaultValue={profile?.venmo || ""} />
              <label className="label">PayPal.Me link</label>
              <input name="paypal" className="input" defaultValue={profile?.paypal || ""} />
              <label className="label">Zelle email/phone</label>
              <input name="zelle" className="input" defaultValue={profile?.zelle || ""} />
              <button className="btn mt-4">Save settings</button>
            </form>
          </details>
        </section>
      </div>
    </main>
  );
}
