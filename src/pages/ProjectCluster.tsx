import { useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Props = unknown;
// transition fades to black then back in

// type Coordinates = [number, number];

// interface ParticleConfig {
//   particleCount: number;
//   particleSizeRange: number;
//   particleColor: string | { variationProbability: number };
//   particleFadeRate: number;
//   shootingStarSizeRange: number;
//   shootingStarCount: number;
//   shootingStarVelocityRange: number;
//   shootingStarTrailMultiplier: number;
// }

export const ProjectCluster: React.FC<Props> = () => {
  const navigate = useNavigate();
  const canvas = useRef<HTMLCanvasElement>(null);
  // const projectClusterActionable = useRef<HTMLDivElement>(null);
  // const [projectClusterCoordinates, setProjectClusterCoordinates] = useState<Coordinates>([0, 0]);

  // const config: ParticleConfig = {
  //   particleCount: 2000,
  //   particleSizeRange: 1.4,
  //   particleColor: { variationProbability: 0.1 },
  //   // maintainParticles: when particles fade they may change colors
  //   particleFadeRate: 0.1,
  //   shootingStarSizeRange: 1.8,
  //   shootingStarCount: 5,
  //   shootingStarVelocityRange: 2,
  //   shootingStarTrailMultiplier: 6,
  // };

  // class Cluster {
  //   // discriminator? to determine x, y, color, size etc?
  //   x: number;
  //   y: number;
  //   color: string;
  //   size: number;
  //   pulseSize: number;
  //   pulseAlpha: number;

  //   constructor([x, y]: Coordinates, color: string | undefined) {
  //     //   this.x = x;
  //     //   this.y = y;
  //     this.x = 200;
  //     this.y = 600;
  //     this.size = 4;
  //     this.pulseSize = 0;
  //     this.pulseAlpha = 0.15;

  //     this.color = color ?? (config.particleColor as string);
  //   }
  //   draw() {
  //     if (ctx) {
  //       setProjectClusterCoordinates([this.x, this.y]);

  //       ctx.shadowBlur = 0;
  //       ctx.shadowColor = "transparent";

  //       // original
  //       ctx.beginPath();
  //       ctx.fillStyle = this.color;
  //       ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  //       ctx.closePath();
  //       ctx.fill();

  //       ctx.beginPath();
  //       ctx.fillStyle = adjustAlpha(hexToRGBA(this.color), this.pulseAlpha);
  //       ctx.arc(this.x, this.y, this.pulseSize, 0, Math.PI * 2);
  //       ctx.closePath();
  //       ctx.fill();
  //     }
  //   }
  //   update() {
  //     if (ctx) {
  //       document.onmousemove = (e) => {
  //         const [cx, cy] = [e.pageX, e.pageY];

  //         if (proximity([cx, cy], [this.x, this.y], 100)) {
  //           console.log("in range");
  //         }
  //       };

  //       if (this.pulseSize >= 10) {
  //         // if pulse size is less than 6, increase size and decrease alpha
  //         this.pulseSize += 0.1;
  //         this.pulseAlpha -= 0.007;

  //         if (this.pulseAlpha <= 0) {
  //           this.pulseSize = 0;
  //           this.pulseAlpha = 0.15;
  //         }
  //       } else {
  //         // increase size

  //         this.pulseSize += 0.1;
  //       }
  //     }

  //     //   if (ctx) {
  //     //     const [x, y] = nudgeCoordinates([this.x, this.y], 0.09);
  //     //     this.x = x;
  //     //     this.y = y;
  //     //     ctx.fillStyle = this.color;
  //     //     ctx.arc(x, y, this.size, 0, Math.PI * 2);
  //     //   }
  //   }
  // }

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
      {/* <div
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
      </div> */}
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
    </motion.div>
  );
};
