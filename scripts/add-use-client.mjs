import { promises as fs } from "fs";
import path from "path";

const projectRoot = path.resolve(process.cwd(), "app", "reactcomponents");
const validExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);

async function ensureUseClient(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  const trimmed = content.trimStart();
  if (
    trimmed.startsWith("'use client';") ||
    trimmed.startsWith('"use client";') ||
    trimmed.startsWith("/* use client */")
  ) {
    return;
  }
  const updated = `'use client';\n\n${content}`;
  await fs.writeFile(filePath, updated, "utf8");
  console.log(`Added 'use client' to ${path.relative(process.cwd(), filePath)}`);
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (validExtensions.has(path.extname(entry.name))) {
      await ensureUseClient(fullPath);
    }
  }
}

await walk(projectRoot);

