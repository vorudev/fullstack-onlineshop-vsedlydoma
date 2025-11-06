import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
    // Игнорировать ошибки ESLint во время production build
    ignoreDuringBuilds: true,
  },
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
