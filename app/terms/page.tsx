import Link from "next/link";
import { OWNER_EMAIL } from "@/lib/email";

export const metadata = {
  title: "Terms of Service — market.place",
  description: "The terms that govern use of market.place.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="wordmark text-2xl">
          market.place
        </Link>
      </nav>

      <h1 className="font-serif text-3xl font-bold text-ink">Terms of Service</h1>
      <p className="mt-2 text-sm text-[#8a8071]">Last updated: July 12, 2026</p>

      <div className="mt-6 space-y-5 text-[#4a4335] leading-relaxed">
        <section>
          <h2 className="font-serif text-xl font-semibold text-ink">
            1. Acceptance of these terms
          </h2>
          <p className="mt-1">
            By creating an account or using market.place (the “Service”), you agree
            to these Terms of Service. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ink">
            2. The Service
          </h2>
          <p className="mt-1">
            market.place lets sellers create a storefront on their own subdomain,
            list products, and share payment options with buyers. We may add,
            change, or remove features at any time.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ink">
            3. Your account
          </h2>
          <p className="mt-1">
            You are responsible for the accuracy of your listings, for keeping your
            login secure, and for all activity under your account. You must be
            legally able to enter into this agreement and to sell the items you
            list.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ink">
            4. Acceptable use
          </h2>
          <p className="mt-1">
            You agree not to use the Service to post unlawful, counterfeit, stolen,
            infringing, fraudulent, or harmful content, to impersonate others, or to
            misuse or disrupt the Service. Buyers and sellers transact at their own
            risk; we are not a party to transactions between them.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ink">
            5. Memberships and fees
          </h2>
          <p className="mt-1">
            Seller memberships may require a recurring fee, described at sign-up.
            Fees are non-refundable except where required by law. We may change
            pricing with reasonable notice.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ink">
            6. Suspension and termination
          </h2>
          <p className="mt-1">
            We reserve the right, at our sole discretion and at any time, with or
            without notice, to suspend, restrict, remove, or permanently delete any
            account, storefront, or content — including for any violation of these
            terms or for any other reason we deem appropriate. You may stop using
            the Service and request deletion of your account at any time.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ink">
            7. Disclaimers and liability
          </h2>
          <p className="mt-1">
            The Service is provided “as is,” without warranties of any kind. To the
            fullest extent permitted by law, we are not liable for any indirect,
            incidental, or consequential damages, or for the acts, content, or
            transactions of any user of the Service.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ink">
            8. Changes to these terms
          </h2>
          <p className="mt-1">
            We may update these terms from time to time. Continued use of the
            Service after changes take effect means you accept the revised terms.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ink">9. Contact</h2>
          <p className="mt-1">
            Questions about these terms? Email{" "}
            <a className="underline" href={`mailto:${OWNER_EMAIL}`}>
              {OWNER_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
