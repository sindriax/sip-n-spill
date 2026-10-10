import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  ...(isProduction
    ? { output: "export" }
    : { rewrites: async () => [{ source: "/api/:path*", destination: "http://127.0.0.1:8787/api/:path*" }] }),
};

export default nextConfig;
