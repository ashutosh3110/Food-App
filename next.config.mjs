/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ashutosh-nextjs-demo-users-image.s3.ap-south-1.amazonaws.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };

export default nextConfig;
