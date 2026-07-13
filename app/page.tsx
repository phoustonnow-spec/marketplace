import Link from "next/link";
import { ROOT_DOMAIN } from "@/lib/subdomain";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-5xl px-6">
      <nav className="flex items-center justify-between py-6">
        <span className="wordmark text-2xl">market.place</span>
        <div className="flex gap-3">
          {user ? (
            <Link href="/dashboard" className="btn">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Sign in
              </Link>
              <Link href="/signup" className="btn">
                Start selling
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="py-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          Your storefront, your subdomain
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-serif text-5xl font-bold leading-tight text-ink">
          Sell anything from your own corner of the web.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-[#6b6152]">
          Create an account, add your products with photos, and get your own
          address like{" "}
          <span className="font-semibold text-golddeep">
            you.{ROOT_DOMAIN.split(":")[0]}
          </span>
          . Take payments by card, Venmo, PayPal, or Zelle.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/signup" className="btn px-6 py-3 text-base">
            Start your store — $4/mo
          </Link>
          <Link href="/login" className="btn-ghost px-6 py-3 text-base">
            Sign in
          </Link>
        </div>
      </section>

      <section className="grid gap-4 pb-24 sm:grid-cols-3">
        {[
          ["Your own subdomain", "Every seller gets you.market.place — instantly."],
          ["Unlimited catalog", "Categories, designers, photos, prices, descriptions."],
          ["Get paid your way", "Card checkout plus Venmo, PayPal, and Zelle."],
        ].map(([h, b]) => (
          <div key={h} className="card p-5">
            <h3 className="font-serif text-xl font-semibold text-ink">{h}</h3>
            <p className="mt-2 text-sm text-[#6b6152]">{b}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
