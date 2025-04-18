# NEET MASTER PWA Setup Guide

This guide explains how to test your NEET MASTER application as a PWA (Progressive Web App) on your mobile device.

## Prerequisites

- Your computer and mobile device must be connected to the same WiFi network
- Node.js and npm installed on your computer

## Step 1: Generate Icons

First, generate the necessary icons for your PWA:

```bash
npm run generate-icons
```

This will create:
- logo192.png (192×192 pixels)
- logo512.png (512×512 pixels) 
- maskable_icon.png (192×192 pixels, for Android adaptive icons)
- favicon.ico (64×64 pixels)

## Step 2: Run the Development Server with Network Access

Start the application with special network access configuration:

```bash
npm run setup-pwa
```

This command will:
1. Generate the PWA icons if you haven't already
2. Display your computer's local IP address
3. Start the development server with HTTPS enabled

## Step 3: Access on Your Mobile Device

1. On your mobile device, open your browser
2. Navigate to the URL shown in your terminal (usually something like `https://192.168.1.x:5000`)
3. Accept the security warning about the self-signed certificate
   - On Chrome: Click "Advanced" > "Proceed to [site]"
   - On Safari: Tap "Show Details" > "visit this website"

## Step 4: Install the PWA on Your Mobile Device

### On Android:
1. You should see an "Add to Home Screen" banner
2. Alternatively, open the browser menu (three dots) and select "Install app" or "Add to Home Screen"

### On iOS:
1. Tap the share icon (box with arrow)
2. Scroll down and select "Add to Home Screen"
3. Tap "Add" in the top right corner

## Troubleshooting

### "Cannot connect to server" error
- Make sure your phone and computer are on the same WiFi network
- Check if your computer's firewall is blocking the connection
- Try using your computer's IP address instead of localhost

### Certificate warnings
- This is normal for local development. Your browser will show warnings about the self-signed certificate
- You need to accept the security risk to proceed (this is only for local development)

### Icons not showing up
- Run `npm run generate-icons` again
- Check that the icon files exist in the `client/public` directory

### PWA not installable
- Make sure you've accessed the site with HTTPS
- Refresh the page a few times
- Check Chrome/Safari developer tools for any manifest or service worker errors 