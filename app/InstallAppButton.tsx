"use client";

import { useEffect, useState } from "react";

// "Get the app" button. On Android/Chrome it triggers the real install prompt;
// elsewhere (e.g. iPhone) it opens the step-by-step install guide.
export default function InstallAppButton({
  className = "btn",
}: {
  className?: string;
}) {
  const [deferred, setDeferred] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function onClick() {
    if (deferred) {
      deferred.prompt();
      try {
        await deferred.userChoice;
      } catch {
        /* ignore */
      }
      setDeferred(null);
    } else {
      window.location.href = "/install";
    }
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      📱 Get the app
    </button>
  );
}
