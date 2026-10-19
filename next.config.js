/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone for Docker/Coolify deployment
  output: "standalone",

  // Allow Supabase and Stripe image domains if needed
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  // Suppress ESLint errors during build (fix in CI instead)
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
