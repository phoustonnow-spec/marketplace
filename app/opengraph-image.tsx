import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "market.place — your storefront, your subdomain";

// The preview card shown when the site's link is pasted into email, texts, or
// social. Also usable as a promo image on the Share page.
export default function OpengraphImage() {
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "mymarketplace.studio";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1f1b16",
          padding: 60,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://${domain}/icon-512.png`}
          width={210}
          height={210}
          style={{ borderRadius: 32 }}
          alt=""
        />
        <div
          style={{
            display: "flex",
            fontSize: 66,
            fontWeight: 700,
            color: "#c9a866",
            marginTop: 34,
          }}
        >
          market.place
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#efe8dc",
            marginTop: 12,
          }}
        >
          Your shop. Your brand. Your own address.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#a5813f",
            marginTop: 26,
          }}
        >
          {domain}
        </div>
      </div>
    ),
    { ...size }
  );
}
