import { renderAppIcon } from "@/lib/appIcon";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Browser tab favicon.
export default function Icon() {
  return renderAppIcon(64);
}
