import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async rewrites() {
    // Dev: proxy /ingest/* to PostHog (so api_host='/ingest' works)
    if (process.env.NODE_ENV === "development") {
      return [
        { source: "/ingest/:path*", destination: "https://us.posthog.com/:path*" },
      ];
    }
    return [];
  },
};

export default config;
