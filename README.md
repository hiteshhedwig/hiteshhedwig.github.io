# hitesh.one

Personal portfolio and knowledge-sharing website. Built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com).

## Quick Start

```bash
npm install
npm run dev        # starts dev server at http://localhost:4321
npm run build      # builds static site to ./dist
npm run preview    # preview the build locally
```

## Project Structure

```
src/
├── content/              ← ALL your content lives here (markdown)
│   ├── blog/
│   ├── projects/
│   ├── videos/
│   ├── bookmarks/
│   └── site/
├── components/
├── layouts/
├── pages/
├── styles/
└── content.config.ts     ← schema definitions for content
public/
├── images/               ← put your images here
│   └── projects/
├── favicon.svg
└── favicon.ico
```

---

## Adding Content

All content is managed through markdown files in `src/content/`. No code changes needed — just add a file and rebuild.

### Blog Post

Create a file in `src/content/blog/`:

**Filename format:** `YYYY-MM-DD-slug.md` (e.g. `2026-04-18-my-new-post.md`)

```markdown
---
title: "Your Post Title"
date: 2026-04-18
summary: "A one-line summary shown on the blog listing page."
tags: ["Robotics", "Tutorial"]
draft: false                # set to true to hide from the site
---

Your full blog post content here. Supports all markdown:

## Headings

**Bold**, *italic*, `inline code`, [links](https://example.com)

- Bullet lists
- Like this

> Blockquotes work too

![Alt text](/images/my-image.jpg)
```

### Project

Create a file in `src/content/projects/`:

**Filename format:** `slug.md` (e.g. `my-cool-robot.md`) — the filename becomes the URL `/projects/my-cool-robot`

```markdown
---
title: "My Cool Robot"
description: "Short one-liner shown on the project listing page."
status: Active              # Active | Completed | Open Source | Archived
year: "2026"
tags: ["Python", "ROS2"]
order: 1                    # lower = shown first on listing page
demoVideo: "youtube_id"     # optional — just the ID, not the full URL
images:                     # optional
  - src: "/images/projects/robot-photo.jpg"
    alt: "Description of the image"
  - src: "https://example.com/external-image.jpg"
    alt: "External images work too"
links:                      # optional
  - label: GitHub
    href: "https://github.com/you/repo"
  - label: Paper
    href: "https://arxiv.org/..."
---

Detailed project writeup here. This is the body shown on the
individual project detail page. Use full markdown — headings,
images, code blocks, whatever you need.
```

### Video

Create a file in `src/content/videos/`:

**Filename format:** `YYYY-MM-DD-slug.md`

```markdown
---
title: "Video Title"
date: 2026-04-18
description: "Short description shown on the videos page."
youtubeId: "dQw4w9WgXcQ"   # just the ID from the YouTube URL
tags: ["Tutorial", "SLAM"]
draft: false
---
```

The body content is optional for videos — the page uses the frontmatter fields.

### Bookmark Category

Create a file in `src/content/bookmarks/`:

**Filename format:** `category-name.md` (e.g. `robotics.md`)

```markdown
---
name: "Category Name"
icon: "~"                   # single character shown before the heading
order: 1                    # lower = shown first
items:
  - title: "Resource Name"
    note: "Short description."
    url: "https://example.com"    # optional — makes the title a link
  - title: "Another Resource"
    note: "Another description."
---
```

### About Page & Site Config

**Bio & fun facts** — edit `src/content/site/about.md`:

```markdown
---
type: about
facts:
  - "Fun fact one"
  - "Fun fact two"
---

Your bio text here in markdown. Supports **bold**, *italic*, links, etc.
```

**Sidebar, socials, status** — edit `src/content/site/config.md`:

```markdown
---
type: config
status: "What you're currently up to"
currentlyReading:
  title: "Book Title"
  author: "Author Name"
  progress: 62              # percentage (0-100)
socials:
  - label: GitHub
    href: "https://github.com/you"
  - label: Twitter
    href: "https://twitter.com/you"
  - label: Email
    href: "mailto:you@example.com"
  - label: LinkedIn
    href: "https://linkedin.com/in/you"
quickLinks:
  - label: GitHub
    href: "https://github.com/you"
  - label: Bookmarks
    href: "/bookmarks"
randomThought: "A random thought shown in the sidebar."
footerQuote: "Quote shown in the footer."
---
```

---

## Images

Put images in `public/images/`. They're served from the root:

```
public/images/projects/my-photo.jpg  →  /images/projects/my-photo.jpg
```

Reference them in frontmatter or markdown:

```markdown
# In frontmatter
images:
  - src: "/images/projects/my-photo.jpg"
    alt: "My photo"

# In markdown body
![My photo](/images/projects/my-photo.jpg)
```

External URLs work too — just use the full `https://...` URL.

---

## Common Tasks

| I want to... | Do this |
|---|---|
| Add a blog post | Create `src/content/blog/YYYY-MM-DD-slug.md` |
| Add a project | Create `src/content/projects/slug.md` |
| Add a video | Create `src/content/videos/YYYY-MM-DD-slug.md` |
| Add bookmark category | Create `src/content/bookmarks/name.md` |
| Add a bookmark to existing category | Edit the category's `.md` file, add to `items` |
| Update my bio | Edit `src/content/site/about.md` |
| Update sidebar status | Edit `src/content/site/config.md` → `status` |
| Update reading progress | Edit `src/content/site/config.md` → `currentlyReading` |
| Change social links | Edit `src/content/site/config.md` → `socials` |
| Hide a draft post | Set `draft: true` in the post's frontmatter |
| Change project order | Set `order: N` in the project's frontmatter |
| Add project images | Add to `images` array in the project's frontmatter |
| Add project demo video | Set `demoVideo: "youtube_id"` in frontmatter |

---

## Tech Stack

- **Astro v6** — static site generator
- **Tailwind CSS v4** — styling
- **Content Collections** — type-safe markdown content with schema validation
- **Google Fonts** — Lora (serif), Inter (sans), JetBrains Mono (mono)

## Deployment

The site builds to static HTML in `./dist`. Deploy anywhere that serves static files:

```bash
npm run build
# upload ./dist to your host
```

Works out of the box with Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
