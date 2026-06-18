import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // React Compiler تمريرة Babel ثقيلة جداً على الذاكرة/المعالج لكل ملف. على أجهزة
  // محدودة الذاكرة تسبّب ذروة تُفشِل توليد عمّال webpack ("Jest worker child process
  // exceptions") مع ملفات الأدمن الضخمة. نقصرها على الإنتاج: البناء النهائي يبقى
  // مُحسَّناً، والتطوير يصبح أخفّ بكثير (السلوك الوظيفي مطابق، فقط دون حفظ تلقائي للذاكرة).
  reactCompiler: process.env.NODE_ENV === 'production',
  // Disable Turbopack to avoid Windows symlink permission issues
  // Turbopack requires admin privileges for symlinks on Windows
  // Using standard webpack bundler instead

  // يقلّل ذروة استهلاك ذاكرة webpack (مقابل بطء ترجمة طفيف). يمنع انهيار
  // عمّال خادم التطوير ("Jest worker child process exceptions") على أجهزة
  // محدودة الذاكرة مع reactCompiler + ملفات الأدمن الضخمة. خيار Next.js رسمي.
  experimental: {
    webpackMemoryOptimizations: true,
  },

  // أبقِ عدداً أقل من الصفحات المترجَمة في الذاكرة أثناء التطوير (تقليل البصمة).
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

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
