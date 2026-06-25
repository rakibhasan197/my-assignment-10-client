const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
        {
        protocol: "https",
        hostname: "i.ibb.co",
      },{
        protocol: "https",
        hostname: "brandmark.io",
      },
    ],
  },
};

export default nextConfig;