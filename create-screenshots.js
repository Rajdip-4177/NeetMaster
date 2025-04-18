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

// Function to create a screenshot
function createScreenshot(width, height, filename, backgroundColor = '#ffffff') {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  
  // Header with brand color
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(0, 0, width, 60);
  
  // Brand text in header
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('NEET MASTER', 20, 30);
  
  // Content area - mock UI elements
  // Subject cards
  const subjects = ['Physics', 'Chemistry', 'Biology'];
  subjects.forEach((subject, index) => {
    const y = 100 + (index * 120);
    
    // Card background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(20, y, width - 40, 100);
    
    // Subject title
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(subject, 40, y + 30);
    
    // Progress bar background
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(40, y + 60, width - 80, 15);
    
    // Progress bar fill - random value
    const progress = Math.random() * (width - 80);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(40, y + 60, progress, 15);
  });
  
  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, filename), buffer);
  console.log(`Created screenshot: ${filename}`);
}

// Create screenshots
createScreenshot(540, 720, 'screenshot1.png');
createScreenshot(540, 720, 'screenshot2.png', '#f9f9f9');

console.log('Screenshot generation complete!'); 