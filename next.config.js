/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/flow",
        headers: [
          { key: "Content-Type", value: "text/event-stream" },
          { key: "Cache-Control", value: "no-cache, no-transform" },
          { key: "Connection", value: "keep-alive" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
