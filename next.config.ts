import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  experimental: {
    // (ja)/(en) の複数ルートレイアウト構成では、トップレベル layout が
    // 存在しないため global-not-found.tsx で 404 を定義する（v15.4+）。
    globalNotFound: true,
  },
};

export default nextConfig;
