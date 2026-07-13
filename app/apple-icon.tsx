import { renderAppIcon } from "@/lib/appIcon";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS home-screen icon ("Add to Home Screen").
export default function AppleIcon() {
  return renderAppIcon(180);
}
