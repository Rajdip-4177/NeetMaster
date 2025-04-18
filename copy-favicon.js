import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting favicon copy process...');

// Ensure the public directory exists
const publicDir = path.join(__dirname, 'client', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
console.log(`Public directory: ${publicDir}`);

// Define source and destination paths
// Check for both possible file names
const possibleSources = [
  path.join(__dirname, 'favicon.png'),
  path.join(__dirname, 'favincon.png.png'),
  path.join(__dirname, 'favincon.png'),
  path.join(__dirname, 'app-icon.png')
];

// Find the first existing source file
let sourcePath = null;
for (const src of possibleSources) {
  if (fs.existsSync(src)) {
    sourcePath = src;
    console.log(`Found favicon at: ${sourcePath}`);
    break;
  }
}

if (!sourcePath) {
  console.error('Error: Could not find a favicon file. Checked these locations:');
  possibleSources.forEach(p => console.error(`- ${p}`));
  process.exit(1);
}

// Display the files in the current directory
console.log('\nListing files in root directory:');
fs.readdirSync(__dirname).forEach(file => {
  console.log(`- ${file}`);
});

// Define all the destination paths
const destPaths = {
  ico: path.join(publicDir, 'favicon.ico'),
  png: path.join(publicDir, 'favicon.png'),
  logo192: path.join(publicDir, 'logo192.png'),
  logo512: path.join(publicDir, 'logo512.png'),
  maskable: path.join(publicDir, 'maskable_icon.png')
};

// Copy the favicon to all locations
try {
  for (const [key, destPath] of Object.entries(destPaths)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied favicon to: ${destPath}`);
      
      // Double-check that the file exists
      if (fs.existsSync(destPath)) {
        console.log(`✅ Verified file exists: ${destPath}`);
      } else {
        console.log(`❌ File not created: ${destPath}`);
      }
    } catch (err) {
      console.error(`Error copying to ${destPath}:`, err.message);
    }
  }
  
  console.log('\nFavicon copy process completed!');
  
  // Verify the files were created
  console.log('\nVerifying files in public directory:');
  if (fs.existsSync(publicDir)) {
    fs.readdirSync(publicDir).forEach(file => {
      console.log(`- ${file}`);
    });
  } else {
    console.error(`Public directory not found: ${publicDir}`);
  }
} catch (error) {
  console.error('Error in favicon copy process:', error);
} 