import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "market.place — your storefront, your subdomain",
  description:
    "Create your own online storefront in minutes. List products, take payments, and share your own subdomain like you.market.place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
