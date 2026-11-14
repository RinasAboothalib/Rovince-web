/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.rovincetire.com" },
    ],
  },
};

export default nextConfig;
