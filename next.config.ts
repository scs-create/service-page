import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "Academy" is now "Corporate College" — keep old links and search rankings working.
  async redirects() {
    return [
      { source: "/academy", destination: "/corporate-college", permanent: true },
      { source: "/academy/:path*", destination: "/corporate-college/:path*", permanent: true },
    ];
  },
  /* config options here */
};

export default nextConfig;
