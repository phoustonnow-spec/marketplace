"use client";

// Shares an item. On phones this opens the native share sheet (email, messages,
// etc.) with the photo attached and the name, price, and description in the text;
// on desktop it copies a ready-to-paste summary + link to the clipboard.
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
  function buildText() {
    const lines: string[] = [title];
    if (price) lines.push(price);
    if (text) lines.push("", text);
    if (pay) lines.push("", `Pay me: ${pay}`);
    lines.push("", url);
    return lines.join("\n");
  }

  async function share() {
    const shareText = buildText();
    try {
      // Try to include the actual photo (supported on most mobile browsers).
      if (image && typeof navigator !== "undefined" && (navigator as any).canShare) {
        try {
          const res = await fetch(image);
          const blob = await res.blob();
          const file = new File([blob], "item.jpg", {
            type: blob.type || "image/jpeg",
          });
          if ((navigator as any).canShare({ files: [file] })) {
            await (navigator as any).share({
              title,
              text: shareText,
              url,
              files: [file],
            });
            return;
          }
        } catch {
          /* fall through to link share */
        }
      }
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text: shareText, url });
        return;
      }
      await navigator.clipboard.writeText(shareText);
      alert("Item details copied to clipboard!");
    } catch {
      /* user cancelled the share sheet — nothing to do */
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="btn-ghost !px-2 !py-1 text-xs"
    >
      Share
    </button>
  );
}
