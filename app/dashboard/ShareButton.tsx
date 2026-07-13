"use client";

// Shares an item. On phones this opens the native share sheet (with the photo
// when possible); on desktop it copies the item's public link to the clipboard.
export default function ShareButton({
  title,
  text,
  url,
  image,
}: {
  title: string;
  text?: string | null;
  url: string;
  image?: string | null;
}) {
  async function share() {
    const shareText = text ? `${title} — ${text}` : title;
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
            await (navigator as any).share({ title, text: shareText, url, files: [file] });
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
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
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
