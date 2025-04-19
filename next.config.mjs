import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  register: true, // Automatically register the service worker
  skipWaiting: true, // Skip waiting for service worker activation
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    return config;
  },
};

export default pwaConfig(nextConfig);