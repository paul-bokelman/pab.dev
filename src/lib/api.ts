import type { Post, PostPreview, PostFrontmatter } from "types";
import fs from "fs";
import path from "path";
import matter, { GrayMatterFile } from "gray-matter";
import slugify from "slugify";
import { serialize } from "next-mdx-remote/serialize";
import rehypeHighlight from "rehype-highlight";

interface MatterResult extends GrayMatterFile<string> {
  data: PostFrontmatter;
}

const postsDir = path.join(process.cwd(), "src/posts");

export const getSlugs = (): Array<string> => {
  const slugs: Array<string> = [];
  fs.readdirSync(postsDir).forEach((filename) => {
    const slug = slugify(filename.replace(/\.mdx$/, ""), { lower: true });
    slugs.push(slug);
  });
  return slugs;
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const fullPath = path.join(postsDir, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents) as MatterResult;

  const source = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [rehypeHighlight as any], // we don't talk about this...
    },
    parseFrontmatter: false,
  });

  return {
    ...data,
    source,
  };
};

export const getPreviewPosts = async (): Promise<Array<PostPreview>> => {
  const slugs = getSlugs();
  const posts: Array<PostPreview> = [];

  for (const slug of slugs) {
    const post = await getPostBySlug(slug);

    if (post.complete) {
      posts.push({ slug, ...post });
    }
  }

  return posts;
};
