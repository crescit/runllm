/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_LANGSERVER_URL: process.env.NEXT_PUBLIC_LANGSERVER_URL || 'http://localhost:5001',
        NEXT_PUBLIC_APISERVER_URL: process.env.NEXT_PUBLIC_APISERVER_URL || 'https://2452-2600-1010-a020-4203-cddb-bd43-d44e-5b1a.ngrok-free.app/api',
    },
    // output: 'standalone',
    // assetPrefix: 'https://7fe8-2600-1010-a020-4203-cddb-bd43-d44e-5b1a.ngrok-free.app'
}

module.exports = nextConfig
