import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ['localhost', process.env.NEXT_PUBLIC_FILES_URL?.replace(/^https?:\/\//, '') || ''],
  },
};

export default nextConfig;
