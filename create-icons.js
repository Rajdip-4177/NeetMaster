import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the public directory exists
const publicDir = path.join(__dirname, 'client', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Function to create an icon
function createIcon(size, filename, color = '#4CAF50') {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  
  // Text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.4}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NEET', size / 2, size / 2 - (size * 0.1));
  ctx.fillText('MASTER', size / 2, size / 2 + (size * 0.1));
  
  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, filename), buffer);
  console.log(`Created icon: ${filename}`);
}

// Create icons
createIcon(192, 'logo192.png');
createIcon(512, 'logo512.png');
createIcon(192, 'maskable_icon.png', '#4CAF50');

// Create favicon
createIcon(64, 'favicon.ico');

console.log('Icon generation complete!'); 