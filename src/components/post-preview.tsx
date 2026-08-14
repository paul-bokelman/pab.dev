import type { FC } from "react";
import type { WritingPreview } from "types";
import { Card } from "./card";
import { Tags } from "./tag";

export const formatDate = (date: string) =>
  new Date(date)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    .toLowerCase();

export const PostPreview: FC<WritingPreview> = ({ title, excerpt, slug, date, tags }) => (
  <Card
    href={`/posts/${slug}`}
    title={title}
    description={excerpt}
    meta={<time dateTime={date}>{formatDate(date)}</time>}
    trailing={<Tags tags={tags} />}
  />
);
