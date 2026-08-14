import React from "react";
import cn from "classnames";

const frameVars = {
  "--fb-h": "-4rem",
  "--fb-mh": "max(-4rem, calc(50% - 50dvw))",
  "--fb-v": "-4rem",
  "--fb-mv": "-1rem",
  "--fb-v-mask": "linear-gradient(transparent, black 35%, black 65%, transparent)",
  "--fb-mv-mask": "linear-gradient(transparent, black 1rem, black calc(100% - 1rem), transparent)",
} as React.CSSProperties;

const rule = "absolute border-dashed border-gray-700/80";

/**
 * Four masked, dashed 1px rules that bleed past the content column so they
 * trail off toward the viewport edges instead of closing into a box.
 */
export const FadedFrame: React.FC<React.PropsWithChildren<{ className?: string; breakout?: boolean }>> = ({
  children,
  className,
  breakout = true,
}) => {
  return (
    <div
      style={frameVars}
      className={cn(
        "relative -mx-1 w-[calc(100%+0.5rem)] p-2 sm:-mx-2 sm:w-[calc(100%+1rem)]",
        breakout &&
          "lg:mx-[calc((100%-min(calc(100vw-3rem),64rem))/2)] lg:w-[min(calc(100vw-3rem),64rem)] lg:max-w-none",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          rule,
          "inset-x-[var(--fb-mh)] top-0 h-px border-t sm:inset-x-[var(--fb-h)]",
          "[mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]"
        )}
      />
      <span
        aria-hidden
        className={cn(
          rule,
          "inset-x-[var(--fb-mh)] bottom-0 h-px border-b sm:inset-x-[var(--fb-h)]",
          "[mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]"
        )}
      />
      <span
        aria-hidden
        className={cn(
          rule,
          "inset-y-[var(--fb-mv)] left-0 w-px border-l sm:inset-y-[var(--fb-v)]",
          "[mask-image:var(--fb-mv-mask)] sm:[mask-image:var(--fb-v-mask)]"
        )}
      />
      <span
        aria-hidden
        className={cn(
          rule,
          "inset-y-[var(--fb-mv)] right-0 w-px border-r sm:inset-y-[var(--fb-v)]",
          "[mask-image:var(--fb-mv-mask)] sm:[mask-image:var(--fb-v-mask)]"
        )}
      />
      {children}
    </div>
  );
};

type SectionProps = React.PropsWithChildren<{
  id?: string;
  title: string;
  description?: string;
}>;

export const Section: React.FC<SectionProps> = ({ id, title, description, children }) => {
  return (
    <section id={id} className="flex w-full scroll-mt-24 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-pretty text-2xl">{title}</h2>
        {description ? <div className="text-sm text-muted">{description}</div> : null}
      </div>
      {children}
    </section>
  );
};
