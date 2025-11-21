import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  // Vite builds to dist/public, so serve from there
  const publicPath = path.join(process.cwd(), "dist", "public");
  
  console.log("[Static] Serving static files from:", publicPath);
  
  if (!fs.existsSync(publicPath)) {
    console.error("[Static] Static files NOT found at:", publicPath);
    console.error("[Static] Current directory contents:", fs.readdirSync(process.cwd()).slice(0, 20));
    throw new Error(`Could not find static files at ${publicPath}`);
  }

  // Serve static files
  app.use(express.static(publicPath));

  // SPA fallback: serve index.html for all non-API routes
  app.use("*", (_req, res) => {
    const indexPath = path.join(publicPath, "index.html");
    if (!fs.existsSync(indexPath)) {
      return res.status(500).send("index.html not found");
    }
    res.sendFile(indexPath);
  });
}

(async () => {
  await runApp(serveStatic);
})();
