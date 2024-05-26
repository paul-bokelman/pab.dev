import React from "react";
import projects from "../data/projects.json";
import { type TagNames, Tag } from "./tag";

type ProjectPreviewProps = Omit<(typeof projects)[number], "tags"> & { tags: TagNames };

export const ProjectPreview: React.FC<ProjectPreviewProps> = (project) => {
  return (
    <div className="flex flex-row items-center hover:translate-x-3 group hover:scale-105 transition-transform">
      <a
        href={project.github}
        rel="noopener noreferrer"
        target="_blank"
        className="flex text-sm px-2 py-1 hover:bg-gray-200 dark:group-hover:bg-dark-hover dark:text-dark-sub group-hover:text-dark-primary rounded-md cursor-pointer transition relative right-2"
      >
        {project.name}
      </a>
      <div className="flex flex-row items-center gap-2">
        {project.tags.map((name) => (
          <Tag key={name} name={name} />
        ))}
      </div>
    </div>
  );
};
