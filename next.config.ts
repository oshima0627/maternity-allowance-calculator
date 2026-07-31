import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare（Workers 静的アセット / Pages）へ配信するため静的HTMLを書き出す
  // ビルド成果物は out/ に出力される
  output: 'export',

  // パフォーマンス最適化
  poweredByHeader: false,
  compress: true,

  // 静的エクスポートでは Next.js の画像最適化サーバーが使えないため無効化
  images: {
    unoptimized: true,
  },

  // セキュリティヘッダーは静的エクスポートでは headers() が無効になるため
  // public/_headers（Cloudflare 側で解釈される）に移動しました
};

export default nextConfig;
