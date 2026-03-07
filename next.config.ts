import nextra from "nextra";
import path from "path";

const withNextra = nextra({
  contentDirBasePath: "/docs",
});

export default withNextra({
  turbopack: {
    root: path.join(__dirname, "."),
  },
  reactStrictMode: false,
});
