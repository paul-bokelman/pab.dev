import React from "react";
import cn from "classnames";
import { useSound } from "./sound";
import { pixelBurst } from "lib/confetti";

const COLORS = ["#b3594f", "#ba9659", "#778463", "#647095"];

const colorFor = (char: string, index: number) =>
  COLORS[((char.codePointAt(0) ?? 0) + index + Math.floor(index / 2) + 1) % COLORS.length];

const useFinePointer = () => {
  const [fine, setFine] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return fine;
};

type LetterProps = {
  char: string;
  index: number;
  lit: boolean;
  locked: boolean;
  interactive: boolean;
  onLight: (index: number, element: HTMLElement | null) => void;
};

const Letter: React.FC<LetterProps> = ({ char, index, lit, locked, interactive, onLight }) => {
  const ref = React.useRef<HTMLSpanElement>(null);

  if (char === " ") return <span className="whitespace-pre"> </span>;

  const on = lit || locked;
  const duration = locked ? "duration-500" : "duration-300";

  // the resting state is pure CSS so there is no hydration flash: touch devices
  // see the bitmap face, pointer devices see the mono face until they sweep it
  return (
    <span
      ref={ref}
      className="group inline-grid cursor-pointer leading-none"
      onMouseEnter={interactive ? () => onLight(index, ref.current) : undefined}
    >
      <span
        style={on ? { opacity: 0 } : undefined}
        className={cn(
          "col-start-1 row-start-1 font-mono transition ease-circ-out",
          duration,
          "opacity-0 [@media(hover:hover)_and_(pointer:fine)]:opacity-100",
          !locked && "group-hover:opacity-0 group-hover:duration-75"
        )}
      >
        {char}
      </span>
      <span
        aria-hidden
        style={on ? { opacity: 1, color: colorFor(char, index) } : undefined}
        className={cn(
          "col-start-1 row-start-1 select-none font-fancy transition ease-circ-out",
          duration,
          "opacity-100 [@media(hover:hover)_and_(pointer:fine)]:opacity-0",
          !locked && "group-hover:opacity-100 group-hover:duration-75"
        )}
      >
        {char}
      </span>
    </span>
  );
};

/**
 * The subhead is set twice — once in the mono face, once in a bitmap face —
 * stacked in the same grid cell. Touch devices get the pixels, pointers get
 * the mono until you sweep across it. Light every letter and the page says so.
 */
export const FontSwap: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const interactive = useFinePointer();
  const { play } = useSound();
  const [lit, setLit] = React.useState<Set<number>>(new Set());
  const [locked, setLocked] = React.useState(false);
  const timers = React.useRef<Map<number, number>>(new Map());
  const last = React.useRef<HTMLElement | null>(null);
  const celebrated = React.useRef(false);

  const chars = React.useMemo(() => Array.from(text), [text]);
  const target = React.useMemo(() => chars.filter((c) => c !== " ").length, [chars]);

  React.useEffect(() => {
    const map = timers.current;
    return () => map.forEach((id) => window.clearTimeout(id));
  }, []);

  // every letter lit at once — the payoff lives in an effect so it fires exactly once
  React.useEffect(() => {
    if (celebrated.current || target === 0 || lit.size < target) return;
    celebrated.current = true;
    setLocked(true);
    play("tada");

    const rect = last.current?.getBoundingClientRect();
    const timer = window.setTimeout(
      () =>
        pixelBurst(
          rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
          rect ? rect.top + rect.height / 2 : window.innerHeight / 3,
          COLORS
        ),
      60
    );
    return () => window.clearTimeout(timer);
  }, [lit, target, play]);

  const onLight = React.useCallback(
    (index: number, element: HTMLElement | null) => {
      if (locked) return;

      last.current = element;
      play("hover", { rate: (0.96 + (index / chars.length) * 0.08) * 0.9 });

      setLit((prev) => (prev.has(index) ? prev : new Set(prev).add(index)));

      window.clearTimeout(timers.current.get(index));
      timers.current.set(
        index,
        window.setTimeout(() => {
          setLit((prev) => {
            if (prev.size >= target) return prev;
            const next = new Set(prev);
            next.delete(index);
            return next;
          });
        }, 600)
      );
    },
    [chars.length, locked, play, target]
  );

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>
        {chars.map((char, i) => (
          <Letter
            key={`${char}-${i}`}
            char={char}
            index={i}
            lit={lit.has(i)}
            locked={locked}
            interactive={interactive}
            onLight={onLight}
          />
        ))}
      </span>
    </span>
  );
};
