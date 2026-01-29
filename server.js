const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "db.json";

// Load database
function loadDB() {
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// Save database
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Health Check API
app.get("/api/healthz", (req, res) => {
  res.json({ ok: true });
});

// Create Paste
app.post("/api/pastes", (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "Invalid content" });
  }

  const id = uuidv4();
  const now = Date.now();

  const paste = {
    content,
    created_at: now,
    ttl_seconds: ttl_seconds || null,
    max_views: max_views || null,
    views: 0
  };

  const db = loadDB();
  db[id] = paste;
  saveDB(db);

  res.json({
    id,
    url: `http://localhost:3000/p/${id}`
  });
});

// Get Paste API
app.get("/api/pastes/:id", (req, res) => {
  const db = loadDB();
  const paste = db[req.params.id];

  if (!paste) return res.status(404).json({ error: "Not found" });

  const now = Date.now();

  // TTL check
  if (paste.ttl_seconds && now > paste.created_at + paste.ttl_seconds * 1000) {
    delete db[req.params.id];
    saveDB(db);
    return res.status(404).json({ error: "Expired" });
  }

  // View limit check
  if (paste.max_views && paste.views >= paste.max_views) {
    delete db[req.params.id];
    saveDB(db);
    return res.status(404).json({ error: "View limit reached" });
  }

  // Count view
  paste.views++;
  db[req.params.id] = paste;
  saveDB(db);

  res.json({
    content: paste.content,
    remaining_views: paste.max_views ? paste.max_views - paste.views : null,
    expires_at: paste.ttl_seconds ? new Date(paste.created_at + paste.ttl_seconds * 1000) : null
  });
});

// Serve paste HTML page
app.get("/p/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "paste.html"));
});

// Start Server
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
