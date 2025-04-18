# NEET MASTER

A comprehensive web application for NEET exam preparation, featuring subject-wise learning paths, chapter-based quizzes, and a dedicated study interface.

## Features

- **Organized Learning Structure**: Content organized by subjects and chapters
- **Interactive Quizzes**: Chapter-wise quizzes with detailed explanations
- **Progressive Web App**: Install on mobile devices for app-like experience
- **Offline Support**: Access content without an internet connection
- **Responsive Design**: Optimized for various screen sizes

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **PWA Support**: Service Worker, Manifest, Offline Capabilities

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database (or use the serverless option)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/neet-master.git
   cd neet-master
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file with the following:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/neet_master
   SESSION_SECRET=your_session_secret
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## PWA Setup

To set up the app as a Progressive Web App for mobile installation:

1. Generate icons and screenshots:
   ```
   npm run generate-icons
   npm run generate-screenshots
   ```

2. Run the PWA setup mode:
   ```
   npm run setup-pwa
   ```

3. Follow the instructions in the terminal to access and install the app on your mobile device.

For detailed installation instructions, see the [PWA-USER-GUIDE.md](./PWA-USER-GUIDE.md).

## Project Structure

- `/client` - Frontend React application
  - `/src` - Source code
    - `/components` - UI components
    - `/data` - Static data (subjects, chapters, questions)
    - `/pages` - App pages
- `/server` - Backend Express application
  - `/db` - Database configuration and models
  - `/routes` - API endpoints
- `/shared` - Shared types and utilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 