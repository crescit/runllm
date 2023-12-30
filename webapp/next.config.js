/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_LANGSERVER_URL: "process.env.NEXT_PUBLIC_API_URL",
        NEXT_PUBLIC_APISERVER_URL: "process.env.NEXT_PUBLIC_API_KEY",
    },
}

module.exports = nextConfig;
