"use client";

import { useFormStatus } from "react-dom";

// Save button that shows "Saving…" and disables while the form submits, so the
// user gets immediate feedback on click.
export default function SubmitButton({
  children,
  className = "btn",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button className={className} disabled={pending}>
      {pending ? "Saving…" : children}
    </button>
  );
}
