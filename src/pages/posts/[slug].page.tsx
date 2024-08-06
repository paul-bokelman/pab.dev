import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import type { ParsedUrlQuery } from "querystring";
import type { Post } from "types";
import { MDXRemote } from "next-mdx-remote";
import { getPostBySlug, getSlugs } from "lib/api";
import { components } from "components/prose";
import { Tag } from "components/tag";
import Link from "next/link";

interface IParams extends ParsedUrlQuery {
  slug: string;
}

interface Props {
  post: Post;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as IParams;
  const post = await getPostBySlug(slug);

  return {
    props: { post },
  };
};

const Post: NextPage<Props> = ({ post }) => {
  return (
    <article className="mb-10">
      <Link href="/" className="absolute -top-10 md:-top-20 text-dark-main hover:text-dark-sub transition-colors">
        PAB
      </Link>
      <h1 className="text-lg md:text-2xl font-charter mb-1 text-dark-main">{post.title}</h1>
      <div className="flex flex-row items-center gap-2 mb-4">
        <p className="text-sm font-charter text-[#7F7F7F]">{new Date(post.date).toLocaleDateString("en-US")}</p>
        <span className="text-black/25">•</span>
        <div className="flex flex-row items-center gap-3">
          {post.tags.map((name) => (
            <Tag key={name} name={name} withName />
          ))}
        </div>
      </div>
      <MDXRemote {...post.source} components={components} />
    </article>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getSlugs();

  return {
    paths: slugs.map((slug) => {
      return { params: { slug } };
    }),
    fallback: false,
  };
};

export default Post;
