/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // valores usados por VibraHero: capas difuminadas (35/45), hero_3 (90),
    // wordmark/burst (100). 75 es el default de next/image.
    qualities: [35, 45, 75, 90, 100],
  },
};

export default nextConfig;
