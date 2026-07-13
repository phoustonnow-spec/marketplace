import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROOT_DOMAIN } from "@/lib/subdomain";
import { setStoreAddress } from "../actions";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SetupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  // Already picked a real address → nothing to do here.
  if (profile && !profile.subdomain?.startsWith("store-")) {
    redirect("/dashboard");
  }

  const root = ROOT_DOMAIN.split(":")[0];

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="card p-8">
        <div className="text-center">
          <span className="wordmark text-3xl">market.place</span>
          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[#8a8071]">
            Almost there
          </p>
        </div>

        <h1 className="mt-4 font-serif text-2xl font-bold text-ink">
          Choose your store address
        </h1>
        <p className="mt-1 text-sm text-[#6b6152]">
          This is your shop’s web address. Keep it short — it’s how customers
          find and link to your store.
        </p>

        <form action={setStoreAddress} className="mt-5">
          <label className="label">Store name (optional)</label>
          <input
            name="display_name"
            className="input"
            defaultValue={profile?.display_name || ""}
            placeholder="Jane’s Boutique"
          />

          <label className="label">Store address</label>
          <div className="flex items-center gap-2">
            <input
              name="subdomain"
              className="input"
              placeholder="janes"
              autoCapitalize="none"
              required
            />
            <span className="whitespace-nowrap text-sm text-[#8a8071]">
              .{root}
            </span>
          </div>

          {searchParams?.error && (
            <p className="mt-3 text-sm text-red-600">{searchParams.error}</p>
          )}

          <button className="btn mt-5 w-full py-3">Create my store →</button>
        </form>
      </div>
    </main>
  );
}
