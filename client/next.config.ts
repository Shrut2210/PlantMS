import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'plantsbazar.com',
      'dryfruitbasket.in',
      'plantparadise.in',
      'bhoomigardencentre.com',
      'nurserylive.com',
      'creativefarmer.in',
      'm.media-amazon.com'
    ],
  },
};

export default nextConfig;
