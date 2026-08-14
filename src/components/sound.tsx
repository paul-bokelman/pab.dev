import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type SoundName = "hover" | "click" | "swoosh" | "tada" | "pencil";

type PlayOptions = { rate?: number; volume?: number };

/**
 * Sounds are synthesised at runtime rather than shipped as audio files — a few
 * oscillators and a noise buffer weigh nothing and stay in tune with the rest
 * of the palette. The context stays suspended until the first real gesture,
 * because a page that makes noise before you touch it is a page you close.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;

  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
};

const getNoise = (c: AudioContext): AudioBuffer => {
  if (noiseBuffer) return noiseBuffer;
  const length = Math.floor(c.sampleRate * 2);
  const buffer = c.createBuffer(1, length, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buffer;
  return buffer;
};

type ToneOptions = {
  freq: number;
  to?: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  at?: number;
};

const tone = ({ freq, to, duration, type = "sine", gain = 0.05, at = 0 }: ToneOptions) => {
  const c = getCtx();
  if (!c || !master) return;

  const t = c.currentTime + at;
  const osc = c.createOscillator();
  const g = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t + duration);

  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(gain, 0.0002), t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  osc.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + duration + 0.05);
};

type NoiseOptions = { from: number; to: number; duration: number; q?: number; gain?: number; at?: number };

const noise = ({ from, to, duration, q = 1.2, gain = 0.05, at = 0 }: NoiseOptions) => {
  const c = getCtx();
  if (!c || !master) return;

  const t = c.currentTime + at;
  const src = c.createBufferSource();
  src.buffer = getNoise(c);
  src.loop = true;

  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = q;
  bp.frequency.setValueAtTime(from, t);
  bp.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t + duration);

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(gain, 0.0002), t + duration * 0.2);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  src.connect(bp);
  bp.connect(g);
  g.connect(master);
  src.start(t);
  src.stop(t + duration + 0.05);
};

const voices: Record<SoundName, (o: PlayOptions) => void> = {
  hover: ({ rate = 1, volume = 1 }) =>
    tone({ freq: 960 * rate, to: 660 * rate, duration: 0.05, type: "sine", gain: 0.035 * volume }),

  click: ({ rate = 1, volume = 1 }) => {
    tone({ freq: 1480 * rate, to: 720 * rate, duration: 0.06, type: "triangle", gain: 0.055 * volume });
    noise({ from: 2400, to: 900, duration: 0.04, q: 0.8, gain: 0.02 * volume });
  },

  swoosh: ({ volume = 1 }) => noise({ from: 420, to: 3200, duration: 0.26, q: 0.7, gain: 0.03 * volume }),

  tada: ({ volume = 1 }) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      tone({ freq, duration: 0.5 - i * 0.05, type: "triangle", gain: 0.05 * volume, at: i * 0.085 });
    });
    noise({ from: 3000, to: 6000, duration: 0.5, q: 0.5, gain: 0.012 * volume, at: 0.34 });
  },

  // a scribble: short jittered noise strokes for as long as the writing lasts
  pencil: ({ volume = 1, rate = 1 }) => {
    const strokes = Math.round(22 * rate);
    for (let i = 0; i < strokes; i++) {
      const at = i * (0.09 + Math.random() * 0.03);
      noise({
        from: 1600 + Math.random() * 2200,
        to: 900 + Math.random() * 1400,
        duration: 0.05 + Math.random() * 0.05,
        q: 0.6,
        gain: (0.012 + Math.random() * 0.01) * volume,
        at,
      });
    }
  },
};

type SoundContextValue = {
  muted: boolean;
  toggle: () => void;
  play: (name: SoundName, options?: PlayOptions) => void;
};

const SoundContext = createContext<SoundContextValue>({ muted: true, toggle: () => {}, play: () => {} });

const STORAGE_KEY = "pab:sound";

export const SoundProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [muted, setMuted] = useState(false);
  const unlocked = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setMuted(stored === "off");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced && !stored) setMuted(true);

    const unlock = () => {
      unlocked.current = true;
      getCtx();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const play = useCallback(
    (name: SoundName, options: PlayOptions = {}) => {
      if (muted || !unlocked.current) return;
      try {
        voices[name](options);
      } catch {
        /* an unavailable audio context is not worth a crash */
      }
    },
    [muted]
  );

  const toggle = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      window.localStorage.setItem(STORAGE_KEY, next ? "off" : "on");
      if (!next) {
        unlocked.current = true;
        getCtx();
        voices.click({});
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ muted, toggle, play }), [muted, toggle, play]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useSound = () => useContext(SoundContext);

/** small helper — every interactive surface gets the same hover/press voice */
export const useInteractionSounds = () => {
  const { play } = useSound();
  const rate = () => 0.96 + Math.random() * 0.08;

  return {
    onMouseEnter: () => play("hover", { rate: rate() }),
    onClick: () => play("click", { rate: rate() }),
  };
};
