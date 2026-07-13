import Link from "next/link";
import { sendContact } from "./actions";
import { OWNER_EMAIL } from "@/lib/email";

export const metadata = {
  title: "Contact — market.place",
  description: "Questions, issues, or suggestions? Get in touch.",
};

export default function ContactPage({
  searchParams,
}: {
  searchParams: { state?: string };
}) {
  const state = searchParams?.state;

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="wordmark text-2xl">
          market.place
        </Link>
      </nav>

      <h1 className="font-serif text-3xl font-bold text-ink">Contact us</h1>
      <p className="mt-2 text-[#6b6152]">
        Have a question, an issue, or a suggestion? Send us a note and we’ll get
        back to you.
      </p>

      {state === "sent" && (
        <div className="mt-6 rounded-xl border border-gold bg-[#faf3e3] p-4 text-sm text-golddeep">
          ✓ Thanks — your message was sent. We’ll be in touch soon.
        </div>
      )}
      {state === "failed" && (
        <div className="mt-6 rounded-xl border border-line bg-sand p-4 text-sm text-ink">
          We couldn’t send that just now. Please email us directly at{" "}
          <a className="underline" href={`mailto:${OWNER_EMAIL}`}>
            {OWNER_EMAIL}
          </a>
          .
        </div>
      )}
      {state === "error" && (
        <div className="mt-6 rounded-xl border border-line bg-sand p-4 text-sm text-red-700">
          Please write a message before sending.
        </div>
      )}

      <form action={sendContact} className="mt-6 space-y-3">
        <div>
          <label className="label">Your name</label>
          <input name="name" className="input" placeholder="Jane Doe" />
        </div>
        <div>
          <label className="label">Your email</label>
          <input
            name="email"
            type="email"
            className="input"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="label">Message</label>
          <textarea
            name="message"
            required
            rows={6}
            className="input"
            placeholder="How can we help?"
          />
        </div>
        <button className="btn">Send message</button>
      </form>

      <p className="mt-8 text-sm text-[#8a8071]">
        Prefer email? Reach us any time at{" "}
        <a className="underline" href={`mailto:${OWNER_EMAIL}`}>
          {OWNER_EMAIL}
        </a>
        .
      </p>
    </main>
  );
}
