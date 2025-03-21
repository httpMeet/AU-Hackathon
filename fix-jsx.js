// fix-jsx.js
// A script to rename .js files with JSX content to .jsx files
// Run with: node fix-jsx.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to check if a file contains JSX
function containsJSX(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Simple pattern matching for JSX syntax
    return /<[A-Za-z][A-Za-z0-9]*/.test(content) || 
           /React\.createElement/.test(content) ||
           /import.*from ['"]react['"]/.test(content);
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return false;
  }
}

// Function to recursively process directories
function processDirectory(directory) {
  try {
    const items = fs.readdirSync(directory);
    
    for (const item of items) {
      const itemPath = path.join(directory, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        // Skip node_modules and dist directories
        if (item !== 'node_modules' && item !== 'dist') {
          processDirectory(itemPath);
        }
      } else if (stats.isFile() && item.endsWith('.js')) {
        // Check if the .js file contains JSX
        if (containsJSX(itemPath)) {
          const newPath = itemPath.replace('.js', '.jsx');
          
          // Update imports in the file
          let content = fs.readFileSync(itemPath, 'utf8');
          
          // Replace .js imports with .jsx for local files
          content = content.replace(/from ['"]\.\/([^'"]+)\.js['"]/g, "from './$1.jsx'");
          content = content.replace(/from ['"]\.\.\/([^'"]+)\.js['"]/g, "from '../$1.jsx'");
          
          // Write updated content to the new .jsx file
          fs.writeFileSync(newPath, content);
          
          // Delete the original .js file
          fs.unlinkSync(itemPath);
          
          console.log(`Renamed ${itemPath} to ${newPath}`);
        }
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${directory}:`, err);
  }
}

// Update index.html to point to main.jsx if needed
function updateIndexHtml() {
  const indexPath = path.join(__dirname, 'index.html');
  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    if (content.includes('src="/src/main.js"')) {
      content = content.replace('src="/src/main.js"', 'src="/src/main.jsx"');
      fs.writeFileSync(indexPath, content);
      console.log('Updated index.html to point to main.jsx');
    }
  } catch (err) {
    console.error('Error updating index.html:', err);
  }
}

// Main execution
console.log('Starting JSX file conversion...');
const srcDir = path.join(__dirname, 'src');
processDirectory(srcDir);
updateIndexHtml();
console.log('Conversion complete!'); 