import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // パフォーマンス最適化
  poweredByHeader: false,
  compress: true,
  
  // CSS最適化を無効化（critters エラー回避）
  // experimental: {
  //   optimizeCss: true,
  // },
  
  // 画像最適化（必要時）
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
