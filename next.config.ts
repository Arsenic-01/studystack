import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["cloud.appwrite.io"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2000mb",
    },
  },
};

export default nextConfig;
