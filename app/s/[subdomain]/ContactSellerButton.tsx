"use client";

import { useState } from "react";
import { sendStoreMessage } from "./actions";

// "Contact seller" button that opens the message form in a popup. Shown only
// when the seller has enabled contact.
export default function ContactSellerButton({
  subdomain,
  sellerName,
  enabled,
}: {
  subdomain: string;
  sellerName: string;
  enabled?: boolean | null;
}) {
  const [open, setOpen] = useState(false);
  if (!enabled) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-ghost mt-2 block w-full py-3 text-center"
      >
        ✉ Contact seller
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-semibold text-ink">
                Contact {sellerName}
              </h3>
              <button
                type="button"
                className="text-[#8a8071]"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <form action={sendStoreMessage} className="mt-3">
              <input type="hidden" name="subdomain" value={subdomain} />
              <input name="name" className="input mb-2" placeholder="Your name" />
              <input
                name="email"
                type="email"
                className="input mb-2"
                placeholder="Your email (so they can reply)"
              />
              <textarea
                name="body"
                required
                rows={4}
                className="input"
                placeholder="Your message…"
              />
              <button className="btn mt-3 w-full py-3">Send message</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
