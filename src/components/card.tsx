import React from "react";
import NextLink from "next/link";
import { useInteractionSounds } from "./sound";

type Props = {
  href: string;
  external?: boolean;
  title: string;
  description: string;
  /** left side of the meta row — a date, a host, a label */
  meta: React.ReactNode;
  /** right side of the meta row */
  trailing?: React.ReactNode;
};

/**
 * Fixed-height entry. Title and description sit at the top, the mono meta row
 * is pushed to the bottom. The negative margin expands the hit area past the
 * visual bounds so the whole cell is clickable.
 */
export const Card: React.FC<Props> = ({ href, external, title, description, meta, trailing }) => {
  const sounds = useInteractionSounds();

  const inner = (
    <div className="flex h-full min-w-0 flex-col justify-between gap-2 p-4">
      <div className="flex min-w-0 flex-col gap-2">
        <h3
          title={title}
          className="line-clamp-1 min-w-0 text-lg text-gray-300 transition-colors duration-150 group-hover:text-gray-150"
        >
          {title}
        </h3>
        <span className="-mt-1 line-clamp-2 text-sm text-gray-600">{description}</span>
      </div>
      <span className="flex min-w-0 flex-row items-center justify-between gap-2 font-mono">
        <span className="flex shrink-0 items-center gap-2 text-xs text-gray-600">{meta}</span>
        {trailing}
      </span>
    </div>
  );

  const className =
    "group h-32 w-full min-w-0 rounded-[2px] duration-150 ease-circ-out hover:-translate-y-px active:translate-y-px active:brightness-75";

  return (
    <li className="grid min-w-0">
      <div className="relative -m-2 grid min-w-0">
        {external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...sounds}>
            {inner}
          </a>
        ) : (
          <NextLink href={href} className={className} {...sounds}>
            {inner}
          </NextLink>
        )}
      </div>
    </li>
  );
};
