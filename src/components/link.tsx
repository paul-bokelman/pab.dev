import React from "react";
import { useInteractionSounds } from "./sound";

type Props = {
  href: string;
  children: React.ReactNode;
};

export const Link: React.FC<Props> = ({ href, children }) => {
  const external = /^https?:\/\//.test(href);
  const sounds = useInteractionSounds();

  return (
    <a
      href={href}
      rel={external ? "noopener noreferrer" : undefined}
      target={external ? "_blank" : undefined}
      className="link-default active:brightness-75"
      {...sounds}
    >
      {children}
    </a>
  );
};
