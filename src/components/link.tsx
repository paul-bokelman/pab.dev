import React from "react";

type Props = {
  href: string;
  children: React.ReactNode;
};

export const Link: React.FC<Props> = (props) => {
  return (
    <a
      href={props.href}
      rel="noreferrer"
      target="_blank"
      className="text-dark-primary hover:text-dark-primary/80 underline cursor-pointer"
    >
      {props.children}
    </a>
  );
};
