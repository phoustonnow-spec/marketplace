"use client";

import { useState } from "react";

export default function InviteActions({
  message,
  url,
}: {
  message: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  const mailto = `mailto:?subject=${encodeURIComponent(
    "Check out market.place"
  )}&body=${encodeURIComponent(message)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: "market.place", text: message, url });
      } else {
        await copy();
      }
    } catch {
      /* user cancelled */
    }
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <a href={mailto} className="btn">
        ✉️ Email it
      </a>
      <button type="button" onClick={share} className="btn-ghost">
        Share…
      </button>
      <button type="button" onClick={copy} className="btn-ghost">
        {copied ? "Copied ✓" : "Copy message"}
      </button>
    </div>
  );
}
