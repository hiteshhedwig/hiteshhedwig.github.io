# CLAUDE.md

Context for Claude Code. Keep this file up to date as the repo evolves.

## What this is

`hitesh.one` — personal portfolio + blog. Static site built with **Astro v6** + **Tailwind v4**. All content is authored as markdown in `src/content/` via Astro Content Collections (schema in `src/content.config.ts`).

Deployed as static HTML from `./dist`.

## Repo layout

```
src/
  content/
    blog/         YYYY-MM-DD-slug.md       — longform posts
    projects/     slug.md                   — project pages (filename = URL)
    videos/       YYYY-MM-DD-slug.md        — YouTube embeds
    bookmarks/    category.md               — link categories with items[]
    site/         about.md, config.md       — bio, sidebar, socials, status
    _archive/     <type>/<filename>         — soft-deleted entries (NOT in any glob)
  components/     Astro components
  layouts/        Base.astro
  pages/          routes (index.astro, blog/, projects/, etc.)
  styles/         global.css (theme tokens live here)
  content.config.ts  ← zod schemas per collection
public/
  images/         site-served assets; referenced as /images/...
admin/            local content studio (see below)
```

Theme tokens (cream / paper / ink / accent `#c45d3e`) live in `src/styles/global.css` and are mirrored in `admin/public/styles.css`. Fonts: Lora (serif), Inter (sans), JetBrains Mono.

## Commands

```bash
npm run dev         # astro dev on :4321
npm run build       # static build to ./dist
npm run admin       # runs astro dev + admin studio (concurrently)
npm run admin:server # admin studio only (on :4322)
```

## Admin studio (`admin/`)

Local-only content management GUI. User prefers editing content through this instead of hand-writing markdown. Not deployed — dev-only.

- `admin/server.js` — Express server on :4322. APIs: list / read / write / archive / restore / hard-delete / upload / suggest-filename. Also statically serves the site's `public/` so image previews load.
- `admin/public/{index.html,app.js,styles.css}` — single-page dashboard, matches site theme.
- Editor: EasyMDE with drag-drop image upload (saves to `public/images/<type>/...`, inserts markdown). Toolbar has `fullscreen` (and Esc exits).
- Forms are auto-generated from per-type schemas in `app.js` (SCHEMAS / SITE_SCHEMAS). Adding a new field = extend the schema there.
- **Delete = archive** by default. Files move to `src/content/_archive/<type>/<filename>`, which is outside every collection's glob `base`, so Astro stops seeing them. Hard-delete only from the archive view.
- **Drafts & autosave**: "save draft" button sets `draft: true`. While editing, autosave runs every 20s — to localStorage for un-saved new entries, to disk once a filename exists. List page shows a "resume / discard" banner if a localStorage stash exists for that type.

## Conventions and gotchas

- **Scroll fade-in gotcha**: pages that wrap a long content block in a single `.fade-up` div must use `threshold: 0` in the IntersectionObserver — `threshold: 0.1` fails when the element is taller than ~10× the viewport (10% of it never fits on screen, so `isIntersecting` never fires, content stays `opacity: 0`). Already fixed on `src/pages/blog/[slug].astro` and `src/pages/projects/[slug].astro`. Listing pages use small per-card fade-ups and are fine with 0.1.
- **Drafts** are hidden via `draft: true` in frontmatter; `getCollection("blog", ({ data }) => !data.draft)` filters them in the detail route.
- **Bookmark category filename** must be the slug of `name` (admin handles this).
- **Project filename** becomes the URL: `projects/<filename>.md` → `/projects/<filename>`.
- **Content schemas are the source of truth** (`src/content.config.ts`). Changing a field here usually means updating the admin schema in `admin/public/app.js` too.
- **Astro content cache**: occasionally Astro dev doesn't notice a file removed from a collection folder. Restarting `astro dev` clears it. Archiving via the admin tool triggers this less often than raw deletion, but it can still happen.
- **Images**: put under `public/images/<type>/...`. Reference as `/images/...` in frontmatter or markdown body. External URLs also work.

## Style for edits

- User prefers terse, direct responses. Don't over-explain.
- Don't add comments unless the *why* is non-obvious.
- Don't create markdown/docs files unless asked.
- For exploratory questions, recommend + name the main tradeoff in 2–3 sentences before implementing.

## README

`README.md` is user-facing and describes content authoring via markdown + the "Common tasks" table. The admin studio is the preferred path; the markdown instructions are the fallback.
