const path = require("path");

module.exports = {
  webpack: {
    alias: {
      Editor: path.resolve(__dirname, "src/Editor/"),
      resources: path.resolve(__dirname, "src/resources/"),
    },
  },
};
