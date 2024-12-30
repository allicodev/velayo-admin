/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      dns: false,
      tls: false,
    };

    return config;
  },
  env: {
    NEXT_IS_PROD: process.env.IS_PROD,
  },
};

export default nextConfig;
