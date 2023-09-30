import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import os from "os";

const isHttpS = true; // This is a general flag to indicate if the server is running in https mode or not
const hostname = os.hostname();
const httPrefix = isHttpS ? `https://${hostname}` : "http://localhost";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: isHttpS ? hostname : "localhost",
    port: 3000,
    https: {
      ca: fs.readFileSync("../../openssl/server/xtvisionCA.crt"),
      key: fs.readFileSync(`../../openssl/${hostname}.key`),
      cert: fs.readFileSync(`../../openssl/${hostname}.crt`),
    },
    // proxy: {
    //   "/api": {
    //     target: "https://localhost:5001",
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  },

  plugins: [react()],
  resolve: {
    alias: {
      "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
      "~images": path.resolve(__dirname, "src/images"),
      "~styles": path.resolve(__dirname, "src/styles"),
    },
  },
});
