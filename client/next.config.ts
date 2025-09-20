// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
      },
      {
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
