import React from "react";
import { motion, useInView, type Variants } from "motion/react";
import { useSound } from "./sound";

/**
 * Nothing arrives all at once. Blocks fade in over two seconds while sliding
 * up over one, staggered a tenth of a second apart, so the page assembles
 * itself in roughly the order you'd read it.
 */
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, transform: "translateY(8px)" },
  visible: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: {
      duration: 2,
      ease: "circIn",
      transform: { duration: 1, ease: [0.19, 1, 0.22, 1] },
    },
  },
};

export const Entrance: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <motion.div className={className} variants={container} initial="hidden" animate="visible">
    {children}
  </motion.div>
);

export const EntranceItem: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <motion.div data-motion className={className} variants={item}>
    {children}
  </motion.div>
);

type TextRevealProps = {
  text: string;
  className?: string;
  /** seconds between characters */
  stagger?: number;
  /** seconds each character takes to arrive */
  duration?: number;
  delay?: number;
  /** a sound to scribble along with the reveal */
  sound?: "pencil";
};

/**
 * Per-character reveal. When a sound is attached, the stagger is derived from
 * the sound's length so the last character lands as the noise stops.
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className,
  stagger = 0.045,
  duration = 0.375,
  delay = 0.4,
  sound,
}) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.6, once: true });
  const { play } = useSound();
  const played = React.useRef(false);

  const chars = React.useMemo(() => Array.from(text), [text]);
  const span = chars.length > 1 ? stagger : 0;

  React.useEffect(() => {
    if (!inView || played.current || !sound) return;
    played.current = true;
    const written = delay * 1000;
    const timer = window.setTimeout(() => {
      play(sound, { rate: (chars.length * span) / 2 });
    }, written);
    return () => window.clearTimeout(timer);
  }, [inView, sound, play, delay, chars.length, span]);

  return (
    <motion.span
      ref={ref}
      aria-label={text}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: span, delayChildren: delay } } }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          aria-hidden
          data-motion
          className="inline-block whitespace-pre"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};
