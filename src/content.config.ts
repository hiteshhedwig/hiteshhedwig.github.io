import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(["Active", "Completed", "Open Source", "Archived"]),
    year: z.string(),
    tags: z.array(z.string()).default([]),
    order: z.number().default(99),
    demoVideo: z.string().optional(),
    demoPath: z.string().optional(),
    images: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]),
    links: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
  }),
});

const videos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/videos" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    youtubeId: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const bookmarks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/bookmarks" }),
  schema: z.object({
    name: z.string(),
    icon: z.string().default("*"),
    order: z.number().default(99),
    items: z.array(
      z.object({
        title: z.string(),
        note: z.string(),
        url: z.string().optional(),
      })
    ),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/site" }),
  schema: z.object({
    type: z.enum(["about", "config"]),
    facts: z.array(z.string()).default([]),
    status: z.string().optional(),
    currentlyReading: z
      .object({
        title: z.string(),
        author: z.string(),
        progress: z.number(),
      })
      .optional(),
    socials: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    quickLinks: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    randomThought: z.string().optional(),
    footerQuote: z.string().optional(),
  }),
});

export const collections = { blog, projects, videos, bookmarks, site };
