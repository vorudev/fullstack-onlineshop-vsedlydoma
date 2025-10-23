import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
    // Игнорировать ошибки ESLint во время production build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
