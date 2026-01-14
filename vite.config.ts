import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
import { visualizer } from "rollup-plugin-visualizer";


const plugins = [
  react(), 
  tailwindcss(), 
  jsxLocPlugin(), 
  vitePluginManusRuntime(),
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
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core - critical, load first
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // Scheduler (React dependency)
          if (id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          
          // Radix UI components - UI library
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-radix';
          }
          
          // Charts - heavy library, separate chunk (lazy-loaded)
          if (id.includes('node_modules/recharts/') || id.includes('node_modules/d3-')) {
            return 'vendor-charts';
          }
          
          // Form libraries
          if (id.includes('node_modules/react-hook-form/') || id.includes('node_modules/@hookform/') || id.includes('node_modules/zod/')) {
            return 'vendor-forms';
          }
          
          // Framer Motion - animation library
          if (id.includes('node_modules/framer-motion/')) {
            return 'vendor-motion';
          }
          
          // Clerk auth - separate chunk for auth
          if (id.includes('node_modules/@clerk/')) {
            return 'vendor-clerk';
          }
          
          // TanStack Query - data fetching
          if (id.includes('node_modules/@tanstack/')) {
            return 'vendor-tanstack';
          }
          
          // Stripe - payment (lazy-loaded)
          if (id.includes('node_modules/@stripe/')) {
            return 'vendor-stripe';
          }
          
          // PDF generation - heavy, lazy-loaded
          if (id.includes('node_modules/jspdf') || id.includes('node_modules/jspdf-autotable')) {
            return 'vendor-pdf';
          }
          
          // Streamdown/Mermaid/KaTeX - AI Chat dependencies, lazy-loaded
          if (id.includes('node_modules/streamdown') || id.includes('node_modules/mermaid') || id.includes('node_modules/katex') || id.includes('node_modules/rehype-katex') || id.includes('node_modules/remark-math')) {
            return 'vendor-ai-chat';
          }
          
          // Date utilities
          if (id.includes('node_modules/date-fns/')) {
            return 'vendor-date';
          }
          
          // Lucide icons - tree-shakeable but still large
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-icons';
          }
          
          // Wouter routing
          if (id.includes('node_modules/wouter/')) {
            return 'vendor-router';
          }
          
          // Other node_modules
          if (id.includes('node_modules/')) {
            return 'vendor-other';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 500,
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
