import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";

export const metadata = { title: "Reset password — market.place" };

export default function ForgotPage({
  searchParams,
}: {
  searchParams: { state?: string };
}) {
  const state = searchParams?.state;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="card p-8">
        <div className="text-center">
          <span className="wordmark text-3xl">market.place</span>
          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[#8a8071]">
            Reset your password
          </p>
        </div>

        {state === "sent" ? (
          <div className="mt-6 rounded-xl border border-gold bg-[#faf3e3] p-4 text-sm text-golddeep">
            If an account exists for that email, we’ve sent a reset link. Check
            your inbox (and spam folder), then click the link to set a new
            password.
          </div>
        ) : (
          <form action={requestPasswordReset} className="mt-6">
            <p className="text-sm text-[#6b6152]">
              Enter your email and we’ll send you a link to set a new password.
            </p>
            <label className="label">Email</label>
            <input
              name="email"
              type="email"
              required
              className="input"
              placeholder="you@example.com"
            />
            {state === "error" && (
              <p className="mt-3 text-sm text-red-600">
                Please enter your email address.
              </p>
            )}
            <button className="btn mt-5 w-full py-3">Send reset link →</button>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-[#8a8071]">
          Remembered it?{" "}
          <Link href="/login" className="text-golddeep underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
