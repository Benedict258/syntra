/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["pages", "components", "lib", "services", "src"]
  }
};

export default nextConfig;
