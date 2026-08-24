import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@calc/engine", "@calc/shared"],
};

export default nextConfig;
