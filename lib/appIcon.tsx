import { ImageResponse } from "next/og";

// Shared renderer for all app icons (favicon, iOS touch icon, PWA manifest icons).
// Brand: deep "ink" background with a gold "m." monogram matching the wordmark.
export function renderAppIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1f1b16",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: Math.round(size * 0.52),
            fontWeight: 700,
            color: "#a5813f",
          }}
        >
          m.
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
