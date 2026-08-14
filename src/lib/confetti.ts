type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  cells: Array<[number, number]>;
  spin: number;
  angle: number;
};

const CELL = 4;
const GRAVITY = 0.42;
const DRAG = 0.988;
const LIFE = 2600;

/** a 3x3 arrangement of blocks — confetti that matches the bitmap font */
const shape = (): Array<[number, number]> => {
  const cells: Array<[number, number]> = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (Math.random() > 0.45) cells.push([col, row]);
    }
  }
  return cells.length ? cells : [[1, 1]];
};

export const pixelBurst = (x: number, y: number, colors: Array<string>, count = 180) => {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "60",
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const particles: Array<Particle> = Array.from({ length: count }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.1;
    const speed = 6 + Math.random() * 14;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed * 1.1,
      vy: Math.sin(angle) * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      cells: shape(),
      spin: (Math.random() - 0.5) * 0.24,
      angle: 0,
    };
  });

  const start = performance.now();

  const frame = (now: number) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let alive = false;
    const fade = Math.max(0, 1 - Math.max(0, elapsed - LIFE * 0.55) / (LIFE * 0.45));

    for (const p of particles) {
      p.vy += GRAVITY;
      p.vx *= DRAG;
      p.vy *= DRAG;
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;

      if (p.y < window.innerHeight + 60) alive = true;

      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      for (const [col, row] of p.cells) ctx.fillRect(col * CELL - CELL * 1.5, row * CELL - CELL * 1.5, CELL, CELL);
      ctx.restore();
    }

    if (alive && elapsed < LIFE) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  };

  requestAnimationFrame(frame);
};
