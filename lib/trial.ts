import type { Profile } from "@/lib/types";

// Free-trial length in days. Change here (or via a TRIAL_DAYS env var).
export const TRIAL_DAYS = Number(process.env.TRIAL_DAYS || "1");

// A store is "live" (visible to buyers) if the seller is paying OR still inside
// their free trial. After the trial ends without an active membership, the
// public storefront is paused until they subscribe (or use an access code).
export function storeIsLive(
  profile:
    | Pick<Profile, "subscription_status" | "created_at" | "plan">
    | null
    | undefined
): boolean {
  if (!profile) return false;
  if (profile.subscription_status === "active") return true;
  // Invite (promo code) and gifted memberships never expire.
  if (profile.plan === "invite" || profile.plan === "gift") return true;
  if (!profile.created_at) return true; // unknown signup date — don't block
  const created = new Date(profile.created_at).getTime();
  if (Number.isNaN(created)) return true;
  return Date.now() < created + TRIAL_DAYS * 24 * 60 * 60 * 1000;
}

// Whole hours left in the trial (0 if ended or already active).
export function trialHoursLeft(
  profile: Pick<Profile, "subscription_status" | "created_at"> | null | undefined
): number {
  if (!profile || profile.subscription_status === "active" || !profile.created_at) {
    return 0;
  }
  const created = new Date(profile.created_at).getTime();
  if (Number.isNaN(created)) return 0;
  const endsAt = created + TRIAL_DAYS * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((endsAt - Date.now()) / (60 * 60 * 1000)));
}
