import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2000mb",
    },
  },
};

export default nextConfig;
