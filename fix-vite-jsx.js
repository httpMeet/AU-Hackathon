// fix-vite-jsx.js
// A script to update Vite configuration to handle JSX in .js files
// Run with: node fix-vite-jsx.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update Vite config
function updateViteConfig() {
  const configPath = path.join(__dirname, 'vite.config.js');
  try {
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Check if we already have the JSX configuration
    if (!content.includes('esbuildOptions')) {
      // Add JSX configuration
      content = content.replace(
        /resolve:\s*{([^}]*)}/,
        `resolve: {$1,
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
  }`
      );
      
      fs.writeFileSync(configPath, content);
      console.log('Updated vite.config.js to handle JSX in .js files');
    } else {
      console.log('Vite config already has JSX configuration');
    }
  } catch (err) {
    console.error('Error updating vite.config.js:', err);
  }
}

console.log('Fixing Vite configuration for JSX in .js files...');
updateViteConfig();
console.log('Done!'); 