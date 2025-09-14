import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/event/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/api/event/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

// Check if the SENTRY_ENABLED environment variable is set to 'true'
const sentryEnabled = process.env.SENTRY_ENABLED === "true";

// Conditionally wrap the config with Sentry
const configToExport = sentryEnabled
  ? withSentryConfig(nextConfig, {
      org: "studystack",
      project: "javascript-nextjs",
      silent: !process.env.CI,
      widenClientFileUpload: false,
      disableLogger: true,
      automaticVercelMonitors: false,
      telemetry: false,
    })
  : nextConfig; // If not enabled, export the plain config

export default configToExport;
