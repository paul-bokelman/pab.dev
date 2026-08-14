import type { Project, Writing, WritingPreview } from "types";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import rehypeHighlight from "rehype-highlight";
import { fromObsidian, toSlug, type LinkResolver } from "./obsidian";

const vault = process.cwd();
const dirs = {
  writings: path.join(vault, "writings"),
  projects: path.join(vault, "projects"),
};

/** the site route a writing lives at — kept as /posts so existing links survive */
export const writingHref = (slug: string) => `/posts/${slug}`;

const read = (dir: string) => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      return { slug: toSlug(file), file, data: data as Record<string, unknown>, content };
    });
};

const str = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);

/** obsidian writes `date: 2024-05-05`, which yaml hands back as a Date — props must be serialisable */
const isoDate = (value: unknown): string => {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return new Date(0).toISOString();
};

const tagList = (value: unknown): Array<string> => {
  if (Array.isArray(value)) return value.map((tag) => String(tag).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((tag) => tag.trim()).filter(Boolean);
  return [];
};

/** `published: false` hides a note; a note with no flag at all is treated as a draft */
const isPublished = (data: Record<string, unknown>) => data.published === true || data.complete === true;

export const getProjects = (): Array<Project> =>
  read(dirs.projects)
    .filter(({ data }) => isPublished(data))
    .map(({ slug, data }) => ({
      slug,
      name: str(data.name) || str(data.title) || slug,
      description: str(data.description) || str(data.excerpt),
      github: str(data.github),
      website: str(data.website),
      tags: tagList(data.tags),
      order: typeof data.order === "number" ? data.order : Number.MAX_SAFE_INTEGER,
    }))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

export const getWritingPreviews = (): Array<WritingPreview> =>
  read(dirs.writings)
    .filter(({ data }) => isPublished(data))
    .map(({ slug, data }) => ({
      slug,
      title: str(data.title) || slug,
      excerpt: str(data.excerpt) || str(data.description),
      date: isoDate(data.date),
      tags: tagList(data.tags),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

/** drafts must not get a route, or they are published in everything but name */
export const getWritingSlugs = (): Array<string> =>
  read(dirs.writings)
    .filter(({ data }) => isPublished(data))
    .map(({ slug }) => slug);

/**
 * Wikilinks are resolved against every note in the vault, so `[[Club Compass]]`
 * points at the writing if one exists and at the project's own link if not.
 * Anything unresolved degrades to plain text rather than a dead link.
 */
const linkResolver = (): LinkResolver => {
  const map = new Map<string, string>();

  for (const { slug, data } of read(dirs.writings)) {
    if (!isPublished(data)) continue;
    map.set(slug, writingHref(slug));
    const title = str(data.title);
    if (title) map.set(toSlug(title), writingHref(slug));
  }

  for (const { slug, data } of read(dirs.projects)) {
    const href = str(data.website) || str(data.github);
    if (!href) continue;
    if (!map.has(slug)) map.set(slug, href);
    const name = str(data.name);
    if (name && !map.has(toSlug(name))) map.set(toSlug(name), href);
  }

  return (target: string) => map.get(toSlug(target)) ?? null;
};

export const getWriting = async (slug: string): Promise<Writing> => {
  const note = read(dirs.writings).find((entry) => entry.slug === slug);
  if (!note) throw new Error(`no note in writings/ resolves to "${slug}"`);

  const source = await serialize(fromObsidian(note.content, linkResolver()), {
    mdxOptions: { remarkPlugins: [], rehypePlugins: [rehypeHighlight as never] },
    parseFrontmatter: false,
  });

  return {
    slug,
    title: str(note.data.title) || slug,
    excerpt: str(note.data.excerpt),
    date: isoDate(note.data.date),
    tags: tagList(note.data.tags),
    source,
  };
};
