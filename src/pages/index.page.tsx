import React from "react";
import type { NextPage, GetStaticProps } from "next";
import type { PostPreview as PostPreviewType } from "types";
import { getPreviewPosts } from "lib/api";
import { PostPreview, ProjectPreview, Link, TagNames } from "components";
import projects from "../data/projects.json";

interface Props {
  posts: Array<PostPreviewType>;
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPreviewPosts();

  return {
    props: { posts },
  };
};

const Index: NextPage<Props> = ({ posts }) => {
  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <h1 className="font-charter text-lg md:text-2xl tracking-wide text-dark-main">Paul A. Bokelman</h1>
          <span className="relative text-xs md:text-base md:top-[1px] md:ml-5 text-dark-primary">
            Computer Scientist
          </span>
        </div>
        <div className="flex flex-col gap-2 text-xs md:text-sm text-dark-sub">
          <p>
            Hey there! I&apos;m a Computer Science student with a keen interest in machine learning. I&apos;m passionate
            about exploring how technology can make a difference. Feel free to check out my projects and inconsistent
            pieces of writing to see what I&apos;ve been working on!
          </p>
          <div className="flex items-center gap-2">
            <Link href="https://github.com/paul-bokelman">github</Link>
            <Link href="https://twitter.com/paul_bokelman">twitter</Link>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2 text-dark-main">
        <h2 className="font-charter md:text-lg">My Favorite Projects</h2>
        <div className="flex flex-col gap-1 md:gap-2">
          {projects.map(({ tags, ...project }) => (
            <ProjectPreview key={project.name} tags={tags as unknown as TagNames} {...project} />
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2 text-dark-main">
        <h2 className="font-charter md:text-lg">Some Writing</h2>
        {posts.length == 0 ? (
          <span className="text-sm text-dark-sub">No posts yet, check back soon...</span>
        ) : (
          <div className="flex flex-col gap-2">
            {posts.map((post) => (
              <PostPreview key={post.slug} {...post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
