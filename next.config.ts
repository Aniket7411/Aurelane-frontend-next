import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Hostinger deployment
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Configure Turbopack (empty config to silence warning, webpack will be used for build)
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias["react-router-dom"] = path.resolve(
      __dirname,
      "app/reactcomponents/lib/nextRouterAdapter.tsx"
    );
    return config;
  },
  // Ensure trailing slash for better compatibility with static hosting
  trailingSlash: true,
};

export default nextConfig;
