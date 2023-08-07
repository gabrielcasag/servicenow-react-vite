import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { decorateIndexHTML } from "./html-utils";

const htmlPlugin = () => {
  return {
    name: "html-transform",
    transformIndexHtml(html) {
      return decorateIndexHTML(html);
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  let config = {};

  if (command === "serve") {
    config.plugins = [react()];
  } else {
    config.plugins = [react(), htmlPlugin()];
  }

  config.build = {
    target: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
    rollupOptions: {
      output: {
        manualChunks: false,
        inlineDynamicImports: true,
        entryFileNames: "api/x_elsr_react_app/container/js" + "/[name]-js",
        // assetFileNames: "assets/[name]-[ext]",
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".").at(1);
          // let resource = "";
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `api/x_elsr_react_app/container/img/[name]-[hash:6]-[ext]`;
          } else if (/woff|woff2/.test(extType)) {
            return `api/x_elsr_react_app/container/assets/[name]-[hash:6]-[ext]`;
          } else {
            return `api/x_elsr_react_app/container/js/[name]-[ext]`;
          }
          // else if (/css/.test(extType)) {
          //   resource = "js";
          // }

          // return `api/x_elsr_react_app/container/${resource}/[name]-[extname]`;
        },
      },
    },
  };

  return config;
});
