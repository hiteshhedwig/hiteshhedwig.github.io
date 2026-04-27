// Content-type field definitions drive the auto-generated forms.
const SCHEMAS = {
  blog: {
    label: "Blog posts",
    sub: "Longform writing. Filenames are dated.",
    dated: true,
    imageSubdir: "blog",
    bodyEditor: true,
    fields: [
      { key: "title", type: "text", required: true },
      { key: "date", type: "date", required: true },
      { key: "summary", type: "text", placeholder: "One line shown on the listing page." },
      { key: "tags", type: "tags" },
      { key: "draft", type: "bool", label: "Draft (hidden from site)" },
    ],
  },
  projects: {
    label: "Projects",
    sub: "Long-form project pages. Filename becomes the URL.",
    dated: false,
    imageSubdir: "projects",
    bodyEditor: true,
    fields: [
      { key: "title", type: "text", required: true },
      { key: "description", type: "text", placeholder: "One-liner for the listing page." },
      {
        key: "status",
        type: "select",
        options: ["Active", "Completed", "Open Source", "Archived"],
      },
      { key: "year", type: "text", placeholder: "2026" },
      { key: "order", type: "number", placeholder: "Lower = shown first" },
      { key: "tags", type: "tags" },
      { key: "demoVideo", type: "text", placeholder: "YouTube ID only, not full URL" },
      {
        key: "images",
        type: "repeat",
        imageUpload: true,
        fields: [
          { key: "src", type: "text", placeholder: "/images/projects/foo.jpg" },
          { key: "alt", type: "text", placeholder: "Alt text" },
        ],
      },
      {
        key: "links",
        type: "repeat",
        fields: [
          { key: "label", type: "text", placeholder: "GitHub" },
          { key: "href", type: "text", placeholder: "https://…" },
        ],
      },
    ],
  },
  videos: {
    label: "Videos",
    sub: "YouTube embeds with notes.",
    dated: true,
    imageSubdir: "videos",
    bodyEditor: true,
    fields: [
      { key: "title", type: "text", required: true },
      { key: "date", type: "date", required: true },
      { key: "description", type: "text" },
      { key: "youtubeId", type: "text", placeholder: "dQw4w9WgXcQ" },
      { key: "tags", type: "tags" },
      { key: "draft", type: "bool", label: "Draft" },
    ],
  },
  bookmarks: {
    label: "Bookmarks",
    sub: "Resource categories. Filename = category slug.",
    dated: false,
    bodyEditor: false,
    fields: [
      { key: "name", type: "text", required: true, placeholder: "Category name" },
      { key: "icon", type: "text", placeholder: "~ (single character)" },
      { key: "order", type: "number" },
      {
        key: "items",
        type: "repeat",
        fields: [
          { key: "title", type: "text", placeholder: "Resource name" },
          { key: "note", type: "text", placeholder: "Short description" },
          { key: "url", type: "text", placeholder: "https://… (optional)" },
        ],
      },
    ],
  },
};

const SITE_SCHEMAS = {
  "about.md": {
    label: "About & bio",
    sub: "Your bio (body) and fun facts (frontmatter).",
    bodyEditor: true,
    bodyLabel: "Bio (markdown)",
    fixedFrontmatter: { type: "about" },
    fields: [{ key: "facts", type: "tags", label: "Fun facts", separator: "|" }],
  },
  "config.md": {
    label: "Sidebar & config",
    sub: "Status, currently reading, socials, sidebar extras.",
    bodyEditor: false,
    fixedFrontmatter: { type: "config" },
    fields: [
      { key: "status", type: "text", placeholder: "What you're up to right now" },
      {
        key: "currentlyReading",
        type: "object",
        fields: [
          { key: "title", type: "text" },
          { key: "author", type: "text" },
          { key: "progress", type: "number", placeholder: "0–100" },
        ],
      },
      { key: "randomThought", type: "text" },
      { key: "footerQuote", type: "text" },
      {
        key: "socials",
        type: "repeat",
        fields: [
          { key: "label", type: "text" },
          { key: "href", type: "text" },
        ],
      },
      {
        key: "quickLinks",
        type: "repeat",
        fields: [
          { key: "label", type: "text" },
          { key: "href", type: "text" },
        ],
      },
    ],
  },
};

// ── utils ───────────────────────────────────────────
const el = (tag, attrs = {}, ...children) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else if (v === true) n.setAttribute(k, "");
    else if (v !== false && v != null) n.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return n;
};

function toast(msg, isError = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.toggle("error", isError);
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2400);
}

async function api(url, opts = {}) {
  const r = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
  return data;
}

async function uploadFile(file, subdir) {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch(`/api/upload?subdir=${encodeURIComponent(subdir)}`, {
    method: "POST",
    body: fd,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "upload failed");
  return data;
}

function fmt(d) {
  if (!d) return "";
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return String(d);
  }
}

// ── routing ───────────────────────────────────────────
const main = document.getElementById("main");
let editorSession = null;

function setActive(btn) {
  document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
  btn?.classList.add("active");
}

document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    stopEditorSession();
    setActive(btn);
    const view = btn.dataset.view;
    if (view === "list") renderList(btn.dataset.type);
    else if (view === "site") renderSiteEditor(btn.dataset.file);
  });
});

// default
document.querySelector('.nav-item[data-type="blog"]').click();

// ── list view ───────────────────────────────────────────
async function renderList(type) {
  const schema = SCHEMAS[type];
  main.innerHTML = "";

  // fetch archive count in parallel so the header can show it
  let archiveCount = 0;
  try {
    const { entries: archived } = await api(`/api/archive/${type}`);
    archiveCount = archived.length;
  } catch {}

  main.appendChild(
    el(
      "div",
      { class: "page-header" },
      el(
        "div",
        {},
        el("h1", { class: "page-title" }, schema.label),
        el("div", { class: "page-sub" }, schema.sub)
      ),
      el(
        "div",
        { class: "header-actions" },
        archiveCount > 0
          ? el(
              "button",
              {
                class: "btn btn-ghost",
                onclick: () => renderArchive(type),
              },
              `archive (${archiveCount})`
            )
          : null,
        el(
          "button",
          {
            class: "btn btn-primary",
            onclick: () => renderEditor(type, null),
          },
          "+ new"
        )
      )
    )
  );

  // offer to restore an unsaved draft if one exists for this type
  const stash = loadStash(type);
  if (stash) {
    main.appendChild(
      el(
        "div",
        { class: "draft-banner" },
        el(
          "div",
          {},
          el("strong", {}, "Unsaved draft"),
          el(
            "div",
            { class: "hint" },
            `"${stash.frontmatter?.title || stash.frontmatter?.name || "untitled"}" — last edited ${timeAgo(stash.savedAt)}`
          )
        ),
        el(
          "div",
          { class: "header-actions" },
          el("button", { class: "btn", onclick: () => { clearStash(type); renderList(type); } }, "discard"),
          el(
            "button",
            {
              class: "btn btn-primary",
              onclick: () => renderEditor(type, null, stash),
            },
            "resume"
          )
        )
      )
    );
  }

  try {
    const { entries } = await api(`/api/list/${type}`);
    if (!entries.length) {
      main.appendChild(
        el("div", { class: "empty" }, `no ${schema.label.toLowerCase()} yet — start with +new`)
      );
      return;
    }
    const list = el("div", { class: "entry-list" });
    for (const entry of entries) {
      list.appendChild(buildEntryCard(type, entry));
    }
    main.appendChild(list);
  } catch (e) {
    toast(e.message, true);
  }
}

function buildEntryCard(type, entry) {
  const fm = entry.frontmatter || {};
  const title = fm.title || fm.name || entry.filename;
  const metaBits = [];
  if (fm.date) metaBits.push(fmt(fm.date));
  if (fm.status) metaBits.push(fm.status);
  if (fm.year) metaBits.push(fm.year);
  if (type === "bookmarks" && Array.isArray(fm.items))
    metaBits.push(`${fm.items.length} link${fm.items.length === 1 ? "" : "s"}`);

  const sub = el(
    "div",
    { class: "entry-sub" },
    fm.draft ? el("span", { class: "badge badge-draft" }, "draft") : null,
    ...metaBits.map((m) => el("span", {}, m)),
    ...(fm.tags || []).slice(0, 4).map((t) => el("span", { class: "tag-pill" }, t))
  );

  return el(
    "div",
    { class: "entry-card", onclick: () => renderEditor(type, entry.filename) },
    el("div", { class: "entry-meta" }, el("h3", { class: "entry-title" }, title), sub),
    el(
      "button",
      {
        class: "btn btn-ghost",
        onclick: (e) => {
          e.stopPropagation();
          archiveEntry(type, entry.filename);
        },
      },
      "archive"
    )
  );
}

async function archiveEntry(type, filename) {
  if (!confirm(`Archive ${filename}?\n\nIt'll be moved to the archive and hidden from the site. You can restore it from the archive view.`))
    return;
  try {
    await api(`/api/archive/${type}/${filename}`, { method: "POST" });
    toast("archived");
    renderList(type);
  } catch (e) {
    toast(e.message, true);
  }
}

async function restoreEntry(type, filename) {
  try {
    await api(`/api/restore/${type}/${filename}`, { method: "POST" });
    toast("restored");
    renderArchive(type);
  } catch (e) {
    toast(e.message, true);
  }
}

async function hardDeleteEntry(type, filename) {
  if (!confirm(`Permanently delete ${filename}? This cannot be undone.`)) return;
  try {
    await api(`/api/archive/${type}/${filename}`, { method: "DELETE" });
    toast("deleted forever");
    renderArchive(type);
  } catch (e) {
    toast(e.message, true);
  }
}

async function renderArchive(type) {
  const schema = SCHEMAS[type];
  main.innerHTML = "";
  main.appendChild(
    el(
      "div",
      { class: "page-header" },
      el(
        "div",
        {},
        el("h1", { class: "page-title" }, `Archive · ${schema.label}`),
        el("div", { class: "page-sub" }, "Hidden from the site. Restore or delete forever.")
      ),
      el("button", { class: "btn btn-ghost", onclick: () => renderList(type) }, "← back")
    )
  );
  try {
    const { entries } = await api(`/api/archive/${type}`);
    if (!entries.length) {
      main.appendChild(el("div", { class: "empty" }, "archive is empty"));
      return;
    }
    const list = el("div", { class: "entry-list" });
    for (const entry of entries) {
      const fm = entry.frontmatter || {};
      const title = fm.title || fm.name || entry.filename;
      list.appendChild(
        el(
          "div",
          { class: "entry-card" },
          el(
            "div",
            { class: "entry-meta" },
            el("h3", { class: "entry-title" }, title),
            el("div", { class: "entry-sub" }, el("span", {}, entry.filename))
          ),
          el(
            "button",
            { class: "btn", onclick: () => restoreEntry(type, entry.filename) },
            "restore"
          ),
          el(
            "button",
            { class: "btn btn-danger", onclick: () => hardDeleteEntry(type, entry.filename) },
            "delete forever"
          )
        )
      );
    }
    main.appendChild(list);
  } catch (e) {
    toast(e.message, true);
  }
}

// ── editor view ───────────────────────────────────────────
async function renderEditor(type, filename, stash = null) {
  const schema = SCHEMAS[type];
  let data = { frontmatter: {}, body: "", filename: null };
  if (filename) {
    try {
      data = await api(`/api/entry/${type}/${filename}`);
    } catch (e) {
      toast(e.message, true);
      return;
    }
  } else if (stash) {
    data = { frontmatter: stash.frontmatter || {}, body: stash.body || "" };
  } else if (schema.dated) {
    data.frontmatter.date = new Date().toISOString().slice(0, 10);
  }

  main.innerHTML = "";
  main.appendChild(
    el(
      "div",
      { class: "page-header" },
      el(
        "div",
        {},
        el(
          "h1",
          { class: "page-title" },
          filename ? `Edit · ${schema.label}` : `New · ${schema.label}`
        ),
        el(
          "div",
          { class: "page-sub" },
          filename
            ? el("span", { class: "img-path" }, filename)
            : "fields marked * are required"
        )
      ),
      el(
        "button",
        { class: "btn btn-ghost", onclick: () => renderList(type) },
        "← back"
      )
    )
  );

  const form = buildForm(schema, data.frontmatter);
  main.appendChild(form.el);

  let editor = null;
  if (schema.bodyEditor) {
    const bodySection = el(
      "div",
      { class: "form-section" },
      el("h3", { class: "form-section-title" }, "Body"),
      el("textarea", { id: "body-editor" })
    );
    main.appendChild(bodySection);
    editor = new EasyMDE({
      element: document.getElementById("body-editor"),
      spellChecker: false,
      autoDownloadFontAwesome: true,
      status: false,
      minHeight: "320px",
      initialValue: data.body || "",
      toolbar: [
        "bold", "italic", "heading", "|",
        "quote", "unordered-list", "ordered-list", "|",
        "link", "image", "code", "|",
        "preview", "side-by-side", "fullscreen",
      ],
    });
    setupEditorDrop(editor, schema.imageSubdir || "uploads");
  }

  const status = el("span", { class: "save-status" }, "");
  main.appendChild(
    el(
      "div",
      { class: "form-actions" },
      filename
        ? el(
            "button",
            {
              class: "btn btn-danger",
              onclick: () => archiveEntry(type, filename),
            },
            "archive"
          )
        : null,
      status,
      el("div", { class: "spacer" }),
      el("button", { class: "btn", onclick: () => renderList(type) }, "cancel"),
      // "Save draft" only appears for types that have a `draft` field
      schema.fields.some((f) => f.key === "draft")
        ? el(
            "button",
            {
              class: "btn",
              title: "Save with draft: true (hidden from the site)",
              onclick: () => saveEntry(type, filename, form, editor, { asDraft: true, status }),
            },
            "save draft"
          )
        : null,
      el(
        "button",
        {
          class: "btn btn-primary",
          onclick: () => saveEntry(type, filename, form, editor, { status }),
        },
        filename ? "save" : "create"
      )
    )
  );

  // ── autosave & stash (for unsaved new entries) ─────────
  // If this entry has no filename yet, snapshot to localStorage every few
  // seconds so a crash/close doesn't eat the post. If it has a filename,
  // auto-save to disk every 20s when dirty.
  let lastSnapshot = JSON.stringify({ fm: data.frontmatter, body: data.body });
  let currentFilename = filename;

  const snapshot = () => {
    const fm = form.read();
    const body = editor ? editor.value() : "";
    return { fm, body, str: JSON.stringify({ fm, body }) };
  };

  const tick = async () => {
    const { fm, body, str } = snapshot();
    if (str === lastSnapshot) return;
    if (!currentFilename) {
      // stash locally so user can resume from the list page
      saveStash(type, { frontmatter: fm, body, savedAt: Date.now() });
      status.textContent = "draft kept locally";
      lastSnapshot = str;
      return;
    }
    try {
      await api(`/api/entry/${type}`, {
        method: "POST",
        body: JSON.stringify({
          filename: currentFilename,
          originalFilename: currentFilename,
          frontmatter: fm,
          body,
        }),
      });
      status.textContent = `autosaved ${new Date().toLocaleTimeString()}`;
      lastSnapshot = str;
    } catch (e) {
      status.textContent = `autosave failed: ${e.message}`;
    }
  };

  const autosaveTimer = setInterval(tick, 20000);
  // expose so saveEntry can update state & clear timer on navigation
  editorSession = {
    type,
    stop: () => clearInterval(autosaveTimer),
    setFilename: (f) => { currentFilename = f; },
    status,
  };
}

// ── localStorage stash for unsaved drafts ───────────────────────────
const STASH_KEY = (type) => `hit-one-admin:stash:${type}`;
function saveStash(type, obj) {
  try {
    localStorage.setItem(STASH_KEY(type), JSON.stringify(obj));
  } catch {}
}
function loadStash(type) {
  try {
    const raw = localStorage.getItem(STASH_KEY(type));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function clearStash(type) {
  try {
    localStorage.removeItem(STASH_KEY(type));
  } catch {}
}
function timeAgo(ts) {
  if (!ts) return "";
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(ts).toLocaleDateString();
}

async function saveEntry(type, originalFilename, form, editor, opts = {}) {
  try {
    const frontmatter = form.read();
    if (opts.asDraft) frontmatter.draft = true;
    // normalize date to YYYY-MM-DD string (Astro coerces it)
    if (frontmatter.date) frontmatter.date = fmt(frontmatter.date);
    const body = editor ? editor.value() : "";

    let filename = originalFilename;
    if (!filename) {
      const titleish =
        frontmatter.title || frontmatter.name || "untitled";
      const { filename: suggested } = await api("/api/suggest-filename", {
        method: "POST",
        body: JSON.stringify({
          type,
          title: titleish,
          date: frontmatter.date,
        }),
      });
      filename = suggested;
    }

    await api(`/api/entry/${type}`, {
      method: "POST",
      body: JSON.stringify({
        filename,
        originalFilename,
        frontmatter,
        body,
      }),
    });
    // once saved to disk, drop the localStorage stash and keep editing
    clearStash(type);
    if (editorSession) editorSession.setFilename(filename);
    if (opts.status) opts.status.textContent = `saved ${new Date().toLocaleTimeString()}`;
    toast(opts.asDraft ? "draft saved" : originalFilename ? "saved" : "created");
    if (!opts.stayOnPage) {
      stopEditorSession();
      renderList(type);
    }
  } catch (e) {
    toast(e.message, true);
  }
}

function stopEditorSession() {
  if (editorSession) {
    editorSession.stop();
    editorSession = null;
  }
}

// ── site editor ───────────────────────────────────────────
async function renderSiteEditor(fileName) {
  const schema = SITE_SCHEMAS[fileName];
  let data = { frontmatter: {}, body: "" };
  try {
    data = await api(`/api/site/${fileName}`);
  } catch {
    // file may not exist yet; start empty
  }

  main.innerHTML = "";
  main.appendChild(
    el(
      "div",
      { class: "page-header" },
      el(
        "div",
        {},
        el("h1", { class: "page-title" }, schema.label),
        el("div", { class: "page-sub" }, schema.sub)
      )
    )
  );

  const form = buildForm(schema, data.frontmatter);
  main.appendChild(form.el);

  let editor = null;
  if (schema.bodyEditor) {
    const bodySection = el(
      "div",
      { class: "form-section" },
      el("h3", { class: "form-section-title" }, schema.bodyLabel || "Body"),
      el("textarea", { id: "body-editor" })
    );
    main.appendChild(bodySection);
    editor = new EasyMDE({
      element: document.getElementById("body-editor"),
      spellChecker: false,
      autoDownloadFontAwesome: true,
      status: false,
      minHeight: "280px",
      initialValue: data.body || "",
      toolbar: ["bold", "italic", "heading", "|", "link", "preview"],
    });
    setupEditorDrop(editor, "uploads");
  }

  main.appendChild(
    el(
      "div",
      { class: "form-actions" },
      el("div", { class: "spacer" }),
      el(
        "button",
        {
          class: "btn btn-primary",
          onclick: async () => {
            try {
              const fm = { ...(schema.fixedFrontmatter || {}), ...form.read() };
              await api(`/api/site/${fileName}`, {
                method: "POST",
                body: JSON.stringify({
                  frontmatter: fm,
                  body: editor ? editor.value() : data.body || "",
                }),
              });
              toast("saved");
            } catch (e) {
              toast(e.message, true);
            }
          },
        },
        "save"
      )
    )
  );
}

// ── form builder ───────────────────────────────────────────
function buildForm(schema, values) {
  const section = el("div", { class: "form-section" });
  section.appendChild(el("h3", { class: "form-section-title" }, "Details"));
  const form = el("div", { class: "form" });
  section.appendChild(form);

  const readers = [];
  for (const field of schema.fields) {
    const { node, read } = buildField(field, values?.[field.key]);
    form.appendChild(node);
    readers.push([field.key, read]);
  }

  return {
    el: section,
    read() {
      const out = {};
      for (const [k, r] of readers) {
        const v = r();
        if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0))
          continue;
        out[k] = v;
      }
      return out;
    },
  };
}

function buildField(field, value) {
  const label = field.label || humanize(field.key);
  const required = field.required;

  if (field.type === "text" || field.type === "url") {
    const input = el("input", {
      type: "text",
      value: value ?? "",
      placeholder: field.placeholder || "",
    });
    return wrap(label, required, input, field.hint, () => input.value.trim());
  }

  if (field.type === "date") {
    const input = el("input", {
      type: "date",
      value: value ? fmt(value) : "",
    });
    return wrap(label, required, input, null, () => input.value);
  }

  if (field.type === "number") {
    const input = el("input", {
      type: "number",
      value: value ?? "",
      placeholder: field.placeholder || "",
    });
    return wrap(label, required, input, null, () => {
      const v = input.value.trim();
      return v === "" ? undefined : Number(v);
    });
  }

  if (field.type === "bool") {
    const input = el("input", { type: "checkbox" });
    if (value) input.checked = true;
    const row = el(
      "div",
      { class: "form-row checkbox-row" },
      input,
      el("label", {}, label)
    );
    return { node: row, read: () => input.checked };
  }

  if (field.type === "select") {
    const sel = el("select", {});
    for (const opt of field.options) {
      const o = el("option", { value: opt }, opt);
      if (value === opt) o.selected = true;
      sel.appendChild(o);
    }
    return wrap(label, required, sel, null, () => sel.value);
  }

  if (field.type === "tags") {
    const sep = field.separator || ",";
    const joiner = sep === "|" ? " | " : ", ";
    const input = el("input", {
      type: "text",
      value: Array.isArray(value) ? value.join(joiner) : value || "",
      placeholder: `Separated by "${sep === "|" ? "|" : ","}"`,
    });
    return wrap(label, required, input, `Separate with "${sep}"`, () => {
      return input.value
        .split(sep)
        .map((s) => s.trim())
        .filter(Boolean);
    });
  }

  if (field.type === "object") {
    const container = el("div", { class: "repeat-row" });
    const readers = [];
    for (const sub of field.fields) {
      const { node, read } = buildField(sub, value?.[sub.key]);
      container.appendChild(node);
      readers.push([sub.key, read]);
    }
    return wrap(label, false, container, null, () => {
      const out = {};
      let any = false;
      for (const [k, r] of readers) {
        const v = r();
        if (v !== undefined && v !== "") {
          out[k] = v;
          any = true;
        }
      }
      return any ? out : undefined;
    });
  }

  if (field.type === "repeat") {
    const list = el("div", { class: "repeat" });
    const rowReaders = [];

    const addRow = (rowVal) => {
      const row = el("div", { class: "repeat-row" });
      const subReaders = [];
      for (const sub of field.fields) {
        const { node, read } = buildField(sub, rowVal?.[sub.key]);
        row.appendChild(node);
        subReaders.push([sub.key, read]);
      }
      const remove = el(
        "button",
        {
          class: "repeat-remove",
          title: "Remove",
          onclick: () => {
            list.removeChild(row);
            const idx = rowReaders.indexOf(token);
            if (idx >= 0) rowReaders.splice(idx, 1);
          },
        },
        "×"
      );
      row.appendChild(remove);
      const token = subReaders;
      list.appendChild(row);
      rowReaders.push(token);
    };

    (Array.isArray(value) ? value : []).forEach((v) => addRow(v));

    const addBtn = el(
      "button",
      { class: "repeat-add", onclick: () => addRow({}) },
      "+ add row"
    );

    const wrapper = el(
      "div",
      { class: "form-row" },
      el("label", {}, label),
      list,
      addBtn
    );

    // optional drag-drop image upload (for project images)
    if (field.imageUpload) {
      const drop = el(
        "div",
        { class: "dropzone" },
        "drop an image here to upload & append"
      );
      drop.addEventListener("dragover", (e) => {
        e.preventDefault();
        drop.classList.add("drag");
      });
      drop.addEventListener("dragleave", () => drop.classList.remove("drag"));
      drop.addEventListener("drop", async (e) => {
        e.preventDefault();
        drop.classList.remove("drag");
        const file = e.dataTransfer?.files?.[0];
        if (!file) return;
        try {
          const { url } = await uploadFile(file, "projects");
          addRow({ src: url, alt: file.name.replace(/\.[^.]+$/, "") });
          toast("image uploaded");
        } catch (err) {
          toast(err.message, true);
        }
      });
      wrapper.appendChild(drop);
    }

    return {
      node: wrapper,
      read: () => {
        const out = [];
        for (const subReaders of rowReaders) {
          const row = {};
          let any = false;
          for (const [k, r] of subReaders) {
            const v = r();
            if (v !== undefined && v !== "") {
              row[k] = v;
              any = true;
            }
          }
          if (any) out.push(row);
        }
        return out;
      },
    };
  }

  return { node: el("div", {}, `[unknown field: ${field.type}]`), read: () => undefined };
}

function wrap(label, required, control, hint, read) {
  const row = el(
    "div",
    { class: "form-row" },
    el("label", {}, label + (required ? " *" : "")),
    control,
    hint ? el("div", { class: "hint" }, hint) : null
  );
  return { node: row, read };
}

function humanize(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

// ── drag-and-drop into EasyMDE ───────────────────────────────────────────
function setupEditorDrop(editor, subdir) {
  const wrapper = editor.codemirror.getWrapperElement();
  wrapper.addEventListener("dragover", (e) => {
    if (e.dataTransfer?.types?.includes("Files")) {
      e.preventDefault();
      wrapper.style.outline = "2px dashed var(--accent-light)";
    }
  });
  wrapper.addEventListener("dragleave", () => {
    wrapper.style.outline = "";
  });
  wrapper.addEventListener("drop", async (e) => {
    wrapper.style.outline = "";
    const files = Array.from(e.dataTransfer?.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!files.length) return;
    e.preventDefault();
    for (const file of files) {
      try {
        const { url } = await uploadFile(file, subdir);
        const alt = file.name.replace(/\.[^.]+$/, "");
        editor.codemirror.replaceSelection(`![${alt}](${url})\n`);
        toast("image uploaded");
      } catch (err) {
        toast(err.message, true);
      }
    }
  });
}
