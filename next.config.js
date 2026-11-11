/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', 'react-globe.gl', 'echarts', 'echarts-for-react'],
  webpack: (config) => {
    config.externals = [...(config.externals || [])];
    return config;
  },
};

module.exports = nextConfig;
