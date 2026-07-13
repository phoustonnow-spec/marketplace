"use client";

import { useState } from "react";

// Password input with a "Show / Hide" toggle so people can check what they typed.
export default function PasswordField({
  name = "password",
  placeholder = "••••••••",
  autoComplete = "current-password",
}: {
  name?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        name={name}
        type={show ? "text" : "password"}
        className="input pr-16"
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-xs font-semibold text-golddeep hover:underline"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
