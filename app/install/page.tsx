import Link from "next/link";

export const metadata = {
  title: "Get the app — market.place",
  description: "Add market.place to your phone's home screen like an app.",
};

export default function InstallPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="wordmark text-2xl">
          market.place
        </Link>
      </nav>

      <h1 className="font-serif text-3xl font-bold text-ink">Get the app</h1>
      <p className="mt-2 text-[#6b6152]">
        market.place installs straight from your browser — no App Store needed.
        It gets its own icon and opens full-screen like a normal app.
      </p>

      <div className="mt-6 space-y-4">
        <div className="card p-5">
          <h2 className="font-serif text-xl font-semibold text-ink"> iPhone / iPad</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[#4a4335]">
            <li>
              Open <b>mymarketplace.studio</b> in <b>Safari</b> (this only works in
              Safari).
            </li>
            <li>
              Tap the <b>Share</b> button (the square with an ↑ arrow at the
              bottom).
            </li>
            <li>
              Scroll down and tap <b>“Add to Home Screen.”</b>
            </li>
            <li>
              Tap <b>“Add”</b> — the gold icon appears on your home screen.
            </li>
          </ol>
        </div>

        <div className="card p-5">
          <h2 className="font-serif text-xl font-semibold text-ink"> Android</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[#4a4335]">
            <li>
              Open <b>mymarketplace.studio</b> in <b>Chrome</b>.
            </li>
            <li>
              Tap the <b>⋮</b> menu (top-right).
            </li>
            <li>
              Tap <b>“Install app”</b> (or <b>“Add to Home screen”</b>).
            </li>
            <li>Confirm — the icon appears on your home screen.</li>
          </ol>
        </div>
      </div>

      <p className="mt-8 text-sm text-[#8a8071]">
        On a computer, look for an <b>install icon</b> in the browser’s address bar
        (Chrome/Edge) to install it there too.
      </p>
    </main>
  );
}
