const path = require("path");

export default {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Tenorer",
      fileName: (format) => `Tenorer.${format}.js`,
    },
    minify: true,
  },
};
