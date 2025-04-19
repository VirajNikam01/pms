import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  register: true, // Automatically register the service worker
  skipWaiting: true, // Skip waiting for service worker activation
  // disable: process.env.NODE_ENV === 'development', // Disable PWA in development
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other Next.js config options here, e.g., reactStrictMode: true
};

export default pwaConfig(nextConfig);