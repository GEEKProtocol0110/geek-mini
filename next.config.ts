import type { NextConfig } from "next";

const shared = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // /embed is the shareable card other sites place in an iframe.
      { source: "/embed", headers: [...shared, { key: "Content-Security-Policy", value: "frame-ancestors *" }] },
      { source: "/((?!embed$).*)", headers: [...shared, { key: "X-Frame-Options", value: "SAMEORIGIN" }, { key: "Content-Security-Policy", value: "frame-ancestors 'self'" }] },
    ];
  },
};

export default nextConfig;
