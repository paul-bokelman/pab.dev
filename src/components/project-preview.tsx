import React from "react";
import type { Project } from "types";
import { Card } from "./card";
import { Tags } from "./tag";

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export const ProjectPreview: React.FC<Project> = ({ name, description, github, website, tags }) => (
  <Card
    href={website || github}
    external
    title={name}
    description={description}
    meta={<span>{website ? host(website) : "github"}</span>}
    trailing={<Tags tags={tags} />}
  />
);
