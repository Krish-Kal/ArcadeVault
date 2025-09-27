export default async function handler(req, res) {
  const RAWG_BASE = "https://api.rawg.io/api";
  const RAWG_KEY = process.env.RAWG_KEY || process.env.VITE_RAWG_KEY;
  if (!RAWG_KEY) return res.status(500).json({ error: "Missing RAWG_KEY env var" });

  try {
    const forwardedPath = req.url.replace(/^\/api\/rawg/, "") || "/games";
    const separator = forwardedPath.includes("?") ? "&" : "?";
    const target = `${RAWG_BASE}${forwardedPath}${separator}key=${encodeURIComponent(RAWG_KEY)}`;

    const r = await fetch(target);
    const text = await r.text();
    const ct = r.headers.get("content-type") || "";

    res.status(r.status);
    if (ct.includes("application/json")) {
      res.setHeader("Content-Type", "application/json");
      res.send(text);
    } else {
      res.send(text);
    }
  } catch (err) {
    console.error("RAWG proxy error:", err);
    res.status(502).json({ error: "RAWG proxy error", detail: err.message });
  }
}