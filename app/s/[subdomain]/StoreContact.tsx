import { sendStoreMessage } from "./actions";
import type { Profile } from "@/lib/types";

// The "Contact seller" form, shown on every storefront page when the seller
// has enabled it. Submits to sendStoreMessage (saves to their inbox).
export default function StoreContact({
  profile,
  sent,
}: {
  profile: Profile;
  sent?: boolean;
}) {
  if (!profile.contact_enabled) return null;

  return (
    <section
      id="contact"
      className="mx-auto mt-10 max-w-md scroll-mt-4 border-t border-line pt-8"
    >
      <h2
        className="text-center font-serif text-2xl font-bold"
        style={{ color: "var(--accent-deep)" }}
      >
        Contact {profile.display_name || profile.subdomain}
      </h2>
      {sent ? (
        <p className="mt-3 rounded-xl border border-line bg-white p-4 text-center text-sm text-ink">
          ✓ Thanks! Your message was sent to the seller.
        </p>
      ) : (
        <form action={sendStoreMessage} className="mt-4">
          <input type="hidden" name="subdomain" value={profile.subdomain} />
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
          <button
            className="btn mt-3 w-full py-3"
            style={{ background: "var(--accent)" }}
          >
            Send message
          </button>
        </form>
      )}
    </section>
  );
}
