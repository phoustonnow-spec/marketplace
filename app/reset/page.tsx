import { updatePassword } from "@/app/auth/actions";
import PasswordField from "@/app/PasswordField";

export const metadata = { title: "Set a new password — market.place" };

export default function ResetPage({
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
            Set a new password
          </p>
        </div>

        <form action={updatePassword} className="mt-6">
          <label className="label">New password</label>
          <PasswordField name="password" autoComplete="new-password" />

          {state === "short" && (
            <p className="mt-3 text-sm text-red-600">
              Password must be at least 6 characters.
            </p>
          )}
          {state === "error" && (
            <p className="mt-3 text-sm text-red-600">
              Something went wrong. Please request a new reset link.
            </p>
          )}

          <button className="btn mt-5 w-full py-3">Update password →</button>
        </form>
      </div>
    </main>
  );
}
