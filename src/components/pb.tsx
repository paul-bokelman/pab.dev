import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import randomColor from "randomcolor";
import convert from "color-convert";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

type Coordinates = [number, number];

interface ParticleConfig {
  particleCount: number;
  particleSizeRange: number;
  particleColor: string | { variationProbability: number };
  particleFadeRate: number;
  shootingStarSizeRange: number;
  shootingStarCount: number;
  shootingStarVelocityRange: number;
  shootingStarTrailMultiplier: number;
}

export const ParticleBackground: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const canvas = useRef<HTMLCanvasElement>(null);
  const projectClusterActionable = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [{ w, h }, setDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [projectClusterCoordinates, setProjectClusterCoordinates] = useState<Coordinates>([0, 0]);
  const ctx = canvas.current?.getContext("2d");

  const config: ParticleConfig = {
    particleCount: 2000,
    particleSizeRange: 1.4,
    particleColor: { variationProbability: 0.1 },
    // maintainParticles: when particles fade they may change colors
    particleFadeRate: 0.1,
    shootingStarSizeRange: 1.8,
    shootingStarCount: 5,
    shootingStarVelocityRange: 2,
    shootingStarTrailMultiplier: 6,
  };

  const random = (min: number, max: number) => Math.random() * (max - min) + min;

  const nudgeCoordinates = (coordinates: Coordinates, range: number): Coordinates => {
    return coordinates.map((val): number => {
      return val + random(-range, range);
    }) as Coordinates;
  };

  const hexToRGBA = (hex: string) => {
    return `rgba(${[...convert.hex.rgb(hex), 1].join(", ")})`;
  };

  const adjustAlpha = (rgbaString: string, newAlpha: number | ((currentAlpha: number) => number)) => {
    const [r, g, b, a] = rgbaString.split("(")[1].split(")")[0].split(", ").map(Number);
    const alpha =
      typeof newAlpha === "function" ? (newAlpha(a) >= 1 ? 1 : newAlpha(a) <= 0 ? 0 : newAlpha(a)) : newAlpha;
    return `rgba(${[r, g, b, alpha].join(", ")})`;
  };

  function easeInOutSine(x: number): number {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }

  function easeInOutQuad(x: number): number {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  }

  const compileVelocity = (n: number) => {
    return { x: easeInOutQuad(random(-n, n)), y: easeInOutQuad(random(-n, n)) };
  };

  const proximity = (a: Coordinates, b: Coordinates, range: number) => {
    return Math.abs(a[0] - b[0]) < range && Math.abs(a[1] - b[1]) < range;
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
      this.color = color ?? (config.particleColor as string);
      this.alpha = easeInOutSine(random(0, 1));
      this.alphaIncreasing = false;

      this.velocity = compileVelocity(config.shootingStarVelocityRange);
    }
    draw() {
      if (ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
    }
    update() {
      if (ctx) {
        if (this.x > w || this.y > h || this.alpha <= 0) {
          this.x = random(0, w);
          this.y = random(0, h);
          this.velocity = compileVelocity(config.shootingStarVelocityRange);
          this.alpha = 0.001;
          this.size = random(0, config.shootingStarSizeRange);
        }

        const ls = {
          x: this.x,
          y: this.y,
        };

        if (this.alphaIncreasing) {
          this.alpha = parseFloat((this.alpha + easeInOutSine(random(0, config.particleFadeRate))).toFixed(3));
          if (this.alpha >= 1) this.alphaIncreasing = false;
        } else {
          this.alpha = parseFloat((this.alpha - easeInOutSine(random(0, config.particleFadeRate))).toFixed(3));
          if (this.alpha <= 0) this.alphaIncreasing = true;
        }
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

        this.color = adjustAlpha(this.color.includes("#") ? hexToRGBA(this.color) : this.color, this.alpha);

        ctx.fillStyle = this.color;

        ctx.shadowBlur = 10;
        ctx.shadowColor = adjustAlpha(this.color, 1);

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
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.size * 2;
        ctx.moveTo(
          ls.x - this.velocity.x * config.shootingStarTrailMultiplier,
          ls.y - this.velocity.y * config.shootingStarTrailMultiplier
        );
        ctx.lineTo(this.x, this.y);
        ctx.lineCap = "round";
        ctx.stroke();
      }
    }
  }

  class Particle {
    x: number;
    y: number;
    color: string;
    size: number;
    alpha: number;
    alphaIncreasing: boolean;

    constructor([x, y]: Coordinates, color: string | undefined) {
      this.x = x;
      this.y = y;
      this.size = random(0, config.particleSizeRange);
      this.color = color ?? (config.particleColor as string);
      this.alpha = easeInOutSine(random(0, 1));
      this.alphaIncreasing = false;
    }
    draw() {
      if (ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        ctx.closePath();
        ctx.fill();
      }
    }
    update() {
      if (ctx) {
        if (this.alpha === 0) {
          this.x = random(0, w);
          this.y = random(0, h);
        }
        const [x, y] = nudgeCoordinates([this.x, this.y], 0.09);
        this.x = x;
        this.y = y;

        if (this.alphaIncreasing) {
          this.alpha = parseFloat((this.alpha + easeInOutSine(random(0, config.particleFadeRate))).toFixed(3));
          if (this.alpha >= 1) this.alphaIncreasing = false;
        } else {
          this.alpha = parseFloat((this.alpha - easeInOutSine(random(0, config.particleFadeRate))).toFixed(3));
          if (this.alpha <= 0) this.alphaIncreasing = true;
        }

        this.color = adjustAlpha(this.color.includes("#") ? hexToRGBA(this.color) : this.color, this.alpha);

        // ctx.fillStyle = this.color;
        // ctx.arc(x, y, this.size, 0, Math.PI * 2);
      }
    }
  }

  class Cluster {
    // discriminator? to determine x, y, color, size etc?
    x: number;
    y: number;
    color: string;
    size: number;
    pulseSize: number;
    pulseAlpha: number;

    constructor([x, y]: Coordinates, color: string | undefined) {
      //   this.x = x;
      //   this.y = y;
      this.x = 200;
      this.y = 600;
      this.size = 4;
      this.pulseSize = 0;
      this.pulseAlpha = 0.15;

      this.color = color ?? (config.particleColor as string);
    }
    draw() {
      if (ctx) {
        setProjectClusterCoordinates([this.x, this.y]);

        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";

        // original
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = adjustAlpha(hexToRGBA(this.color), this.pulseAlpha);
        ctx.arc(this.x, this.y, this.pulseSize, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }
    update() {
      if (ctx) {
        document.onmousemove = (e) => {
          const [cx, cy] = [e.pageX, e.pageY];

          if (proximity([cx, cy], [this.x, this.y], 100)) {
            console.log("in range");
          }
        };

        if (this.pulseSize >= 10) {
          this.pulseSize += 0.1;
          this.pulseAlpha -= 0.007;

          if (this.pulseAlpha <= 0) {
            this.pulseSize = 0;
            this.pulseAlpha = 0.15;
          }
        } else {
          this.pulseSize += 0.1;
        }
      }
    }
  }

  function animationLoop(particles: Particle[], shootingStars: ShootingStar[], clusters: Cluster[]) {
    if (ctx) {
      ctx?.clearRect(0, 0, w, h);
      drawScene(particles, shootingStars, clusters);
      requestAnimationFrame(() => animationLoop(particles, shootingStars, clusters));
    }
  }

  function drawScene(particles: Particle[], shootingStars: ShootingStar[], clusters: Cluster[]) {
    for (const particle of [...shootingStars, ...particles, ...clusters]) {
      particle.update();
      particle.draw();
    }
  }

  const resizeReset = () => {
    const [w, h] = [window.innerWidth, window.innerHeight];
    canvas.current!.width = w;
    canvas.current!.height = h;
    setDimensions({ w, h });
    setParticles([]);

    const particles = [];
    const shootingStars = [];
    const clusters = [];

    for (const _ of Array.from({ length: config.particleCount })) {
      const coordinates: Coordinates = [random(0, w), random(0, h)];

      const color =
        typeof config.particleColor !== "string"
          ? config.particleColor.variationProbability * 10 >= random(0, 10)
            ? randomColor()
            : randomColor({ hue: "monochrome" })
          : undefined;

      const particle = new Particle(coordinates, color);
      particles.push(particle);
    }

    for (const _ of Array.from({ length: config.shootingStarCount })) {
      const coordinates: Coordinates = [random(0, w), random(0, h)];
      const shootingStar = new ShootingStar(coordinates, randomColor());
      shootingStars.push(shootingStar);
    }

    const cluster = new Cluster([random(0, w), random(0, h)], "#CA8DFD");

    clusters.push(cluster); // pushed to particles, should be pushed to its own array

    setParticles(particles);
    return { particles, shootingStars, clusters };
  };

  useEffect(() => {
    if (canvas.current) {
      const { particles, shootingStars, clusters } = resizeReset();
      animationLoop(particles, shootingStars, clusters);
    }
  }, [canvas.current]);

  useEffect(() => {
    window.addEventListener("resize", resizeReset);
    // window.addEventListener('mouseenter', onMouseUpdate, false);

    return () => {
      window.removeEventListener("resize", resizeReset);
    };
  }, []);

  const handleProjectClusterActionableClick = () => {
    navigate("/projects");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="h-screen w-screen flex justify-center items-center"
    >
      <div
        ref={projectClusterActionable}
        style={{
          transformOrigin: "center",
          top: `${projectClusterCoordinates[1] - 15}px`,
          left: `${projectClusterCoordinates[0] - 20}px`,
        }}
        className="absolute flex items-center justify-center h-8 w-40 px-4 cursor-pointer z-10 group "
        onClick={handleProjectClusterActionableClick}
      >
        <p className="relative left-4 text-white text-opacity-60 text-xs font-mono group-hover:text-[#CA8DFD] transition-color">
          Projects Cluster
        </p>
      </div>
      {/* <div
        style={{ top: `${projectClusterCoordinates[1]}px`, left: `${projectClusterCoordinates[0]}px` }}
        className="absolute"
        onClick={handleProjectClusterActionableClick}
      >
        <p className="relative -top-2 left-4 text-white text-opacity-60 text-xs font-mono">Projects Cluster</p>
      </div> */}
      <div
        style={{ top: `${200}px`, left: `${400}px` }}
        className="absolute"
        onClick={handleProjectClusterActionableClick}
      >
        <p className="relative -top-2 left-4 text-white text-opacity-60 text-xs font-mono">The Void</p>
      </div>
      <div
        style={{ top: `${650}px`, left: `${1000}px` }}
        className="absolute"
        onClick={handleProjectClusterActionableClick}
      >
        <p className="relative -top-2 left-4 text-white text-opacity-60 text-xs font-mono">The Blog System</p>
      </div>
      <canvas ref={canvas} className="absolute top-0 left-0 w-screen h-screen" />
      {children}
    </motion.div>
  );
};
