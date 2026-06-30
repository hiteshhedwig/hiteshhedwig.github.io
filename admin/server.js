import express from "express";
import multer from "multer";
import matter from "gray-matter";
import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "src", "content");
const ARCHIVE = path.join(CONTENT, "_archive");
const PUBLIC_DIR = path.join(ROOT, "public");
const PUBLIC_IMAGES = path.join(PUBLIC_DIR, "images");

const COLLECTIONS = {
  blog: { dir: "blog", dated: true },
  projects: { dir: "projects", dated: false },
  videos: { dir: "videos", dated: true },
  bookmarks: { dir: "bookmarks", dated: false },
};

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));
// Serve the site's /public/ so EasyMDE preview can load /images/... assets
app.use(express.static(PUBLIC_DIR));

function safeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 200);
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

function collDir(type) {
  const c = COLLECTIONS[type];
  if (!c) throw new Error(`Unknown collection: ${type}`);
  return path.join(CONTENT, c.dir);
}

function serializeFrontmatter(fm) {
  // gray-matter stringify uses js-yaml under the hood
  return matter.stringify("", fm).trim() + "\n";
}

function writeMarkdown(filePath, frontmatter, body) {
  const text = matter.stringify(body || "", frontmatter);
  return fs.writeFile(filePath, text, "utf8");
}

// ── API ───────────────────────────────────────────────────────────────

app.get("/api/tags/:type", async (req, res) => {
  try {
    const dir = collDir(req.params.type);
    await ensureDir(dir);
    const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".md"));
    const tagSet = new Set();
    await Promise.all(
      files.map(async (f) => {
        const raw = await fs.readFile(path.join(dir, f), "utf8");
        const { data } = matter(raw);
        (data.tags || []).forEach((t) => tagSet.add(String(t).trim()));
      })
    );
    res.json({ tags: [...tagSet].sort() });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/list/:type", async (req, res) => {
  try {
    const type = req.params.type;
    const dir = collDir(type);
    await ensureDir(dir);
    const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".md"));
    const entries = await Promise.all(
      files.map(async (f) => {
        const raw = await fs.readFile(path.join(dir, f), "utf8");
        const { data } = matter(raw);
        return { filename: f, frontmatter: data };
      })
    );
    entries.sort((a, b) => {
      const ad = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
      const bd = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
      if (ad !== bd) return bd - ad;
      const ao = a.frontmatter.order ?? 99;
      const bo = b.frontmatter.order ?? 99;
      if (ao !== bo) return ao - bo;
      return a.filename.localeCompare(b.filename);
    });
    res.json({ entries });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/entry/:type/:filename", async (req, res) => {
  try {
    const { type } = req.params;
    const filename = safeName(req.params.filename);
    const filePath = path.join(collDir(type), filename);
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    res.json({ filename, frontmatter: data, body: content });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

app.post("/api/entry/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { filename, originalFilename, frontmatter, body } = req.body;
    if (!filename) throw new Error("filename required");
    const dir = collDir(type);
    await ensureDir(dir);
    const safeTarget = safeName(filename);
    const filePath = path.join(dir, safeTarget);
    if (originalFilename && originalFilename !== safeTarget) {
      const oldPath = path.join(dir, safeName(originalFilename));
      try {
        await fs.unlink(oldPath);
      } catch {}
    }
    await writeMarkdown(filePath, frontmatter || {}, body || "");
    res.json({ filename: safeTarget, ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Soft-delete: move into _archive/<type>/<filename>. _archive/ is outside
// each collection's glob base, so Astro will stop seeing it.
app.post("/api/archive/:type/:filename", async (req, res) => {
  try {
    const { type } = req.params;
    if (!COLLECTIONS[type]) throw new Error(`Unknown collection: ${type}`);
    const filename = safeName(req.params.filename);
    const src = path.join(collDir(type), filename);
    const destDir = path.join(ARCHIVE, type);
    await ensureDir(destDir);
    let dest = path.join(destDir, filename);
    // avoid clobbering an already-archived copy
    if (fssync.existsSync(dest)) {
      const stamp = Date.now().toString(36);
      const ext = path.extname(filename);
      const base = filename.slice(0, -ext.length);
      dest = path.join(destDir, `${base}.${stamp}${ext}`);
    }
    await fs.rename(src, dest);
    res.json({ ok: true, archived: path.basename(dest) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/api/restore/:type/:filename", async (req, res) => {
  try {
    const { type } = req.params;
    if (!COLLECTIONS[type]) throw new Error(`Unknown collection: ${type}`);
    const filename = safeName(req.params.filename);
    const src = path.join(ARCHIVE, type, filename);
    const destDir = collDir(type);
    await ensureDir(destDir);
    let dest = path.join(destDir, filename);
    if (fssync.existsSync(dest)) {
      const stamp = Date.now().toString(36);
      const ext = path.extname(filename);
      const base = filename.slice(0, -ext.length);
      dest = path.join(destDir, `${base}.${stamp}${ext}`);
    }
    await fs.rename(src, dest);
    res.json({ ok: true, restored: path.basename(dest) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/archive/:type", async (req, res) => {
  try {
    const { type } = req.params;
    if (!COLLECTIONS[type]) throw new Error(`Unknown collection: ${type}`);
    const dir = path.join(ARCHIVE, type);
    await ensureDir(dir);
    const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".md"));
    const entries = await Promise.all(
      files.map(async (f) => {
        const raw = await fs.readFile(path.join(dir, f), "utf8");
        const { data } = matter(raw);
        return { filename: f, frontmatter: data };
      })
    );
    res.json({ entries });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/archive/:type/:filename", async (req, res) => {
  try {
    const { type } = req.params;
    if (!COLLECTIONS[type]) throw new Error(`Unknown collection: ${type}`);
    const filename = safeName(req.params.filename);
    await fs.unlink(path.join(ARCHIVE, type, filename));
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Site files (about.md, config.md)

app.get("/api/site/:name", async (req, res) => {
  try {
    const name = safeName(req.params.name);
    const filePath = path.join(CONTENT, "site", name);
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    res.json({ frontmatter: data, body: content });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

app.post("/api/site/:name", async (req, res) => {
  try {
    const name = safeName(req.params.name);
    const filePath = path.join(CONTENT, "site", name);
    const { frontmatter, body } = req.body;
    await writeMarkdown(filePath, frontmatter || {}, body || "");
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Image upload

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const sub = safeName(req.query.subdir || "uploads") || "uploads";
      const dest = path.join(PUBLIC_IMAGES, sub);
      fssync.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = slugify(path.basename(file.originalname, ext)) || "image";
      const stamp = Date.now().toString(36);
      cb(null, `${base}-${stamp}${ext.toLowerCase()}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "no file" });
  const sub = safeName(req.query.subdir || "uploads") || "uploads";
  const url = `/images/${sub}/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

// ── Demo import ───────────────────────────────────────────────────────────
const PUBLIC_DEMOS = path.join(PUBLIC_DIR, "demo-assets");

async function walkDir(dir) {
  let fileCount = 0, totalSize = 0;
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      const sub = await walkDir(full);
      fileCount += sub.fileCount;
      totalSize += sub.totalSize;
    } else {
      fileCount++;
      totalSize += (await fs.stat(full)).size;
    }
  }
  return { fileCount, totalSize };
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  const items = await fs.readdir(src, { withFileTypes: true });
  for (const item of items) {
    const s = path.join(src, item.name);
    const d = path.join(dest, item.name);
    if (item.isDirectory()) await copyDir(s, d);
    else await fs.copyFile(s, d);
  }
}

function humanSize(bytes) {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

app.post("/api/demo/inspect", async (req, res) => {
  try {
    const { sourcePath } = req.body;
    if (!sourcePath) throw new Error("sourcePath required");
    const stat = await fs.stat(sourcePath);
    if (!stat.isDirectory()) throw new Error("path must be a directory");
    const { fileCount, totalSize } = await walkDir(sourcePath);
    const topItems = await fs.readdir(sourcePath, { withFileTypes: true });
    const topDirs = topItems.filter((d) => d.isDirectory()).map((d) => d.name);
    const topFiles = topItems.filter((f) => f.isFile()).map((f) => f.name);
    const entryPoint = topFiles.includes("index.html")
      ? "index.html"
      : topFiles.find((f) => f.endsWith(".html")) || null;
    res.json({ fileCount, totalSize, totalSizeHuman: humanSize(totalSize), entryPoint, topDirs });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/api/demo/copy", async (req, res) => {
  try {
    const { sourcePath, projectSlug } = req.body;
    if (!sourcePath || !projectSlug) throw new Error("sourcePath and projectSlug required");
    const slug = slugify(projectSlug);
    const destDir = path.join(PUBLIC_DEMOS, slug);
    try { await fs.rm(destDir, { recursive: true, force: true }); } catch {}
    await copyDir(sourcePath, destDir);
    const { fileCount, totalSize } = await walkDir(destDir);
    res.json({ demoPath: `demo-assets/${slug}`, fileCount, totalSizeHuman: humanSize(totalSize) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/demo/:slug", async (req, res) => {
  try {
    const slug = slugify(req.params.slug);
    await fs.rm(path.join(PUBLIC_DEMOS, slug), { recursive: true, force: true });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/api/demo/:slug/optimize", async (req, res) => {
  try {
    const { demoPath } = req.body;
    if (!demoPath) throw new Error("demoPath required");
    const demoDir = path.join(PUBLIC_DIR, demoPath);
    await fs.access(demoDir);

    // Collect all convertible images
    async function walkImages(dir, out = []) {
      for (const item of await fs.readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, item.name);
        if (item.isDirectory()) await walkImages(full, out);
        else if (/\.(jpg|jpeg|png)$/i.test(item.name)) out.push(full);
      }
      return out;
    }

    const images = await walkImages(demoDir);
    if (!images.length) return res.json({ converted: 0, beforeHuman: "0 KB", afterHuman: "0 KB", savedHuman: "0 KB", pct: 0 });

    let totalBefore = 0, totalAfter = 0, converted = 0;
    for (const src of images) {
      const dest = src.replace(/\.(jpg|jpeg|png)$/i, ".webp");
      const before = (await fs.stat(src)).size;
      try {
        await execFileAsync("cwebp", ["-q", "82", src, "-o", dest]);
        const after = (await fs.stat(dest)).size;
        await fs.unlink(src);
        totalBefore += before;
        totalAfter += after;
        converted++;
      } catch {
        // cwebp not found or failed for this file — skip
      }
    }

    if (converted === 0) throw new Error("cwebp not found or all conversions failed");

    // Update .jpg/.png references in text files within the demo folder
    async function updateRefs(dir) {
      for (const item of await fs.readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, item.name);
        if (item.isDirectory()) { await updateRefs(full); continue; }
        if (!/\.(html|js|json)$/i.test(item.name)) continue;
        const text = await fs.readFile(full, "utf8");
        const updated = text.replace(/\.(jpg|jpeg|png)(?=[^a-zA-Z]|$)/gi, ".webp");
        if (updated !== text) await fs.writeFile(full, updated, "utf8");
      }
    }
    await updateRefs(demoDir);

    const saved = totalBefore - totalAfter;
    const pct = Math.round((saved / totalBefore) * 100);
    res.json({ converted, beforeHuman: humanSize(totalBefore), afterHuman: humanSize(totalAfter), savedHuman: humanSize(saved), pct });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ── Git sync ──────────────────────────────────────────────────────────────

function categorizePath(filePath) {
  if (filePath.startsWith("src/content/projects/")) return "projects";
  if (filePath.startsWith("src/content/blog/")) return "blog";
  if (filePath.startsWith("src/content/videos/")) return "videos";
  if (filePath.startsWith("src/content/bookmarks/")) return "bookmarks";
  if (filePath.startsWith("src/content/site/")) return "site";
  if (filePath.startsWith("src/content/")) return "content";
  if (
    filePath.startsWith("public/images/") ||
    filePath.startsWith("public/demos/") ||
    filePath.startsWith("public/demo-assets/")
  ) return "assets";
  return "other";
}

async function gitRemoteAndBranch() {
  const { stdout: remoteOut } = await execFileAsync("git", ["remote"], { cwd: ROOT });
  const remote = remoteOut.trim().split("\n").filter(Boolean)[0] || "origin";
  const { stdout: branchOut } = await execFileAsync("git", ["branch", "--show-current"], { cwd: ROOT });
  const branch = branchOut.trim() || "main";
  return { remote, branch };
}

app.get("/api/git/status", async (req, res) => {
  try {
    const { stdout } = await execFileAsync("git", ["status", "--porcelain"], { cwd: ROOT });

    let hasRemote = false;
    let remoteName = null;
    try {
      const { stdout: r } = await execFileAsync("git", ["remote"], { cwd: ROOT });
      const remotes = r.trim().split("\n").filter(Boolean);
      if (remotes.length) { hasRemote = true; remoteName = remotes[0]; }
    } catch {}

    let currentBranch = "main";
    try {
      const { stdout: b } = await execFileAsync("git", ["branch", "--show-current"], { cwd: ROOT });
      currentBranch = b.trim() || "main";
    } catch {}

    let aheadCount = 0;
    try {
      const { stdout: a } = await execFileAsync("git", ["rev-list", "--count", "@{u}..HEAD"], { cwd: ROOT });
      aheadCount = parseInt(a.trim()) || 0;
    } catch {
      try {
        if (remoteName) {
          const ref = `${remoteName}/${currentBranch}`;
          const { stdout: a } = await execFileAsync("git", ["rev-list", "--count", `${ref}..HEAD`], { cwd: ROOT });
          aheadCount = parseInt(a.trim()) || 0;
        }
      } catch {}
    }

    const files = [];
    for (const line of stdout.split("\n").filter(Boolean)) {
      const xy = line.slice(0, 2);
      let filePath = line.slice(3).trim();
      if (filePath.includes(" -> ")) filePath = filePath.split(" -> ")[1].trim();
      if (filePath.startsWith('"') && filePath.endsWith('"')) {
        try { filePath = JSON.parse(filePath); } catch {}
      }
      let status;
      if (xy.trimEnd() === "??") status = "new";
      else if (xy.includes("D")) status = "deleted";
      else status = "modified";
      files.push({ path: filePath, status, category: categorizePath(filePath) });
    }

    res.json({ files, hasRemote, aheadCount, remoteName, currentBranch });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/git/commit", async (req, res) => {
  try {
    const { files, message, push } = req.body;
    if (!Array.isArray(files) || !files.length) throw new Error("no files selected");
    const msg = (message || "").trim();
    if (!msg) throw new Error("commit message required");
    for (const f of files) {
      if (f.includes("..") || path.isAbsolute(f)) throw new Error(`unsafe path: ${f}`);
    }

    await execFileAsync("git", ["add", "--", ...files], { cwd: ROOT, maxBuffer: 10e6 });

    let output = "";
    try {
      const { stdout, stderr } = await execFileAsync("git", ["commit", "-m", msg], { cwd: ROOT, maxBuffer: 10e6 });
      output += stdout + (stderr || "");
    } catch (commitErr) {
      const errText = (commitErr.stdout || "") + (commitErr.stderr || "");
      if (errText.includes("nothing to commit") || errText.includes("nothing added to commit")) {
        output += "nothing new to commit\n";
      } else {
        throw new Error(commitErr.stderr || commitErr.message);
      }
    }

    if (push) {
      const { remote, branch } = await gitRemoteAndBranch();
      try {
        const { stdout: pOut, stderr: pErr } = await execFileAsync("git", ["push", remote, branch], { cwd: ROOT, maxBuffer: 10e6 });
        output += pOut + pErr;
      } catch (pushErr) {
        throw new Error(pushErr.stderr || pushErr.message);
      }
    }

    res.json({ ok: true, output: output.trim() });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/api/git/push", async (req, res) => {
  try {
    const { remote, branch } = await gitRemoteAndBranch();
    const { stdout, stderr } = await execFileAsync("git", ["push", remote, branch], { cwd: ROOT, maxBuffer: 10e6 });
    res.json({ ok: true, output: (stdout + stderr).trim() });
  } catch (e) {
    res.status(400).json({ error: e.stderr || e.message });
  }
});

// Helpers for the client (suggested filenames)
app.post("/api/suggest-filename", (req, res) => {
  const { type, title, date } = req.body;
  const slug = slugify(title) || "untitled";
  if (COLLECTIONS[type]?.dated) {
    const d = date ? new Date(date) : new Date();
    const iso = d.toISOString().slice(0, 10);
    return res.json({ filename: `${iso}-${slug}.md` });
  }
  res.json({ filename: `${slug}.md` });
});

const PORT = process.env.ADMIN_PORT || 4322;
app.listen(PORT, () => {
  console.log(`\n  ✎ admin running at http://localhost:${PORT}\n`);
});
