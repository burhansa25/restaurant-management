import type { NextConfig } from 'next'

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
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
  {
    protocol: 'https',
    hostname: 'restaurant-server-staging-053118362.azurewebsites.net',
    port: '',
    pathname: '/**',
  }
]

if (process.env.NEXT_PUBLIC_API_ENDPOINT) {
  try {
    const apiUrl = new URL(process.env.NEXT_PUBLIC_API_ENDPOINT)
    remotePatterns.push({
      protocol: apiUrl.protocol.replace(':', '') as 'http' | 'https',
      hostname: apiUrl.hostname,
      port: apiUrl.port,
      pathname: '/**',
    })
  } catch {
    // Keep static defaults when the endpoint is not a complete URL.
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
}

export default nextConfig
