import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Disable Turbopack to avoid Windows symlink permission issues
  // Turbopack requires admin privileges for symlinks on Windows
  // Using standard webpack bundler instead
  
  // Fix multiple lockfiles warning by setting explicit root
  outputFileTracingRoot: path.join(__dirname),
  
  // External packages that should not be bundled (moved from experimental in Next.js 16)
  serverExternalPackages: ['mongoose', 'mongodb'],
  
  // Image optimization configuration
  images: {
    qualities: [75, 95],
  },
  
  // Webpack configuration for better performance
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
