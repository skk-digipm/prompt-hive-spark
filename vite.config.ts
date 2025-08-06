import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const isExtension = process.env.BUILD_TARGET === 'extension';
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && !isExtension &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: isExtension ? {
      outDir: 'dist-extension',
      rollupOptions: {
        input: {
          popup: path.resolve(__dirname, 'src/popup.tsx'),
          content: path.resolve(__dirname, 'src/content.ts'),
          background: path.resolve(__dirname, 'src/background.ts'),
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: 'assets/[name].[ext]'
        },
        external: ['fs', 'path', 'crypto']
      },
      target: 'es2020'
    } : undefined,
  };
});
