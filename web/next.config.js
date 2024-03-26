const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "auth.viarezo.fr",
        port: "",
        pathname: "/media/**",
      },
    ],
  }
};

module.exports = nextConfig;
