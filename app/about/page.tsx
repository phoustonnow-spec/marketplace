import Link from "next/link";
import { ROOT_DOMAIN } from "@/lib/subdomain";

export const metadata = {
  title: "About — market.place",
  description:
    "market.place is the easiest way to open your own online storefront — your own web address, your inventory, your payments.",
};

export default function AboutPage() {
  const root = ROOT_DOMAIN.split(":")[0];

  const features = [
    ["🏪", "Your own storefront", `A personal web address like you.${root}, with a beautiful shop page.`],
    ["📸", "List with photos", "Add products with photos, organized by category and brand."],
    ["🔖", "Sell & share", "Mark items sold, build a printable sales sheet, and share any item in one tap."],
    ["💸", "Get paid your way", "Customers pay you directly by Venmo, PayPal, or Zelle."],
    ["📱", "Installs like an app", "Add your store to any phone's home screen."],
    ["🎁", "Gift & invite", "Gift a membership, and invite others to open their own shop."],
  ];

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="wordmark text-2xl">
          market.place
        </Link>
      </nav>

      <p className="text-xs uppercase tracking-[0.3em] text-gold">About</p>
      <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-ink">
        Your shop. Your brand. Your own address.
      </h1>

      <p className="mt-5 text-lg leading-relaxed text-[#5b5546]">
        <b>market.place</b> is the easiest way to open your own online storefront.
        In minutes you get your own web address, a beautiful shop page, and full
        control of your inventory — add products with photos, sort them into
        categories and brands, mark items sold, and build shareable sales sheets.
        Customers browse your store and pay you directly by Venmo, PayPal, or
        Zelle. Share any item with one tap, send buyers a link that previews your
        shop, and even add your store to your phone’s home screen like an app.
        Simple, elegant, and truly yours.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {features.map(([icon, title, body]) => (
          <div key={title} className="card p-5">
            <div className="text-2xl">{icon}</div>
            <h3 className="mt-2 font-serif text-lg font-semibold text-ink">
              {title}
            </h3>
            <p className="mt-1 text-sm text-[#6b6152]">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/signup" className="btn px-6 py-3 text-base">
          Start your store — $4/mo
        </Link>
        <Link href="/invite" className="btn-ghost px-6 py-3 text-base">
          Share market.place
        </Link>
      </div>
    </main>
  );
}
