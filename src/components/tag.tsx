import React from "react";
import type { Tag as TagName } from "types";

type Props = {
  name: TagName;
  last?: boolean;
};

/** metadata, not decoration — lowercase mono, dim, comma separated */
export const Tag: React.FC<Props> = ({ name, last }) => (
  <span className="font-mono text-xs text-gray-600/60">
    {name.toLowerCase()}
    {last ? "" : ","}
  </span>
);

type TagsProps = { tags: Array<TagName> };

export const Tags: React.FC<TagsProps> = ({ tags }) => (
  <span className="line-clamp-1 flex w-full items-center justify-end gap-1 text-nowrap [mask-image:linear-gradient(to_right,transparent,black_50%)]">
    {tags.map((name, i) => (
      <Tag key={name} name={name} last={i === tags.length - 1} />
    ))}
  </span>
);
