import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  const distPath = path.resolve(import.meta.dirname, "public");
  const fallbackPath = path.resolve(process.cwd(), "dist", "public");
  const resolvedPath = fs.existsSync(distPath) ? distPath : fallbackPath;

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(
      `Could not find the build directory: ${resolvedPath} (tried ${distPath} and ${fallbackPath}), make sure to build the client first`,
    );
  }

  app.use(express.static(resolvedPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(resolvedPath, "index.html"));
  });
}

(async () => {
  await runApp(serveStatic);
})();
