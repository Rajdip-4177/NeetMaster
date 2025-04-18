import { exec } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n==========================================================');
console.log('🔥 NEET MASTER PWA - FIREWALL CONFIGURATION 🔥');
console.log('==========================================================');
console.log('\nTo access your application from mobile devices, you need to allow it through Windows Firewall.');
console.log('\nThe following commands will create firewall rules to allow access to ports 5001 (HTTPS).');
console.log('\n⚠️ IMPORTANT: You will need administrator privileges to run these commands.');
console.log('\nWould you like to:');
console.log('1. Automatically add firewall rules (requires running as Administrator)');
console.log('2. Show me the commands to run manually');
console.log('3. Exit without changes');

rl.question('\nEnter your choice (1-3): ', (answer) => {
  switch(answer.trim()) {
    case '1':
      console.log('\nAttempting to add firewall rules automatically...');
      // Add inbound rule for port 5001
      exec('netsh advfirewall firewall add rule name="NEET Master App (Port 5001)" dir=in action=allow protocol=TCP localport=5001', (error, stdout, stderr) => {
        if (error) {
          console.log('\n❌ ERROR: Failed to add firewall rule. You probably need to run as Administrator.');
          console.log('Error details:', error.message);
          showManualInstructions();
        } else {
          console.log('\n✅ SUCCESS: Firewall rule added for port 5001.');
          console.log('\nYour application should now be accessible from other devices on your network.');
          console.log('Try accessing https://192.168.29.80:5001 from your mobile device.');
        }
        rl.close();
      });
      break;
    
    case '2':
      showManualInstructions();
      rl.close();
      break;
    
    case '3':
    default:
      console.log('\nExiting without changes. Note that your app may not be accessible from other devices.');
      rl.close();
      break;
  }
});

function showManualInstructions() {
  console.log('\n==========================================================');
  console.log('📋 MANUAL FIREWALL CONFIGURATION INSTRUCTIONS 📋');
  console.log('==========================================================');
  console.log('\n1. Open Command Prompt or PowerShell as Administrator');
  console.log('2. Run the following command:');
  console.log('\n   netsh advfirewall firewall add rule name="NEET Master App (Port 5001)" dir=in action=allow protocol=TCP localport=5001');
  console.log('\nThis will allow incoming connections to your application on port 5001.');
  console.log('\nAlternatively, you can use Windows Defender Firewall with Advanced Security:');
  console.log('1. Search for "Windows Defender Firewall with Advanced Security" in the Start menu');
  console.log('2. Click on "Inbound Rules" in the left panel');
  console.log('3. Click on "New Rule..." in the right panel');
  console.log('4. Select "Port" and click Next');
  console.log('5. Select "TCP" and enter "5001" as the port, click Next');
  console.log('6. Select "Allow the connection" and click Next');
  console.log('7. Check all network types and click Next');
  console.log('8. Name the rule "NEET Master App" and click Finish');
  console.log('==========================================================');
} 