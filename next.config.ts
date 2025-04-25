import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_URL: "https://walegrills-backend.onrender.com",
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
