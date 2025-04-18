# NEET MASTER PWA - User Guide

This guide will help you install and use NEET MASTER as a Progressive Web App (PWA) on your mobile device.

## What is a PWA?

A Progressive Web App (PWA) allows you to install a web application on your mobile device, giving it an app-like experience with:
- Home screen icon
- Offline functionality
- Full-screen mode without browser UI
- Push notifications (in future updates)

## Installing NEET MASTER on Your Mobile Device

### Prerequisites
- Your phone and computer must be on the same WiFi network
- A modern browser (Chrome for Android, Safari for iOS)

### Step 1: Access the Web App on Your Mobile Device

1. On your computer, run:
   ```
   npm run setup-pwa
   ```

2. The terminal will display local network URLs (e.g., `https://192.168.1.X:5000`)

3. On your mobile device, open your browser and navigate to the displayed URL

4. Accept the security warning about the certificate
   - On Chrome: Tap "Advanced" > "Proceed to site"
   - On Safari: Tap "Show Details" > "visit this website"

### Step 2: Install the PWA

#### On Android:
1. A banner may appear at the bottom of the screen saying "Add NEET MASTER to Home screen"
2. If not, tap the three dots menu (⋮) in Chrome
3. Select "Install app" or "Add to Home Screen"
4. Tap "Install" in the prompt that appears

#### On iOS:
1. Tap the Share button (square with an arrow) at the bottom of Safari
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" in the top right corner

## Features of NEET MASTER PWA

### Offline Access
- Access previously viewed content even without an internet connection
- Quiz attempts are stored locally and synchronized when online
- Study materials are cached for offline reading

### App-Like Experience
- Full-screen interface without browser controls
- Smooth transitions between pages
- Native-feeling interactions

## Troubleshooting

### Installation Issues
- **Cannot connect to server**: Make sure your phone and computer are on the same WiFi network
- **Certificate warnings**: This is normal for local development. You must accept the security risk to proceed.
- **PWA not installable**: Refresh the page a few times. Make sure you've accessed the site with HTTPS.

### Performance Issues
- Clear the cache in your browser if the app seems outdated
- Reinstall the PWA if you encounter persistent problems

## Future PWA Features
- Push notifications for new content and reminders
- Background synchronization for quiz results
- Enhanced offline capabilities 