import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import pkg from "./package.json";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => ({
  mounted: function() {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = './src/utils/index.js';
    document.body.appendChild(script);
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname,'./src')
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {

      }
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    sourcemap: mode === "production",
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
        exports: "named",
      },
    },
    minify: mode === "production",
  },
  clearScreen: false,
  server: {
    open: true,
    hmr: true,
    usePolling: true
  },
}));
