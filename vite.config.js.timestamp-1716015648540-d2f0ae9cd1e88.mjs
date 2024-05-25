// vite.config.js
import path from "node:path";
import { optimizeLodashImports } from "file:///D:/Project/digikarir/node_modules/@optimize-lodash/rollup-plugin/dist/index.mjs";
import react from "file:///D:/Project/digikarir/node_modules/@vitejs/plugin-react/dist/index.mjs";
import laravel from "file:///D:/Project/digikarir/node_modules/laravel-vite-plugin/dist/index.js";
import { defineConfig } from "file:///D:/Project/digikarir/node_modules/vite/dist/node/index.js";
import removeConsole from "file:///D:/Project/digikarir/node_modules/vite-plugin-remove-console/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\Project\\digikarir";
var vite_config_default = defineConfig({
  plugins: [
    laravel({
      input: [
        "resources/css/app.css",
        "resources/js/app.jsx"
      ],
      refresh: true
    }),
    react({ babel: { babelrc: true } }),
    optimizeLodashImports(),
    removeConsole()
  ],
  optimizeDeps: {
    include: ["@inertiajs/react"]
  },
  resolve: {
    alias: {
      "ziggy-js": path.resolve(__vite_injected_original_dirname, "vendor/tightenco/ziggy/dist")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0XFxcXGRpZ2lrYXJpclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUHJvamVjdFxcXFxkaWdpa2FyaXJcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Byb2plY3QvZGlnaWthcmlyL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHsgb3B0aW1pemVMb2Rhc2hJbXBvcnRzIH0gZnJvbSBcIkBvcHRpbWl6ZS1sb2Rhc2gvcm9sbHVwLXBsdWdpblwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IGxhcmF2ZWwgZnJvbSBcImxhcmF2ZWwtdml0ZS1wbHVnaW5cIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVtb3ZlQ29uc29sZSBmcm9tIFwidml0ZS1wbHVnaW4tcmVtb3ZlLWNvbnNvbGVcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgbGFyYXZlbCh7XG4gICAgICAgICAgICBpbnB1dDogW1xuICAgICAgICAgICAgICAgICdyZXNvdXJjZXMvY3NzL2FwcC5jc3MnLFxuICAgICAgICAgICAgICAgICdyZXNvdXJjZXMvanMvYXBwLmpzeCdcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICByZWZyZXNoOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICAgcmVhY3QoeyBiYWJlbDogeyBiYWJlbHJjOiB0cnVlIH0gfSksXG4gICAgICAgIG9wdGltaXplTG9kYXNoSW1wb3J0cygpLFxuICAgICAgICByZW1vdmVDb25zb2xlKCksXG4gICAgXSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgICAgaW5jbHVkZTogWyBcIkBpbmVydGlhanMvcmVhY3RcIl0sXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICBcInppZ2d5LWpzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwidmVuZG9yL3RpZ2h0ZW5jby96aWdneS9kaXN0XCIpLFxuICAgICAgICB9LFxuICAgIH0sXG59KTtcblxuXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9QLE9BQU8sVUFBVTtBQUNyUSxTQUFTLDZCQUE2QjtBQUN0QyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sbUJBQW1CO0FBTDFCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNKLE9BQU87QUFBQSxRQUNIO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxNQUNBLFNBQVM7QUFBQSxJQUNiLENBQUM7QUFBQSxJQUNELE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxLQUFLLEVBQUUsQ0FBQztBQUFBLElBQ2xDLHNCQUFzQjtBQUFBLElBQ3RCLGNBQWM7QUFBQSxFQUNsQjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1YsU0FBUyxDQUFFLGtCQUFrQjtBQUFBLEVBQ2pDO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxZQUFZLEtBQUssUUFBUSxrQ0FBVyw2QkFBNkI7QUFBQSxJQUNyRTtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
