const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer to keep original filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep original filename
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// ✅ Serve frontend from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve uploaded images
app.use("/uploads", express.static(uploadDir));

// --- TEXT QUERY API ---
app.post("/api/query", (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required." });
  res.json({ answer: `🤖 You asked: "${query}". This is the AI response.` });
});

// --- IMAGE ANALYSIS API ---
app.post("/api/analyze-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Image file is required." });

  // Return URL of uploaded image
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.originalname}`;

  res.json({
    result: "🌱 Image analysis result: Healthy crop detected.",
    imageUrl
  });
});

// --- WEATHER API ---
app.get("/api/weather", (req, res) => {
  const location = req.query.location;
  if (!location) return res.status(400).json({ error: "Location is required." });

  res.json({
    location,
    temperature: 28,
    humidity: 65,
    conditions: "Partly Cloudy",
    advisory: "Good time for irrigation 🌾"
  });
});

// --- CONTACT API ---
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "All fields are required." });

  console.log("📩 New message:", { name, email, message });
  res.json({ success: true, message: "✅ Your message has been received!" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Full app running on http://localhost:${PORT}`);
});
