import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  // In Vercel, the dist folder is at the root of the deployed code
  const publicPath = path.join(process.cwd(), "public");
  
  console.log("[Static] Current working directory:", process.cwd());
  console.log("[Static] Looking for static files at:", publicPath);
  
  if (!fs.existsSync(publicPath)) {
    console.error("[Static] Static files not found at:", publicPath);
    console.error("[Static] Available directories:", fs.readdirSync(process.cwd()).slice(0, 10));
    throw new Error(`Could not find static files at ${publicPath}`);
  }

  // Serve static files from the public directory
  app.use(express.static(publicPath));

  // SPA fallback: serve index.html for all non-API routes
  app.use("*", (_req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

(async () => {
  await runApp(serveStatic);
})();
