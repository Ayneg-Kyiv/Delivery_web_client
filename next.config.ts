import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ['localhost',  'testonazureb0de.blob.core.windows.net'],
  },
  experimental:{
    serverActions:{
      bodySizeLimit: '50mb'
    }
  }
};

export default nextConfig;
