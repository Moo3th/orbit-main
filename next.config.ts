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

  // تحويلات: صفحات /solutions/* القديمة أُزيلت لصالح /products/* المعتمدة
  async redirects() {
    return [
      { source: '/solutions/sms-platform', destination: '/products/sms', permanent: true },
      { source: '/solutions/whatsapp-business-api', destination: '/products/whatsapp', permanent: true },
      { source: '/solutions/otime', destination: '/products/o-time', permanent: true },
      { source: '/solutions/gov-gate', destination: '/products/gov-gate', permanent: true },
      { source: '/solutions/healthcare', destination: '/healthcare', permanent: true },
      // أي مسار /solutions آخر غير معروف يعود للصفحة الرئيسية
      { source: '/solutions', destination: '/', permanent: true },
      { source: '/solutions/:slug*', destination: '/', permanent: false },
    ];
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
