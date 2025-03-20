import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dvhzuracgv.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
