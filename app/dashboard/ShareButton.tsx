"use client";

import { useState } from "react";

// Shows a preview of exactly what will be shared (photo + text + purchase link),
// then shares it (native share sheet on mobile) or copies it (desktop).
export default function ShareButton({
  title,
  price,
  text,
  url,
  image,
  pay,
}: {
  title: string;
  price?: string;
  text?: string | null;
  url: string;
  image?: string | null;
  pay?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function buildText() {
    const lines: string[] = [title];
    if (price) lines.push(price);
    if (text) lines.push("", text);
    if (pay) lines.push("", `Pay me: ${pay}`);
    lines.push("", "👉 Purchase here:", url);
    return lines.join("\n");
  }

  async function share() {
    const shareText = buildText();
    try {
      if (image && typeof navigator !== "undefined" && (navigator as any).canShare) {
        try {
          const res = await fetch(image);
          const blob = await res.blob();
          const file = new File([blob], "item.jpg", {
            type: blob.type || "image/jpeg",
          });
          if ((navigator as any).canShare({ files: [file] })) {
            await (navigator as any).share({ title, text: shareText, url, files: [file] });
            return;
          }
        } catch {
          /* fall through */
        }
      }
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text: shareText, url });
        return;
      }
      await copy();
    } catch {
      /* user cancelled */
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(buildText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-ghost !px-2 !py-1 text-xs"
      >
        Share
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-sm overflow-auto rounded-xl bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-ink">
                Preview
              </h3>
              <button
                type="button"
                className="text-[#8a8071]"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-xs text-[#8a8071]">
              This is what people will receive.
            </p>

            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                className="mt-3 w-full rounded-lg object-cover"
              />
            )}
            <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg border border-line bg-cream p-3 font-sans text-sm text-ink">
              {buildText()}
            </pre>

            <div className="mt-3 flex gap-2">
              <button type="button" onClick={share} className="btn flex-1">
                Share…
              </button>
              <button type="button" onClick={copy} className="btn-ghost">
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
