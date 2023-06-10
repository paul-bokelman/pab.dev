import { useState } from "react";
import { ParticleBackground } from "../components";
import { motion } from "framer-motion";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";

export const Landing: React.FC = () => {
  const [audio] = useState(new Audio("./space.mp3"));
  const [audioPlaying, setAudioPlaying] = useState(false);

  const handleToggleMusic = () => {
    if (audioPlaying) {
      audio.pause();
      return setAudioPlaying(false);
    }
    audio.play();
    setAudioPlaying(true);
  };

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
  //         this.pulseSize += 0.1;
  //         this.pulseAlpha -= 0.007;

  //         if (this.pulseAlpha <= 0) {
  //           this.pulseSize = 0;
  //           this.pulseAlpha = 0.15;
  //         }
  //       } else {
  //         this.pulseSize += 0.1;
  //       }
  //     }
  //   }
  // }

  //   <div
  //   ref={projectClusterActionable}
  //   style={{
  //     transformOrigin: "center",
  //     top: `${projectClusterCoordinates[1] - 15}px`,
  //     left: `${projectClusterCoordinates[0] - 20}px`,
  //   }}
  //   className="absolute flex items-center justify-center h-8 w-40 px-4 cursor-pointer z-10 group "
  //   onClick={handleProjectClusterActionableClick}
  // >
  //   <p className="relative left-4 text-white text-opacity-60 text-xs font-mono group-hover:text-[#CA8DFD] transition-color">
  //     Projects Cluster
  //   </p>
  // </div>
  // <div
  //   style={{ top: `${200}px`, left: `${400}px` }}
  //   className="absolute"
  //   onClick={handleProjectClusterActionableClick}
  // >
  //   <p className="relative -top-2 left-4 text-white text-opacity-60 text-xs font-mono">The Void</p>
  // </div>
  // <div
  //   style={{ top: `${650}px`, left: `${1000}px` }}
  //   className="absolute"
  //   onClick={handleProjectClusterActionableClick}
  // >
  //   <p className="relative -top-2 left-4 text-white text-opacity-60 text-xs font-mono">The Blog System</p>
  // </div>

  return (
    <ParticleBackground>
      <div className="flex items-center fixed top-0 w-full gap-2 p-4">
        <div onClick={handleToggleMusic} className="text-white text-opacity-40 text-2xl cursor-pointer">
          {audioPlaying ? <HiVolumeUp /> : <HiVolumeOff />}
        </div>
      </div>
      <div className="flex flex-col gap-2 w-1/3 justify-center items-center">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="text-white text-opacity-60 font-bold text-xl"
        >
          Paul A. Bokelman
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.3 }}
          className="text-white text-opacity-20 text-sm font-medium text-center"
        >
          Software engineer based in San Diego, CA. Committed to building the next generation of technology.
        </motion.p>
      </div>
    </ParticleBackground>
  );
};
