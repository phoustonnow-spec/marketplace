import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import RegisterSW from "./RegisterSW";
import { getSubdomain, ROOT_DOMAIN } from "@/lib/subdomain";

const DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "mymarketplace.studio";
const INTRO =
  "Create your own online shop in minutes — list your items with photos, get your own web address, and take payments.";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${DOMAIN}`),
  title: "market.place — your storefront, your subdomain",
  description: INTRO,
  applicationName: "market.place",
  appleWebApp: {
    capable: true,
    title: "market.place",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "market.place — your storefront, your subdomain",
    description: INTRO,
    url: "/",
    siteName: "market.place",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "market.place — your storefront, your subdomain",
    description: INTRO,
  },
};

export const viewport: Viewport = {
  themeColor: "#1f1b16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = headers().get("host");
  const isStore = getSubdomain(host) !== null;
  const home = `https://${ROOT_DOMAIN.split(":")[0]}`;

  return (
    <html lang="en">
      <body>
        {children}
        {isStore ? (
          <footer className="mx-auto max-w-5xl px-6 py-10 text-center text-xs text-[#8a8071]">
            Powered by{" "}
            <a
              href={home}
              target="_blank"
              rel="noreferrer"
              className="wordmark hover:underline"
            >
              market.place
            </a>{" "}
            ·{" "}
            <a
              href={`${home}/signup`}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-golddeep"
            >
              open your own shop →
            </a>
          </footer>
        ) : (
          <footer className="mx-auto max-w-5xl px-6 py-10 text-center text-xs text-[#8a8071]">
            <div className="flex flex-wrap justify-center gap-5">
              <a href="/" className="hover:text-golddeep">
                Home
              </a>
              <a href="/about" className="hover:text-golddeep">
                About
              </a>
              <a href="/install" className="hover:text-golddeep">
                Get the app
              </a>
              <a href="/invite" className="hover:text-golddeep">
                Share
              </a>
              <a href="/gift" className="hover:text-golddeep">
                Gift
              </a>
              <a href="/contact" className="hover:text-golddeep">
                Contact
              </a>
              <a href="/terms" className="hover:text-golddeep">
                Terms of Service
              </a>
            </div>
            <p className="mt-2">© market.place</p>
          </footer>
        )}
        <RegisterSW />
      </body>
    </html>
  );
}
