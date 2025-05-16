# Spotify Clone

A Spotify-like web player built using HTML, CSS and JavaScript with an Express backend.

## Setup Instructions

1. Install dependencies:

   ```
   npm install
   ```

2. Start the server:

   ```
   node index.js
   ```

3. Visit `http://localhost:3000` in your browser

4. Make sure to add MP3, M4A, or WAV files to the `public/songs` directory.
   - You can visit `http://localhost:3000/setup` to ensure the directories are created.

## Project Structure

- `index.html` - Main application HTML
- `style.css`, `utility.css`, `mobile.css` - Styling
- `script.js` - Frontend JavaScript
- `index.js` - Express server
- `public/` - Static files directory
  - `public/songs/` - Directory for music files
  - `public/resources/` - Icons and images

## Features

- Responsive design for desktop and mobile
- Music playback controls
- Song list display
- Progress bar and volume control
