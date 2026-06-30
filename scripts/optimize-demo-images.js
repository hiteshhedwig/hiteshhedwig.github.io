#!/usr/bin/env node
// Convert JPG/PNG images in a demo folder to WebP and update references.
// Usage: node scripts/optimize-demo-images.js <path-to-demo-dir>
// Example: node scripts/optimize-demo-images.js public/demos/ipt-infrastructure-...

import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const targetDir = process.argv[2];
if (!targetDir) {
  console.error("Usage: node scripts/optimize-demo-images.js <demo-dir>");
  process.exit(1);
}

const absDir = path.resolve(targetDir);

async function walkImages(dir, out = []) {
  for (const item of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) await walkImages(full, out);
    else if (/\.(jpg|jpeg|png)$/i.test(item.name)) out.push(full);
  }
  return out;
}

async function updateRefs(dir) {
  for (const item of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) { await updateRefs(full); continue; }
    if (!/\.(html|js|json)$/i.test(item.name)) continue;
    const text = await fs.readFile(full, "utf8");
    const updated = text.replace(/\.(jpg|jpeg|png)(?=[^a-zA-Z]|$)/gi, ".webp");
    if (updated !== text) {
      await fs.writeFile(full, updated, "utf8");
      console.log(`  updated refs: ${path.relative(absDir, full)}`);
    }
  }
}

function humanSize(bytes) {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

try {
  await fs.access(absDir);
} catch {
  console.error(`Directory not found: ${absDir}`);
  process.exit(1);
}

const images = await walkImages(absDir);
if (!images.length) {
  console.log("No JPG/PNG images found — already optimized.");
  process.exit(0);
}

console.log(`Found ${images.length} images in ${absDir}`);

let totalBefore = 0, totalAfter = 0, converted = 0, failed = 0;
for (const src of images) {
  const dest = src.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  const rel = path.relative(absDir, src);
  const before = (await fs.stat(src)).size;
  try {
    await execFileAsync("cwebp", ["-q", "82", src, "-o", dest]);
    const after = (await fs.stat(dest)).size;
    await fs.unlink(src);
    totalBefore += before;
    totalAfter += after;
    converted++;
    process.stdout.write(`\r  ${converted}/${images.length} converted…`);
  } catch (e) {
    console.error(`\n  FAILED: ${rel} — ${e.message}`);
    failed++;
  }
}

console.log(`\n\nUpdating file references…`);
await updateRefs(absDir);

const saved = totalBefore - totalAfter;
const pct = Math.round((saved / totalBefore) * 100);
console.log(`\nDone.`);
console.log(`  Converted : ${converted} files${failed ? ` (${failed} failed)` : ""}`);
console.log(`  Before    : ${humanSize(totalBefore)}`);
console.log(`  After     : ${humanSize(totalAfter)}`);
console.log(`  Saved     : ${humanSize(saved)} (${pct}%)`);
