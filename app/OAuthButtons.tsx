import { signInWithGoogle, signInWithApple } from "@/app/auth/actions";

// "Continue with Google / Apple" buttons. Each works once that provider is
// enabled in Supabase (Authentication → Providers).
export default function OAuthButtons() {
  return (
    <div>
      <form action={signInWithGoogle}>
        <button className="btn-ghost mb-2 w-full py-2.5">
          Continue with Google
        </button>
      </form>
      <form action={signInWithApple}>
        <button className="btn-ghost w-full py-2.5">Continue with Apple</button>
      </form>
      <div className="my-4 flex items-center gap-3 text-xs text-[#a89e8b]">
        <div className="h-px flex-1 bg-line" />
        or with email
        <div className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
}
