import { useState } from "react";
import { ParticleBackground, CartoonArrowIcon, BlackHoleIcon } from "../components";
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

  return (
    <ParticleBackground>
      <div className="flex items-center fixed top-0 w-full gap-2 p-4 z-50">
        <div onClick={handleToggleMusic} className="text-[#AFAFFF40] text-2xl cursor-pointer z-50">
          {audioPlaying ? <HiVolumeUp /> : <HiVolumeOff />}
        </div>
      </div>
      <div className="flex flex-col gap-1 justify-center items-start z-50">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="font-itim text-[25px] text-transparent bg-clip-text bg-gradient-to-r from-[#AFAFFF40] via-[#AFAFFF] via-50% to-[#AFAFFF40]"
        >
          Paul A. Bokelman
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.3 }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#AFAFFF40] via-[#AFAFFF] via-90% to-[#AFAFFF40] text-sm font-medium"
        >
          Abusing software, creatively.
        </motion.p>
        {/* <div className="flex items-center gap-2 mt-2">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 4, delay: 2.5 }}
            className="cursor-pointer text-[#AFAFFF]/40 hover:text-[#AFAFFF] hover:underline transition-all text-sm"
          >
            projects
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 4, delay: 3 }}
            className="cursor-pointer text-[#AFAFFF]/40 hover:text-[#AFAFFF] hover:underline transition-all text-sm"
          >
            blog
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 4, delay: 3.5 }}
            className="cursor-pointer text-[#AFAFFF]/40 hover:text-[#AFAFFF] hover:underline transition-all text-sm"
          >
            github
          </motion.span>
        </div> */}
      </div>
      <div className="absolute w-screen h-screen">
        <div className="relative top-[32rem] left-[12rem]">
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2, delay: 2.5 }}
            className="relative -top-2"
          >
            <div className="absolute h-1.5 w-1.5 rounded-full bg-[#90C567]" />
            <div className="absolute -left-[2px] -top-[2px] h-2.5 w-2.5 rounded-full bg-[#90C567]/20" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2, delay: 3 }}
            className="relative"
          >
            <CartoonArrowIcon color="#90C567" className="relative left-3 w-6 h-6" />
            <span className="relative font-itim text-[#90C567] left-12 -top-5">projects</span>
          </motion.div>
        </div>

        <div className="relative top-[8rem] left-[68rem]">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2, delay: 3 }}
          >
            <motion.div
              animate={{ rotate: 20 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="relative w-12 h-12 top-8 -left-2"
            >
              <BlackHoleIcon className="h-full w-full opacity-80" />
            </motion.div>
          </motion.div>
          {/* <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2, delay: 2.5 }}
            className="relative"
          >
            <div className="absolute h-1.5 w-1.5 rounded-full bg-[#389CD4]" />
            <div className="absolute -left-[2px] -top-[2px] h-2.5 w-2.5 rounded-full bg-[#389CD4]/20" />
          </motion.div> */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2, delay: 3 }}
            className="relative"
          >
            <CartoonArrowIcon color="#B289FF" className="transform rotate-180 relative -left-8 -top-7 w-6 h-6" />
            <span className="relative font-itim text-[#B289FF] -left-[4.5rem] -top-[3.8rem]">blog</span>
          </motion.div>
        </div>
      </div>
    </ParticleBackground>
  );
};
