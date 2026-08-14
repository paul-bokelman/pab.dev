import React from "react";
import { useInView } from "motion/react";

type Props = React.PropsWithChildren<{
  /** ms before the stroke starts drawing */
  delay?: number;
  color?: string;
  type?: "underline" | "bracket" | "circle" | "highlight";
}>;

/**
 * Not a text-decoration. Three overlapping sketch strokes drawn as SVG paths,
 * each animated by stroke-dashoffset, so the line arrives the way someone
 * would actually draw it — over about a second, slightly wrong on purpose.
 */
export const Underline: React.FC<Props> = ({
  children,
  delay = 0,
  color = "rgba(241, 115, 61, 0.32)",
  type = "underline",
}) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.6, once: true });

  React.useEffect(() => {
    if (!inView || !ref.current) return;

    const element = ref.current;
    let cancelled = false;
    let timer = 0;
    let annotation: { show: () => void; remove: () => void } | null = null;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    void import("rough-notation").then(({ annotate }) => {
      if (cancelled) return;
      annotation = annotate(element, {
        type,
        color,
        strokeWidth: 2,
        iterations: 3,
        padding: 1,
        animate: !reduced,
        animationDuration: 1000,
        multiline: true,
      });
      timer = window.setTimeout(() => annotation?.show(), delay);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      annotation?.remove();
    };
  }, [inView, color, type, delay]);

  return (
    <span ref={ref} className="relative inline">
      {children}
    </span>
  );
};
