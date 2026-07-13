import Link from "next/link";
import { login } from "@/app/auth/actions";
import PasswordField from "@/app/PasswordField";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="card p-8">
        <div className="text-center">
          <span className="wordmark text-3xl">market.place</span>
          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[#8a8071]">
            Sign in
          </p>
        </div>

        <form action={login} className="mt-6">
          <label className="label">Email</label>
          <input name="email" type="email" className="input" placeholder="you@example.com" />

          <label className="label">Password</label>
          <PasswordField name="password" autoComplete="current-password" />
          <div className="mt-2 text-right">
            <Link href="/forgot" className="text-xs text-golddeep underline">
              Forgot password?
            </Link>
          </div>

          {searchParams.error && (
            <p className="mt-3 text-sm text-red-600">{searchParams.error}</p>
          )}

          <button className="btn mt-5 w-full py-3">Sign in →</button>
        </form>

        <p className="mt-5 text-center text-sm text-[#8a8071]">
          New here?{" "}
          <Link href="/signup" className="text-golddeep underline">
            Create a store
          </Link>
        </p>
      </div>
    </main>
  );
}
