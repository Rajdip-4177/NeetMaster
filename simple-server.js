import express from 'express';
import { networkInterfaces } from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple express server
const app = express();
const PORT = 8080; // Try a different port

// Serve static files
app.use(express.static(path.join(__dirname, 'dist', 'public')));

// Handle all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'public', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  // Get all IPv4 addresses
  const interfaces = networkInterfaces();
  const addresses = Object.values(interfaces)
    .flat()
    .filter(details => details.family === 'IPv4' && !details.internal)
    .map(details => details.address);

  console.log('\n==========================================================');
  console.log('🌐 NEET MASTER PWA - SIMPLE SERVER 🌐');
  console.log('==========================================================');
  console.log('\nServer running on:');
  console.log(`- Local: http://localhost:${PORT}`);
  
  if (addresses.length > 0) {
    console.log('\n- On your mobile device, try:');
    addresses.forEach(address => {
      console.log(`  http://${address}:${PORT}`);
    });
  }
  
  console.log('\n==========================================================');
}); 