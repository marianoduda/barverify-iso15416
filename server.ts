import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "BarVerify Server is running" });
  });

  const distPath = path.resolve(__dirname, "dist");
  const indexPath = path.join(distPath, "index.html");
  const isProduction = fs.existsSync(indexPath);

  if (isProduction) {
    console.log(`[PRODUCTION] Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
    
    app.get("*", (req, res) => {
      console.log(`[SPA Fallback] Serving index.html for: ${req.url}`);
      res.sendFile(indexPath);
    });
  } else {
    console.log("[DEVELOPMENT] Starting Vite dev server...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
