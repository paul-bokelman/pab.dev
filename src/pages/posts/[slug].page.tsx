import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import type { ParsedUrlQuery } from "querystring";
import type { Writing } from "types";
import { MDXRemote } from "next-mdx-remote";
import { getWriting, getWritingSlugs } from "lib/api";
import { components } from "components/prose";
import { Tags } from "components/tag";
import { formatDate } from "components/post-preview";
import { Entrance, EntranceItem } from "components/motion";
import { useInteractionSounds } from "components/sound";
import Link from "next/link";

interface IParams extends ParsedUrlQuery {
  slug: string;
}

interface Props {
  post: Writing;
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { slug } = params as IParams;

  return {
    props: { post: await getWriting(slug) },
  };
};

const Post: NextPage<Props> = ({ post }) => {
  const sounds = useInteractionSounds();

  return (
    <Entrance className="flex w-full flex-col">
      <EntranceItem>
        <Link
          href="/"
          {...sounds}
          className="focus-outline-tight mb-8 inline-block w-fit font-mono text-xs text-gray-600 duration-150 ease-circ-out hover:text-gray-300 active:brightness-75"
        >
          ← back
        </Link>
      </EntranceItem>

      <EntranceItem>
        <header className="mb-10 flex flex-col gap-3">
          <h1 className="text-pretty text-2xl sm:text-3xl">{post.title}</h1>
          <span className="flex min-w-0 flex-row items-center justify-between gap-2 font-mono">
            <time dateTime={post.date} className="shrink-0 text-xs text-gray-600">
              {formatDate(post.date)}
            </time>
            <Tags tags={post.tags} />
          </span>
        </header>
      </EntranceItem>

      <EntranceItem>
        <article>
          <MDXRemote {...post.source} components={components} />
        </article>
      </EntranceItem>
    </Entrance>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getWritingSlugs().map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export default Post;
