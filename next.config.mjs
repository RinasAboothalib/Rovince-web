/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "www.rovincetire.com" }],
  },
  async redirects() {
    return [
      { source: "/resilient-solid-tires", destination: "/tires/resilient-solid", permanent: true },
      { source: "/press-on-band-tires", destination: "/tires/press-on-band", permanent: true },
      { source: "/skid-steer-tires", destination: "/tires/skid-steer", permanent: true },
      { source: "/port-tires", destination: "/tires/port", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
