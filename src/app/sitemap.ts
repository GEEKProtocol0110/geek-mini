import type { MetadataRoute } from "next";

const base = "https://geek-mini.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/daily", "/speed", "/compete", "/leaderboard", "/progress", "/privacy"].map(path => ({ url: `${base}${path}` }));
}
