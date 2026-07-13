import Link from "next/link";
import { redirect } from "next/navigation";
import { signup } from "@/app/auth/actions";
import { ROOT_DOMAIN } from "@/lib/subdomain";
import PasswordField from "@/app/PasswordField";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  const root = ROOT_DOMAIN.split(":")[0];
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="card p-8">
        <div className="text-center">
          <span className="wordmark text-3xl">market.place</span>
          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[#8a8071]">
            Start your store
          </p>
        </div>

        <form action={signup} className="mt-6">
          <label className="label">Full name (optional)</label>
          <input name="name" className="input" placeholder="Jane Aventine" />

          <label className="label">Choose your subdomain</label>
          <div className="flex items-center gap-2">
            <input
              name="subdomain"
              className="input"
              placeholder="janes"
              autoCapitalize="none"
            />
            <span className="whitespace-nowrap text-sm text-[#8a8071]">
              .{root}
            </span>
          </div>

          <label className="label">Email</label>
          <input name="email" type="email" className="input" placeholder="you@example.com" />

          <label className="label">Password</label>
          <PasswordField name="password" autoComplete="new-password" />

          {searchParams.error && (
            <p className="mt-3 text-sm text-red-600">{searchParams.error}</p>
          )}

          <p className="mt-4 text-center text-sm text-[#8a8071]">
            Membership <b className="text-golddeep">$4.00 / month</b> · cancel anytime
          </p>
          <button className="btn mt-3 w-full py-3">Create my store →</button>
        </form>

        <p className="mt-5 text-center text-sm text-[#8a8071]">
          Already have a store?{" "}
          <Link href="/login" className="text-golddeep underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
