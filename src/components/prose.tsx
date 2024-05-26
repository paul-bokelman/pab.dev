import React, { PropsWithChildren } from "react";
import { Link } from "./link";

export const P: React.FC<PropsWithChildren> = ({ children }) => {
  return <p className="text-base leading-6 mb-4 dark:text-dark-sub">{children}</p>;
};

export const H2: React.FC<PropsWithChildren> = ({ children }) => {
  return <h2 className="font-charter text-lg leading-10 mt-6 dark:text-dark-main">{children}</h2>;
};

export const CodeBlock: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <pre className="border border-black/20 dark:border-dark-box-border dark:bg-dark-box-bg rounded-md p-3 my-4 text-sm dark:text-dark-sub [&>code]:dark:bg-transparent [&>code]:dark:text-dark-sub">
      {children}
    </pre>
  );
};

export const Code: React.FC<PropsWithChildren> = ({ children }) => {
  return <code className="dark:bg-dark-hover dark:text-dark-primary px-1 py-0.5 rounded-md">{children}</code>;
};

export const components = {
  h2: (props: any) => <H2 {...props} />,
  p: (props: any) => <P {...props} />,
  pre: (props: any) => <CodeBlock {...props} />,
  code: (props: any) => <Code {...props} />,
  a: (props: any) => <Link {...props} />,
};
