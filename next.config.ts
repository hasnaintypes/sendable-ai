import nextra from "nextra";
import path from "path";

const withNextra = nextra({
  contentDirBasePath: "/docs",
});

export default withNextra({
  turbopack: {
    root: path.join(__dirname, "."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
    ],
  },
  reactStrictMode: false,
});
