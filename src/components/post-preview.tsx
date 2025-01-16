import type { FC } from "react";
import type { PostPreview as PostPreviewType } from "types";
import Link from "next/link";
import { Tag } from "components/tag";

type PostPreviewProps = PostPreviewType;

export const PostPreview: FC<PostPreviewProps> = ({ title, excerpt, slug, date, tags }) => {
  return (
    <div className="flex flex-row items-center hover:translate-x-5 group hover:scale-105 transition-transform hover:cursor-pointer">
      <Link
        href={`/posts/${slug}`}
        className="flex text-xs md:text-sm px-2 py-1 hover:bg-gray-200 group-hover:bg-dark-hover text-dark-sub group-hover:text-dark-primary rounded-md cursor-pointer transition relative right-2"
      >
        {title}
      </Link>
      <div className="flex flex-row items-center gap-2">
        {tags.map((name) => (
          <Tag key={name} name={name} />
        ))}
      </div>
    </div>
  );
};
