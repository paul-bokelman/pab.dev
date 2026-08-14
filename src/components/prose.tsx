import React, { PropsWithChildren } from "react";
import { Link } from "./link";

export const P: React.FC<PropsWithChildren> = ({ children }) => (
  <p className="mb-6 text-base leading-[1.55] text-gray-250">{children}</p>
);

export const H2: React.FC<PropsWithChildren> = ({ children }) => (
  <h2 className="mb-3 mt-10 text-pretty text-2xl text-gray-200">{children}</h2>
);

export const H3: React.FC<PropsWithChildren> = ({ children }) => (
  <h3 className="mb-2 mt-8 text-pretty text-xl text-gray-200">{children}</h3>
);

export const CodeBlock: React.FC<PropsWithChildren> = ({ children }) => (
  <pre className="my-6 overflow-x-auto border border-dashed border-gray-700/80 bg-gray-900/40 p-4 text-sm text-gray-400 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit">
    {children}
  </pre>
);

export const Code: React.FC<PropsWithChildren> = ({ children }) => (
  <code className="bg-gray-900 px-1 py-0.5 font-mono text-sm text-yellow-500">{children}</code>
);

export const Blockquote: React.FC<PropsWithChildren> = ({ children }) => (
  <blockquote className="my-6 border-l border-dashed border-gray-700/80 pl-4 text-gray-500 [&>p]:mb-0">
    {children}
  </blockquote>
);

export const components = {
  h2: (props: any) => <H2 {...props} />,
  h3: (props: any) => <H3 {...props} />,
  p: (props: any) => <P {...props} />,
  pre: (props: any) => <CodeBlock {...props} />,
  code: (props: any) => <Code {...props} />,
  a: (props: any) => <Link {...props} />,
  blockquote: (props: any) => <Blockquote {...props} />,
  hr: () => <hr className="my-10 border-t border-dashed border-gray-800" />,
  li: (props: any) => <li className="mb-2 text-base leading-[1.55] text-gray-250">{props.children}</li>,
  ul: (props: any) => <ul className="mb-6 list-disc pl-6 marker:text-gray-700">{props.children}</ul>,
  ol: (props: any) => <ol className="mb-6 list-decimal pl-6 marker:text-gray-700">{props.children}</ol>,
};
