import type { Metadata, Viewport } from "next";
import "./globals.css";
import RegisterSW from "./RegisterSW";

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
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="mx-auto max-w-5xl px-6 py-10 text-center text-xs text-[#8a8071]">
          <div className="flex flex-wrap justify-center gap-5">
            <a href="/about" className="hover:text-golddeep">
              About
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
        <RegisterSW />
      </body>
    </html>
  );
}
