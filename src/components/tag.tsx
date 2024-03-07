import React from "react";
import { IconType } from "react-icons";
import { SiReact, SiTypescript } from "react-icons/si";

export type TagNames = typeof tagNames;

type Icons = Record<TagNames[number], { icon: React.ReactNode; color: string }>;

type Props = {
  name: TagNames[number];
  withName?: boolean;
};

const tagNames = ["react", "typescript"] as const;

export const icons: Icons = {
  react: { icon: <SiReact />, color: "#5BD0EE" },
  typescript: { icon: <SiTypescript />, color: "#007ACC" },
};

export const Tag: React.FC<Props> = ({ name, withName }) => {
  const { icon, color } = icons[name];

  return (
    <span className="text-sm" style={{ color: color }}>
      {withName ? (
        <div className="flex flex-row items-center gap-1">
          {icon} {name}
        </div>
      ) : (
        icon
      )}
    </span>
  );
};
