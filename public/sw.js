// Minimal pass-through service worker.
// Its only job is to make the app installable on Android/Chrome. It does NOT
// cache anything, so the site always serves fresh content (no stale pages).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // Intentionally empty: let the browser handle every request normally.
});
