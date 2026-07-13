import Link from "next/link";
import { ROOT_DOMAIN } from "@/lib/subdomain";

export const metadata = {
  title: "Gift a membership — market.place",
  description: "Give a seller a membership so their store stays live.",
};

export default function GiftPage({
  searchParams,
}: {
  searchParams: { state?: string };
}) {
  const state = searchParams?.state;
  const root = ROOT_DOMAIN.split(":")[0];

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="wordmark text-2xl">
          market.place
        </Link>
      </nav>

      <h1 className="font-serif text-3xl font-bold text-ink">Gift a membership</h1>
      <p className="mt-2 text-[#6b6152]">
        Give a seller the <b>$4/month</b> membership so their store stays live.
        Enter their store address and we’ll activate it after checkout.
      </p>

      {state === "done" && (
        <div className="mt-6 rounded-xl border border-gold bg-[#faf3e3] p-4 text-sm text-golddeep">
          ✓ Thank you! The membership has been gifted — their store is now active.
        </div>
      )}
      {state === "notfound" && (
        <div className="mt-6 rounded-xl border border-line bg-sand p-4 text-sm text-red-700">
          We couldn’t find a store with that address. Double-check the spelling and
          try again.
        </div>
      )}
      {state === "missing" && (
        <div className="mt-6 rounded-xl border border-line bg-sand p-4 text-sm text-red-700">
          Please enter the recipient’s store address.
        </div>
      )}
      {state === "cancel" && (
        <div className="mt-6 rounded-xl border border-line bg-sand p-4 text-sm text-ink">
          Payment canceled — no charge was made.
        </div>
      )}

      <form action="/api/stripe/gift" method="post" className="mt-6">
        <label className="label">Recipient’s store address</label>
        <div className="flex items-center gap-2">
          <input
            name="recipient"
            className="input"
            placeholder="janes"
            autoCapitalize="none"
            required
          />
          <span className="whitespace-nowrap text-sm text-[#8a8071]">.{root}</span>
        </div>
        <p className="mt-1 text-xs text-[#8a8071]">
          That’s the part before <b>.{root}</b> in their store link.
        </p>
        <button className="btn mt-5 w-full py-3">Gift membership — $4</button>
      </form>

      <p className="mt-8 text-sm text-[#8a8071]">
        The recipient needs to have created their store first. After you pay, their
        membership is activated automatically.
      </p>
    </main>
  );
}
