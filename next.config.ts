import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  transpilePackages: ['next-mdx-remote', 'rehype-pretty-code', 'shiki'],
  poweredByHeader: false,
};

export default nextConfig;
