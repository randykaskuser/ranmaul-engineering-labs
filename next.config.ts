import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security hardening (Phase 3.7)
  // Keep defaults secure, reduce browser attack surface.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Basic hardening headers (defense-in-depth)
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
              "interest-cohort=()",
            ].join(", "),
          },
          // HSTS should only be enabled when the site is served via HTTPS everywhere.
          // If you deploy behind HTTPS-only (e.g., Vercel/Cloudflare), keep this enabled.
          { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
