import React from "react";
import { motion } from "motion/react";

interface ZirconAvatarProps {
  size?: "sm" | "md" | "lg" | "xl" | "custom";
  isTyping?: boolean;
  status?: "idle" | "thinking" | "speaking" | "listening" | "connecting" | "muted";
  className?: string;
}

export const ZirconAvatar: React.FC<ZirconAvatarProps> = ({
  size = "md",
  isTyping = false,
  status = "idle",
  className = "",
}) => {
  // Map sizes to Tailwind dimensions
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-28 h-28 md:w-32 md:h-32",
    custom: "",
  };

  const ringColors: Record<string, string> = {
    idle: "border-zinc-800",
    connecting: "border-zinc-700 animate-pulse",
    muted: "border-zinc-800",
    thinking: "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    speaking: "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
    listening: "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
  };
  const ringColor = ringColors[status] || "border-zinc-800";

  // Blinking animation for eyes (mata terbuka tutup / open-close eyes)
  // Animate scaleY from 1 (fully open) to 0.05 (fully closed/blink) to 1 (fully open)
  const blinkAnimation: any = {
    scaleY: [1, 1, 0.05, 1, 1, 1, 0.05, 1, 1], // natural occasional blinks
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatDelay: 1, // pauses between blink sequence
      ease: "easeInOut",
    }
  };

  const isExpressive = isTyping || status === "speaking" || status === "thinking";

  // Calculate eye dynamic sizes based on size tier
  const getEyeSize = () => {
    if (size === "xl") return "w-3.5 h-3.5";
    if (size === "lg") return "w-2.5 h-2.5";
    if (size === "sm") return "w-1.5 h-1.5";
    return "w-2 h-2"; // md / custom
  };

  return (
    <div 
      id="zircon-avatar"
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#121214] to-[#040405] border ${ringColor} ${sizeClasses[size]} shadow-lg overflow-hidden group transition-all duration-300 ${className}`}
    >
      {/* High-tech background subtle glowing gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.15),transparent_75%)]" />
      
      {/* Outer rotating dashed tech HUD ring for processing/thinking states */}
      {isExpressive && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-1 border border-dashed border-red-500/30 rounded-full"
        />
      )}

      {/* Cybernetic Outer Frame Line */}
      <div className="absolute inset-[3px] rounded-full border border-zinc-800/40 pointer-events-none" />

      {/* Futuristic Face Plate */}
      <div className="relative flex flex-col items-center justify-center w-5/6 h-5/6 rounded-full bg-[#09090b]/95 border border-[#1e1e21]/80 z-10 shadow-inner">
        
        {/* Holographic grid scan lines backplate */}
        <div className="absolute inset-1.5 bg-[linear-gradient(rgba(239,68,68,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.025)_1px,transparent_1px)] bg-[size:4px_4px] rounded-full opacity-70 pointer-events-none" />

        {/* Futuristic Laser Beam Line going through both eyes */}
        <motion.div
          animate={{
            opacity: [0.4, 0.9, 0.4, 0.8, 0.4],
            scaleY: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute left-0 right-0 h-[1.2px] bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.95)] z-15 pointer-events-none"
          style={{ top: "43%" }}
        />

        {/* Eyes Container (Expressive Glowing LED Eyes) */}
        <div className="relative flex items-center justify-center gap-2.5 md:gap-3.5 z-20">
          {/* Left Eye */}
          <div className="relative">
            <motion.div
              animate={blinkAnimation}
              style={{ transformOrigin: "center" }}
              className={`${getEyeSize()} rounded-full bg-gradient-to-b from-red-400 to-red-600 shadow-[0_0_12px_rgba(239,68,68,0.95)]`}
            />
            {/* Focal laser flare dot in center of pupil */}
            <div className="absolute inset-0 m-auto w-0.5 h-0.5 bg-white rounded-full opacity-90 shadow-[0_0_4px_#fff]" />
          </div>
          
          {/* Right Eye */}
          <div className="relative">
            <motion.div
              animate={blinkAnimation}
              style={{ transformOrigin: "center" }}
              className={`${getEyeSize()} rounded-full bg-gradient-to-b from-red-400 to-red-600 shadow-[0_0_12px_rgba(239,68,68,0.95)]`}
            />
            {/* Focal laser flare dot in center of pupil */}
            <div className="absolute inset-0 m-auto w-0.5 h-0.5 bg-white rounded-full opacity-90 shadow-[0_0_4px_#fff]" />
          </div>
        </div>

        {/* Dynamic Voice/Thinking Visualizer Mouth Plate or Smile */}
        {status === "speaking" || isTyping ? (
          <div className="absolute bottom-2.5 md:bottom-4 flex items-center justify-center gap-0.5 h-3 z-20">
            <motion.div
              animate={{ height: [2, 7, 2] }}
              transition={{ duration: 0.45, repeat: Infinity, delay: 0 }}
              className="w-[2px] bg-red-500 rounded-full"
            />
            <motion.div
              animate={{ height: [2, 12, 2] }}
              transition={{ duration: 0.35, repeat: Infinity, delay: 0.12 }}
              className="w-[2px] bg-red-400 rounded-full"
            />
            <motion.div
              animate={{ height: [2, 8, 2] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: 0.25 }}
              className="w-[2px] bg-red-300 rounded-full"
            />
            <motion.div
              animate={{ height: [2, 12, 2] }}
              transition={{ duration: 0.35, repeat: Infinity, delay: 0.08 }}
              className="w-[2px] bg-red-400 rounded-full"
            />
            <motion.div
              animate={{ height: [2, 7, 2] }}
              transition={{ duration: 0.45, repeat: Infinity, delay: 0.3 }}
              className="w-[2px] bg-red-500 rounded-full"
            />
          </div>
        ) : status === "thinking" ? (
          <div className="absolute bottom-2 md:bottom-3 flex flex-col items-center z-20">
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-[7.5px] text-red-500 font-mono tracking-widest font-bold mb-1"
            >
              THINK
            </motion.div>
            {/* Cybernetic smiling mouth */}
            <div className="w-4 h-2 flex items-center justify-center overflow-hidden">
              <div className="w-4 h-4 border-b-[1.5px] border-red-500/90 rounded-full shadow-[0_1px_3px_rgba(239,68,68,0.5)]" style={{ marginTop: "-10px" }} />
            </div>
          </div>
        ) : (
          /* Smiling cybernetic mouth for standby/idle state */
          <div className="absolute bottom-3 md:bottom-3.5 w-5 h-2.5 flex items-center justify-center overflow-hidden z-20">
            <div className="w-4.5 h-4 border-b-[1.5px] border-red-500/80 rounded-full shadow-[0_1px_3px_rgba(239,68,68,0.4)]" style={{ marginTop: "-9px" }} />
          </div>
        )}
      </div>

      {/* Micro tech glowing frame reflection */}
      <div className="absolute inset-0 border border-red-500/5 rounded-full pointer-events-none group-hover:border-red-500/15 transition-all duration-300" />
    </div>
  );
};
