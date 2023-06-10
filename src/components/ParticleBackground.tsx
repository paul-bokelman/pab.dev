import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import randomColor from "randomcolor";
import { random, hexToRGBA, adjustAlpha, circle, easeInOutQuad, easeInOutSine } from "../utils";

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

type Coordinates = [number, number];

interface ParticleConfig {
  starCount: number;
  starSizeRange: number;
  starColor: string | { variationProbability: number };
  starFadeRate: number;
  shootingStarColor?: string;
  shootingStarSizeRange: number;
  shootingStarCount: number;
  shootingStarVelocityRange: number;
  shootingStarTrailMultiplier: number;
}

export const ParticleBackground: React.FC<Props> = ({ children }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  // stupid state doesn't update on first render (gotta resort to monkey brain)
  const dimensions = {
    w: ctx?.canvas.getBoundingClientRect().width || 0,
    h: ctx?.canvas.getBoundingClientRect().height || 0,
  };

  const config: ParticleConfig = {
    starCount: 2000,
    starSizeRange: 1.4,
    starColor: { variationProbability: 0.1 },
    starFadeRate: 0.1,
    shootingStarSizeRange: 1.8,
    shootingStarColor: undefined,
    shootingStarCount: 5,
    shootingStarVelocityRange: 1.5,
    shootingStarTrailMultiplier: 6,
  };

  const nudgeCoordinates = (coordinates: Coordinates, range: number): Coordinates => {
    return coordinates.map((val): number => {
      return val + random(-range, range);
    }) as Coordinates;
  };

  const computeVelocity = (n: number) => {
    return { x: easeInOutQuad(random(-n, n)), y: easeInOutQuad(random(-n, n)) };
  };

  const computeColor = (c?: string, disc: "star" | "shootingStar" = "star") => {
    const color = c ?? (config[disc === "star" ? "starColor" : "shootingStarColor"] as string);
    return color.includes("#") ? hexToRGBA(color) : color;
  };

  class ShootingStar {
    x: number;
    y: number;
    color: string;
    size: number;
    alpha: number;
    alphaIncreasing: boolean;
    velocity: { x: number; y: number };

    constructor([x, y]: Coordinates, color: string | undefined) {
      this.x = x;
      this.y = y;
      this.size = random(0, config.shootingStarSizeRange);
      this.color = computeColor(color, "shootingStar");
      this.alpha = easeInOutSine(random(0, 1));
      this.alphaIncreasing = false;

      this.velocity = computeVelocity(config.shootingStarVelocityRange);
    }
    draw() {
      if (ctx) {
        circle(ctx, [this.x, this.y], this.size, this.color);
        ctx.shadowBlur = 10;
        ctx.shadowColor = adjustAlpha(this.color, 1);
      }
    }
    update() {
      if (ctx) {
        if (this.x > dimensions.w || this.y > dimensions.h || this.alpha <= 0) {
          this.x = random(0, dimensions.w);
          this.y = random(0, dimensions.h);
          this.alpha = 0.001;
          this.velocity = computeVelocity(config.shootingStarVelocityRange);
          this.size = random(0, config.shootingStarSizeRange);
        }

        const ls = { x: this.x, y: this.y };

        if (this.alphaIncreasing) {
          this.alpha = parseFloat((this.alpha + easeInOutSine(random(0, config.starFadeRate))).toFixed(3));
          if (this.alpha >= 1) this.alphaIncreasing = false;
        } else {
          this.alpha = parseFloat((this.alpha - easeInOutSine(random(0, config.starFadeRate))).toFixed(3));
          if (this.alpha <= 0) this.alphaIncreasing = true;
        }
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

        this.color = adjustAlpha(this.color, this.alpha);

        ctx.fillStyle = this.color;

        ctx.beginPath();
        const gradient = ctx.createLinearGradient(
          this.x,
          this.y,
          ls.x - this.velocity.x * config.shootingStarTrailMultiplier,
          ls.y - this.velocity.y * config.shootingStarTrailMultiplier
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, adjustAlpha(this.color, this.alpha - 0.4));
        gradient.addColorStop(1, adjustAlpha(this.color, this.alpha - 0.6));
        ctx.moveTo(
          ls.x - this.velocity.x * config.shootingStarTrailMultiplier,
          ls.y - this.velocity.y * config.shootingStarTrailMultiplier
        );
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.size * 2;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  class Star {
    x: number;
    y: number;
    color: string;
    size: number;
    alpha: number;
    alphaIncreasing: boolean;

    constructor([x, y]: Coordinates, color: string | undefined) {
      this.x = x;
      this.y = y;
      this.size = random(0, config.starSizeRange);
      this.color = computeColor(color, "star");
      this.alpha = easeInOutSine(random(0, 1));
      this.alphaIncreasing = false;
    }
    draw() {
      if (ctx) {
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        circle(ctx, [this.x, this.y], this.size, this.color);
      }
    }
    update() {
      if (ctx) {
        if (this.alpha === 0) {
          this.x = random(0, dimensions.w);
          this.y = random(0, dimensions.h);
        }
        const [x, y] = nudgeCoordinates([this.x, this.y], 0.09);
        this.x = x;
        this.y = y;

        if (this.alphaIncreasing) {
          this.alpha = parseFloat((this.alpha + easeInOutSine(random(0, config.starFadeRate))).toFixed(3));
          if (this.alpha >= 1) this.alphaIncreasing = false;
        } else {
          this.alpha = parseFloat((this.alpha - easeInOutSine(random(0, config.starFadeRate))).toFixed(3));
          if (this.alpha <= 0) this.alphaIncreasing = true;
        }

        this.color = adjustAlpha(this.color.includes("#") ? hexToRGBA(this.color) : this.color, this.alpha);
      }
    }
  }

  const draw = (particles: (Star | ShootingStar)[]) => {
    if (ctx) {
      ctx?.clearRect(0, 0, dimensions.w, dimensions.h);
      for (const particle of [...particles]) {
        particle.update();
        particle.draw();
      }
    }
  };

  const initializeParticles = () => {
    const stars = [];
    const shootingStars = [];

    for (const _ of Array.from({ length: config.starCount })) {
      // could use map tbh
      const coordinates: Coordinates = [random(0, dimensions.w), random(0, dimensions.h)];

      const color = // should occur in constructor?
        typeof config.starColor !== "string"
          ? config.starColor.variationProbability * 10 >= random(0, 10, true)
            ? randomColor()
            : randomColor({ hue: "monochrome" })
          : undefined;

      const star = new Star(coordinates, color);
      stars.push(star);
    }

    for (const _ of Array.from({ length: config.shootingStarCount })) {
      const coordinates: Coordinates = [random(0, dimensions.w), random(0, dimensions.h)];
      const shootingStar = new ShootingStar(coordinates, randomColor());
      shootingStars.push(shootingStar);
    }

    return [...stars, ...shootingStars];
  };

  const resizeCanvas = (context: CanvasRenderingContext2D) => {
    const canvas = context.canvas;
    const { width, height } = canvas.getBoundingClientRect();

    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio: ratio = 1 } = window;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.scale(ratio, ratio);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (canvas.current) setCtx(canvas.current.getContext("2d"));
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    if (ctx) {
      const particles = initializeParticles();
      const render = () => {
        resizeCanvas(ctx);
        draw(particles);
        animationFrameId = requestAnimationFrame(render);
      };
      render();
    }
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [ctx]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="h-screen w-screen flex justify-center items-center"
    >
      <canvas ref={canvas} className="absolute top-0 left-0 w-screen h-screen" />
      {children}
    </motion.div>
  );
};
