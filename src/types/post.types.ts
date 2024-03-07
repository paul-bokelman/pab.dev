import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import type { TagNames } from "../components/tag";

export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  complete: boolean;
  tags: TagNames;
}

export interface Post extends PostFrontmatter {
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
}

export interface PostPreview extends PostFrontmatter {
  slug: string;
}
