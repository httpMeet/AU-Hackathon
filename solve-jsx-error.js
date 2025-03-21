// solve-jsx-error.js
// A direct solution to fix JSX errors in the project
// Run with: node solve-jsx-error.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new vite.config.js file with JSX support
function createViteConfig() {
  const configContent = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.js', '.jsx', '.json']
  },
  esbuild: {
    loader: 'jsx',
    include: /\\.(jsx|js)$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
}));`;

  const configPath = path.join(__dirname, 'vite.config.js');
  fs.writeFileSync(configPath, configContent);
  console.log('Created new vite.config.js with JSX support');
}

// Main execution
console.log('Fixing JSX errors in the project...');
createViteConfig();
console.log('Fix complete! Try running the app now with `npm run dev`'); 