import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { StoreMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: messages = [] } = await supabase
    .from("store_messages")
    .select("*")
    .eq("seller", user.id)
    .order("created_at", { ascending: false });
  const ms = (messages || []) as StoreMessage[];

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24">
      <header className="border-b border-line py-5">
        <Link
          href="/dashboard"
          className="text-sm text-[#8a8071] hover:text-golddeep"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-1 font-serif text-3xl font-bold text-ink">Messages</h1>
        <p className="text-sm text-[#8a8071]">
          {ms.length} message{ms.length === 1 ? "" : "s"} from buyers
        </p>
      </header>

      {ms.length === 0 ? (
        <p className="py-16 text-center text-[#8a8071]">
          No messages yet. When a buyer contacts you from your store, it shows
          here.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {ms.map((m) => (
            <div key={m.id} className="card p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold text-ink">
                  {m.buyer_name || "A buyer"}
                </span>
                <span className="text-xs text-[#8a8071]">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              {m.buyer_email && (
                <a
                  href={`mailto:${m.buyer_email}`}
                  className="text-sm text-golddeep underline"
                >
                  {m.buyer_email}
                </a>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm text-[#4a4335]">
                {m.body}
              </p>
              {m.buyer_email && (
                <a
                  href={`mailto:${m.buyer_email}`}
                  className="btn-ghost mt-3 inline-block !py-1 text-xs"
                >
                  Reply by email
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
