const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.asmcdae.in', 'ik.imagekit.io'],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
