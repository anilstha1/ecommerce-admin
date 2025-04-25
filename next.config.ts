import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qznpqobe1g.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
