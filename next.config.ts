import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: isProduction ? "export" : undefined,
  images: { unoptimized: true },
  async rewrites() {
    return isProduction ? [] : [{ source: "/api/:path*", destination: "http://127.0.0.1:8787/api/:path*" }];
  },
};

export default nextConfig;
