import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Also serve CSS and JS files from root
app.use(express.static(__dirname));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve the HTML page for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route to list all songs
app.get("/songs", (req, res) => {
  const songsDir = path.join(__dirname, "public", "songs");

  console.log("Checking songs directory:", songsDir);

  // Create songs directory if it doesn't exist
  if (!fs.existsSync(songsDir)) {
    console.log("Songs directory doesn't exist, creating it");
    fs.mkdirSync(songsDir, { recursive: true });
  }

  fs.readdir(songsDir, (err, files) => {
    if (err) {
      console.error("Error reading songs directory:", err);
      return res.status(500).send("Error reading songs directory");
    }

    console.log("Files in songs directory:", files);

    // Filter for audio files
    const audioFiles = files.filter(
      (file) =>
        file.endsWith(".mp3") || file.endsWith(".m4a") || file.endsWith(".wav")
    );

    console.log("Audio files found:", audioFiles);

    // If no audio files found, create a message
    if (audioFiles.length === 0) {
      return res.send(`
        <div>
          <p>No songs found in the public/songs directory.</p>
          <p>Please add some audio files to the public/songs directory.</p>
          <a href="/songs/sample1.mp3">sample1.mp3</a><br>
          <a href="/songs/sample2.mp3">sample2.mp3</a><br>
          <a href="/songs/sample3.mp3">sample3.mp3</a><br>
        </div>
      `);
    }

    // Create HTML list of songs with proper URLs
    const songLinks = audioFiles
      .map(
        (file) => `<a href="/songs/${encodeURIComponent(file)}">${file}</a><br>`
      )
      .join("");

    res.send(`<div>${songLinks}</div>`);
  });
});

// Handle default song requests when real files don't exist
app.get("/songs/:songName", (req, res) => {
  const songPath = path.join(__dirname, "public", "songs", req.params.songName);

  // Check if the song exists
  if (fs.existsSync(songPath)) {
    return res.sendFile(songPath);
  }

  // For sample songs that don't exist, return a 404 with helpful message
  console.log(`Song not found: ${songPath}`);
  res.status(404).send(`
    <html>
      <body style="font-family: Arial; color: #333;">
        <h2>Song Not Found</h2>
        <p>The song "${
          req.params.songName
        }" was not found in the songs directory.</p>
        <p>Please add some audio files to the public/songs directory:</p>
        <code>${path.join(__dirname, "public", "songs")}</code>
      </body>
    </html>
  `);
});

// Create sample file to ensure directories are set up
app.get("/setup", (req, res) => {
  try {
    const songsDir = path.join(__dirname, "public", "songs");

    // Ensure directories exist
    if (!fs.existsSync(path.join(__dirname, "public"))) {
      fs.mkdirSync(path.join(__dirname, "public"), { recursive: true });
    }

    if (!fs.existsSync(songsDir)) {
      fs.mkdirSync(songsDir, { recursive: true });
    }

    res.send(`
      <html>
        <body style="font-family: Arial; color: #333;">
          <h2>Setup Complete</h2>
          <p>Directories created successfully.</p>
          <p>Please add MP3, M4A, or WAV files to this directory:</p>
          <code>${songsDir}</code>
          <p><a href="/">Go back to the player</a></p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`Error during setup: ${error.message}`);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/setup to initialize directories`);
});
