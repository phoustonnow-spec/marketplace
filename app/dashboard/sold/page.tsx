import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROOT_DOMAIN } from "@/lib/subdomain";
import { toggleSold, deleteProduct } from "../actions";
import ProductForm from "../ProductForm";
import ShareButton from "../ShareButton";
import MoveSelect from "../MoveSelect";
import type { Channel, Master, Product, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SoldPage() {
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
    .eq("owner", user.id)
    .order("created_at");
  const { data: channels = [] } = await supabase
    .from("channels")
    .select("*")
    .eq("owner", user.id)
    .order("created_at");
  const { data: products = [] } = await supabase
    .from("products")
    .select("*")
    .eq("owner", user.id)
    .eq("sold", true)
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
  const storeBase = profile ? `https://${profile.subdomain}.${root}` : "";
  const fmt = (c: number) => "$" + (c / 100).toLocaleString("en-US");

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-5">
        <div>
          <Link href="/dashboard" className="text-sm text-[#8a8071] hover:text-golddeep">
            ← Back to dashboard
          </Link>
          <h1 className="mt-1 font-serif text-3xl font-bold text-ink">Sold</h1>
          <p className="text-sm text-[#8a8071]">
            {ps.length} sold item{ps.length === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      {ps.length === 0 ? (
        <p className="py-16 text-center text-[#8a8071]">
          Nothing here yet. Items you mark as sold will collect on this page.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ps.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <div className="relative aspect-square bg-sand">
                {p.photos?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.photos[0]}
                    alt={p.name}
                    className="h-full w-full object-cover opacity-60"
                  />
                )}
                <span className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                  SOLD
                </span>
              </div>
              <div className="p-3">
                <div className="font-serif text-lg font-semibold">{p.name}</div>
                <div className="text-golddeep">{fmt(p.price_cents)}</div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <ProductForm channels={channelOpts} userId={user.id} product={p} />
                  <ShareButton
                    title={p.name}
                    price={fmt(p.price_cents)}
                    text={p.description}
                    url={`${storeBase}/p/${p.id}`}
                    image={p.photos?.[0]}
                  />
                  <form action={toggleSold}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="sold" value={String(p.sold)} />
                    <button className="btn-ghost !px-2 !py-1 text-xs">
                      Mark available
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
      )}
    </main>
  );
}
