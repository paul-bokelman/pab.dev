import React from "react";
import { SiPython, SiReact, SiTypescript, SiCplusplus, SiSolidity } from "react-icons/si";

export type TagNames = typeof tagNames;

type Icons = Record<TagNames[number], { icon: React.ReactNode | string; color: string }>;

type Props = {
  name: TagNames[number];
  withName?: boolean;
};

const tagNames = ["react", "typescript", "python", "C++", "solidity", "philosophy"] as const;

export const icons: Icons = {
  react: { icon: <SiReact />, color: "#5BD0EE" },
  typescript: { icon: <SiTypescript />, color: "#007ACC" },
  python: { icon: <SiPython />, color: "#FFDC53" },
  "C++": { icon: <SiCplusplus />, color: "#659BD3" },
  solidity: { icon: <SiSolidity />, color: "#D2CEDF" },
  philosophy: { icon: "🧠", color: "#F698B7" },
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
