const C = "so-v1";
const SHELL = ["./", "index.html", "GraffitiYouth-Regular.otf", "manifest.json", "icon-192.png", "icon-512.png", "firebase-config.js"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  const ok = u.origin === location.origin || u.hostname.endsWith("gstatic.com") || u.hostname === "fonts.googleapis.com";
  if (!ok) return;
  e.respondWith(
    fetch(r).then(res => {
      if (res && (res.ok || res.type === "opaque")) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); }
      return res;
    }).catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match("index.html")))
  );
});
