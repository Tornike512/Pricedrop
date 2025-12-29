/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.my.ge",
        pathname: "/myauto/**",
      },
    ],
  },
};

export default nextConfig;
