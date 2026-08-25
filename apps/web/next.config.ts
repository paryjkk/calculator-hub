import type { NextConfig } from "next";

const API_PROXY_URL = process.env.API_PROXY_URL;

const nextConfig: NextConfig = {
  transpilePackages: ["@calc/engine", "@calc/shared"],
  async rewrites() {
    // Built-in route handlers serve auth/me/admin/site-config by default.
    // Setting API_PROXY_URL switches those paths to an external NestJS API.
    if (!API_PROXY_URL) return [];
    return [
      {
        source: "/api/v1/auth/:path*",
        destination: `${API_PROXY_URL}/api/v1/auth/:path*`,
      },
      {
        source: "/api/v1/me/:path*",
        destination: `${API_PROXY_URL}/api/v1/me/:path*`,
      },
      {
        source: "/api/v1/admin/:path*",
        destination: `${API_PROXY_URL}/api/v1/admin/:path*`,
      },
      {
        source: "/api/v1/site-config/:path*",
        destination: `${API_PROXY_URL}/api/v1/site-config/:path*`,
      },
    ];
  },
};

export default nextConfig;
