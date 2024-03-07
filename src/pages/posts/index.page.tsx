import type { NextPage, GetStaticProps } from "next";
import { getPreviewPosts } from "lib/api";
import { PostPreview } from "types";
import Link from "next/link";

interface Props {
  posts: Array<PostPreview>;
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPreviewPosts();

  return {
    props: { posts },
  };
};

const Posts: NextPage<Props> = ({ posts }) => {
  console.log(posts);
  return (
    <div>
      {posts.map(({ slug }) => (
        <Link href={`posts/${slug}`} key={slug}>
          {slug}
        </Link>
      ))}
    </div>
  );
};

export default Posts;
