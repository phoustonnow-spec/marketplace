"use client";

import { useEffect } from "react";

// Registers the pass-through service worker so phones offer "Install app".
export default function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // ignore — installability just won't be offered; site still works.
      });
    }
  }, []);
  return null;
}
