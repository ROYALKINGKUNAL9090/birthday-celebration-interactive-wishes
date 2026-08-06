import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Increase JSON payload limit so base64 profile photos can be saved
app.use(express.json({ limit: "15mb" }));

// Persistent in-memory + JSON file store for shared wishes
const WISHES_FILE = path.join(process.cwd(), "wishes.json");
const wishesStore = new Map<string, any>();

// Load saved wishes on startup
if (fs.existsSync(WISHES_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(WISHES_FILE, "utf-8"));
    Object.entries(data).forEach(([id, wish]) => {
      wishesStore.set(id, wish);
    });
    console.log(`Loaded ${wishesStore.size} saved wishes from disk.`);
  } catch (err) {
    console.warn("Could not read wishes file", err);
  }
}

function saveWishesToDisk() {
  try {
    const obj = Object.fromEntries(wishesStore.entries());
    fs.writeFileSync(WISHES_FILE, JSON.stringify(obj), "utf-8");
  } catch (err) {
    console.warn("Could not save wishes to disk", err);
  }
}

// API Routes
app.post("/api/wishes", (req, res) => {
  try {
    const wishData = req.body;
    if (!wishData) {
      return res.status(400).json({ error: "Wish payload missing" });
    }

    // Generate random short ID
    const id = Math.random().toString(36).substring(2, 9);
    wishesStore.set(id, wishData);
    saveWishesToDisk();

    return res.json({ id, success: true });
  } catch (err) {
    console.error("Error saving wish:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/wishes/:id", (req, res) => {
  const { id } = req.params;
  const wish = wishesStore.get(id);

  if (!wish) {
    return res.status(404).json({ error: "Wish not found" });
  }

  return res.json({ wish, success: true });
});

async function startServer() {
  // Vite middleware for dev or static server for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();