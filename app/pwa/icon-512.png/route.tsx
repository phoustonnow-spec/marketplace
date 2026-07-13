import { renderAppIcon } from "@/lib/appIcon";

export const runtime = "edge";

export function GET() {
  return renderAppIcon(512);
}
