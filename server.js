import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { networkInterfaces } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files from the dist/public directory (the built frontend)
app.use(express.static(path.join(__dirname, 'dist', 'public')));

// For API requests, serve a simple message explaining this is a static server
app.use('/api', (req, res) => {
  console.log(`API request received: ${req.method} ${req.url}`);
  res.json({ 
    error: "API not available in static mode", 
    message: "This is a simplified server for demonstration purposes. For full functionality including login and API features, use the development server with npm run dev:mobile." 
  });
});

// For all other routes, serve the index.html file (frontend will handle routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'public', 'index.html'));
});

// Start the server
const server = createServer(app);
server.listen(PORT, '0.0.0.0', () => {
  // Get all network interfaces for this machine
  const interfaces = networkInterfaces();
  const addresses = Object.values(interfaces)
    .flat()
    .filter(details => details.family === 'IPv4' && !details.internal)
    .map(details => details.address);
  
  console.log('\n==========================================================');
  console.log('🌐 NEET MASTER PWA - STATIC SERVER RUNNING 🌐');
  console.log('==========================================================');
  console.log('\nYour app is running with the following addresses:');
  console.log(`\n🖥️  Local: http://localhost:${PORT}`);
  
  if (addresses.length > 0) {
    console.log('\n📱 On your phone (same WiFi network), go to:');
    addresses.forEach(address => {
      console.log(`   http://${address}:${PORT}`);
    });
  } else {
    console.log('\n⚠️ No external network interfaces found.');
  }
  
  console.log('\n⚠️ NOTE: This is a static server. API functionality like login is not available.');
  console.log('   For full functionality, use npm run dev:mobile instead.\n');
  console.log('\n🔍 To install the PWA on your phone:');
  console.log('   iOS: Use "Add to Home Screen" in the share menu');
  console.log('   Android: Look for "Add to Home Screen" or "Install" in menu');
  console.log('\n==========================================================\n');
}); 