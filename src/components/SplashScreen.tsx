import React, { useEffect } from "react";
import { motion } from "motion/react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#09090b] text-[#f8fafc] flex flex-col items-center justify-center z-[9999] overflow-hidden select-none">
      {/* Sleek, subtle ambient radial gradient (non-cyberpunk, elegant & professional) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-800/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="flex flex-col items-center justify-center text-center z-10 px-6">
        
        {/* Elegant Logo Frame with Smooth Scale-up & Fade-in (Kecil membesar) */}
        <motion.div
          initial={{ scale: 0.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for a luxurious, fluid deceleration
          }}
          className="relative mb-6"
        >
          {/* Subtle elegant drop shadow aura */}
          <div className="absolute -inset-2 rounded-full bg-zinc-800/20 blur-xl pointer-events-none" />

          {/* Core Logo Image */}
          <div className="w-24 h-24 rounded-full p-[2px] bg-[#27272a] shadow-xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#18181b] flex items-center justify-center">
              <img
                src="/favicon.jpg"
                alt="Zircon Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </motion.div>

        {/* Brand Text with Delayed Fade-in */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-extrabold tracking-widest text-[#f8fafc] font-sans">
            ZIRCON
          </h1>
          <p className="text-xs text-zinc-500 tracking-[0.2em] uppercase font-medium">
            Personal AI Assistant
          </p>
        </motion.div>
      </div>
    </div>
  );
};
