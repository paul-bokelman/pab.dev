import type { MDXRemoteSerializeResult } from "next-mdx-remote";

/** tags are whatever the vault says they are */
export type Tag = string;

export interface WritingPreview {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO string — yaml dates are normalised at read time so props stay serialisable */
  date: string;
  tags: Array<Tag>;
}

export interface Writing extends WritingPreview {
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  github: string;
  website: string;
  tags: Array<Tag>;
  order: number;
}
