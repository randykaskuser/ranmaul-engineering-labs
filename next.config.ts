import type { NextConfig } from "next";

function buildCspReportOnly() {
  // Phase 3.7 hardening: start with Report-Only so we can tune safely.
  // NOTE: update connect-src if you add analytics/APIs later.
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    // Allow inline styles for Tailwind/Next style tags (tradeoff: weaker than strict CSP)
    "style-src 'self' 'unsafe-inline'",
    // No inline scripts allowed by default.
    "script-src 'self'",
    // Images can come from self + https data (covers local media + Notion downloaded media)
    "img-src 'self' data: https:",
    // Fonts from self + Google Fonts (used via next/font)
    "font-src 'self' https: data:",
    "connect-src 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];
  return directives.join("; ");
}

const nextConfig: NextConfig = {
  // Security hardening (Phase 3.7)
  // Keep defaults secure, reduce browser attack surface.
  async headers() {
    const cspReportOnly = buildCspReportOnly();
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

          // Start in Report-Only to avoid breaking future embeds/MDX.
          { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
        ],
      },
    ];
  },
};

export default nextConfig;
