import Link from "next/link";
import { ROOT_DOMAIN } from "@/lib/subdomain";
import InviteActions from "./InviteActions";

export const metadata = {
  title: "Share market.place",
  description: "Invite friends to open their own storefront on market.place.",
};

export default function InvitePage() {
  const domain = ROOT_DOMAIN.split(":")[0];
  const url = `https://${domain}`;
  const message = `Check out market.place — set up your own online shop in minutes: list your items with photos, get your own web address, and take payments.\n\nStart here: ${url}`;

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="wordmark text-2xl">
          market.place
        </Link>
      </nav>

      <h1 className="font-serif text-3xl font-bold text-ink">Share market.place</h1>
      <p className="mt-2 text-[#6b6152]">
        Send this to anyone who’d like their own online shop. Tap a button below —
        the link shows a preview card automatically when it’s pasted into an email
        or text.
      </p>

      {/* Preview card image — right-click / long-press to save and attach. */}
      <div className="mt-6 overflow-hidden rounded-xl border border-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/opengraph-image"
          alt="market.place preview"
          className="w-full"
        />
      </div>

      <div className="mt-6 rounded-xl border border-line bg-cream p-4">
        <p className="text-xs uppercase tracking-wider text-[#8a8071]">
          The message
        </p>
        <p className="mt-1 whitespace-pre-wrap text-sm text-ink">{message}</p>
      </div>

      <InviteActions message={message} url={url} />

      <p className="mt-8 text-sm text-[#8a8071]">
        Tip: “Email it” opens your email app with the message ready to send. To
        include the picture above, save it first (right-click → Save image, or
        press and hold on a phone) and attach it.
      </p>
    </main>
  );
}
