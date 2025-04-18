const { networkInterfaces } = require('os');

const getLocalIpAddress = () => {
  const nets = networkInterfaces();
  const results = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  // Format the results for display
  console.log('\n==========================================================');
  console.log('🌐 NEET MASTER PWA - LOCAL NETWORK ACCESS INFO 🌐');
  console.log('==========================================================');
  console.log('\nYour app is running with the following addresses:');
  console.log('\n📱 On your phone (same WiFi network), go to:');
  
  let foundIp = false;
  for (const [name, addresses] of Object.entries(results)) {
    if (addresses.length > 0) {
      addresses.forEach(address => {
        console.log(`   https://${address}:5000`);
        foundIp = true;
      });
    }
  }
  
  if (!foundIp) {
    console.log('   No network interfaces found. Make sure you\'re connected to WiFi.');
  }
  
  console.log('\n⚠️  Your browser will show a security warning about the certificate.');
  console.log('   This is normal for local development. Click "Advanced" and proceed.');
  console.log('\n🔍 To install the PWA on your phone:');
  console.log('   iOS: Use "Add to Home Screen" in the share menu');
  console.log('   Android: Look for "Add to Home Screen" or "Install" in menu');
  console.log('\n==========================================================\n');
};

getLocalIpAddress(); 