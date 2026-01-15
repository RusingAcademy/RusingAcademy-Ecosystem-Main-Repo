import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
// DISABLED: vite-plugin-manus-runtime causes React mounting issues
// import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
import { visualizer } from "rollup-plugin-visualizer";


const plugins = [
  react(), 
  tailwindcss(), 
  jsxLocPlugin(), 
  // DISABLED: This plugin injects a 360KB inline script that conflicts with React
  // vitePluginManusRuntime(),
  // Bundle analyzer - generates stats.html in dist
  visualizer({
    filename: 'dist/stats.html',
    open: false,
    gzipSize: true,
    brotliSize: true,
  }),
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Performance optimizations
    target: 'es2020',
    // Use esbuild for minification (default, no extra dependency needed)
    minify: 'esbuild',
    // SIMPLIFIED: Remove complex manual chunks to avoid circular dependency issues
    // The previous configuration caused React initialization order problems
    // Vite's default chunking is safer and handles dependencies correctly
    rollupOptions: {
      output: {
        // Only split React into its own chunk to ensure it loads first
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 1000, // Increased since we're not splitting as much
    sourcemap: false,
    cssCodeSplit: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      'wouter',
    ],
    // Exclude heavy libraries from pre-bundling to enable lazy loading
    exclude: [
      'jspdf',
      'jspdf-autotable',
      'streamdown',
      'mermaid',
      'katex',
      'rehype-katex',
      'remark-math',
    ],
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
