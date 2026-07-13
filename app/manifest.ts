import type { MetadataRoute } from "next";

// Web App Manifest — makes the site installable to a phone/desktop home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "market.place — your storefront",
    short_name: "market.place",
    description:
      "Your storefront, your subdomain. List products with photos and take payments.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1f1b16",
    theme_color: "#1f1b16",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
