import type { Metadata, Viewport } from "next";
import "./globals.css";
import RegisterSW from "./RegisterSW";

export const metadata: Metadata = {
  title: "market.place — your storefront, your subdomain",
  description:
    "Create your own online storefront in minutes. List products, take payments, and share your own subdomain like you.market.place.",
  applicationName: "market.place",
  appleWebApp: {
    capable: true,
    title: "market.place",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
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
