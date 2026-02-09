import path from "node:path";

const config = {
  webpack: {
    alias: {
      Editor: path.resolve(__dirname, "src/Editor/"),
      resources: path.resolve(__dirname, "src/resources/"),
    },
  },
};

export default config;
