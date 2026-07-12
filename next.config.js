/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      // Supabase Storage public URLs. Replace <project-ref> is not needed —
      // this wildcard allows any *.supabase.co storage host.
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};
module.exports = nextConfig;
