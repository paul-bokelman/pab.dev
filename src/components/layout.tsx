import React, { PropsWithChildren } from "react";

const Grain: React.FC = () => (
  <>
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] select-none opacity-[0.05] mix-blend-hard-light"
      style={{ filter: "url(#noiseFilter)" }}
    />
    <svg aria-hidden className="hidden">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="9.3" numOctaves={4} stitchTiles="stitch" result="noise" />
        <feColorMatrix type="saturate" values="0" result="mono" />
        <feComponentTransfer result="contrast">
          <feFuncR type="linear" slope="1.5" intercept="-0.25" />
          <feFuncG type="linear" slope="1.5" intercept="-0.25" />
          <feFuncB type="linear" slope="1.5" intercept="-0.25" />
        </feComponentTransfer>
      </filter>
    </svg>
  </>
);

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <main id="top" className="relative z-10 min-h-[100dvh] bg-gray-950">
        <div className="relative mx-auto flex w-full max-w-xl flex-col gap-8 px-6 py-24 sm:gap-12">{children}</div>
      </main>
      <Grain />
    </>
  );
};
