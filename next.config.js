/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"], // 허용할 호스트 추가
  },
};

module.exports = nextConfig;
