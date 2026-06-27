import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Cpu, 
  Search, 
  Code, 
  Globe, 
  Settings 
} from "lucide-react";

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [activeTab, setActiveTab] = useState<"capabilities" | "models" | "about">("capabilities");

  const capabilities = [
    {
      icon: <Search className="text-zinc-300 w-5 h-5" />,
      title: "Integrated Web Search",
      desc: "Zircon browses the web in real-time to deliver accurate, relevant answers complete with credible sources."
    },
    {
      icon: <Code className="text-zinc-300 w-5 h-5" />,
      title: "Coding & Script Analysis",
      desc: "Write clean code, debug syntax errors, and receive production-ready refactoring recommendations in any programming language."
    },
    {
      icon: <Globe className="text-zinc-300 w-5 h-5" />,
      title: "Multilingual Comprehension",
      desc: "Translate languages, compose creative content, and draft professional documents with natural fluency."
    },
    {
      icon: <Settings className="text-zinc-300 w-5 h-5" />,
      title: "Custom Persona Profiles",
      desc: "Fine-tune Zircon's system instructions to tailor tone, formatting, and behavioral responses to your preferences."
    }
  ];

  const models = [
    {
      name: "Nemotron 3 Ultra",
      tech: "Llama 3.1 Nemotron 70B",
      desc: "Highly recommended for fluid interactive discussions and structured formatting tasks.",
      logo: "/nemotron.jpg"
    },
    {
      name: "Gemini 2.5 Flash",
      tech: "Google Gemini",
      desc: "Fast, creative, and highly intelligent general-purpose model for daily productivity.",
      logo: "/gemini.jpg"
    },
    {
      name: "DeepSeek V3",
      tech: "DeepSeek Chat",
      desc: "Excels in deep logical reasoning, mathematical solving, and structured technical tasks.",
      logo: "/deepseek.jpg"
    },
    {
      name: "Qwen 2.5 Coder",
      tech: "Qwen Coder 32B",
      desc: "Specialized coder model built for understanding code syntax and software architecture.",
      logo: "/qwen.jpg"
    },
    {
      name: "Gemma 2 27B",
      tech: "Gemma Instruct",
      desc: "A balanced, efficient instruction-following model for everyday queries.",
      logo: "/gemma.jpg"
    }
  ];

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  } as const;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col relative overflow-hidden font-sans">
      
      {/* Top Navigation Header wrapped in elegant fade animation */}
      <motion.header 
        initial="hidden"
        animate="visible"
        variants={fadeVariants}
        className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#18181b] flex items-center justify-center">
            <img
              src="/favicon.jpg"
              alt="Zircon Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-bold text-lg tracking-wider text-zinc-100">
            Zircon
          </span>
        </div>
        
        <div>
          <button
            onClick={onEnter}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            Open Assistant
          </button>
        </div>
      </motion.header>

      {/* Hero Section Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 text-center z-10 max-w-4xl mx-auto w-full">
        
        {/* Simple Label Banner wrapped in fade animation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeVariants}
          className="inline-flex items-center gap-2 bg-zinc-900/60 rounded-full px-4 py-1.5 mb-8"
        >
          <Sparkles size={12} className="text-zinc-400" />
          <span className="text-[11px] font-medium text-zinc-400 tracking-wider uppercase font-mono">Zircon Workspace v3.0</span>
        </motion.div>

        {/* Display Heading wrapped in fade animation */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.25] mb-6"
        >
          Find Trusted Answers.<br />
          Accelerate Your Workflow.
        </motion.h1>

        {/* Subtitle wrapped in fade animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed mb-10"
        >
          Zircon is a secure, personal cognitive assistant bringing together the world's leading intelligence models to help you learn, analyze data, write articles, and build software.
        </motion.p>

        {/* Action Button wrapped in fade animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16 w-full sm:w-auto"
        >
          <button
            onClick={onEnter}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg active:scale-[0.98]"
          >
            Start New Conversation
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform text-zinc-950" />
          </button>
        </motion.div>

        {/* Tabs and Interactive Content with fade anims and no borders */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-3xl pt-10"
        >
          {/* Navigation Tabs (Plain, Borderless) */}
          <div className="flex justify-center gap-2 mb-8 bg-zinc-950/60 p-1.5 rounded-lg max-w-sm mx-auto">
            <button
              onClick={() => setActiveTab("capabilities")}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "capabilities" 
                  ? "bg-zinc-900 text-white" 
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Capabilities
            </button>
            <button
              onClick={() => setActiveTab("models")}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "models" 
                  ? "bg-zinc-900 text-white" 
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Choice Models
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "about" 
                  ? "bg-zinc-900 text-white" 
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              About
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              {activeTab === "capabilities" && (
                <motion.div
                  key="capabilities-pane"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
                >
                  {capabilities.map((c, i) => (
                    <div 
                      key={i}
                      className="p-5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center mb-3">
                        {c.icon}
                      </div>
                      <h4 className="font-bold text-sm text-zinc-100 mb-1">{c.title}</h4>
                      <p className="text-zinc-400 text-xs leading-relaxed">{c.desc}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "models" && (
                <motion.div
                  key="models-pane"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
                >
                  {models.map((m, i) => (
                    <div 
                      key={i}
                      className="p-4 rounded-xl bg-zinc-900/40 flex items-start gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-950 shrink-0 flex items-center justify-center">
                        <img 
                          src={m.logo} 
                          alt={m.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/favicon.jpg";
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-zinc-100">{m.name}</h4>
                          <span className="text-[9px] px-1 py-0.2 bg-zinc-950 text-zinc-400 rounded">
                            {m.tech}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "about" && (
                <motion.div
                  key="about-pane"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="max-w-2xl mx-auto text-left p-6 rounded-xl bg-zinc-900/40 space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
                      <Shield className="text-zinc-400 w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-100 mb-1">Local Information Security</h4>
                      <p className="text-zinc-400 text-xs leading-relaxed">
                        We guarantee absolute data sovereignty. Zircon runs entirely within your browser's local sandbox, with zero central server logs or telemetry tracking.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
                      <Cpu className="text-zinc-400 w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-100 mb-1">Multi-Model Infrastructure</h4>
                      <p className="text-zinc-400 text-xs leading-relaxed">
                        Zircon aggregates modern API endpoints from global AI leaders like Google, NVIDIA, Alibaba, and DeepSeek, giving you maximum cognitive flexibility.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* Footer (Fade In, Borderless) */}
      <motion.footer 
        initial="hidden"
        animate="visible"
        variants={fadeVariants}
        className="w-full text-center py-8 text-zinc-600 text-xs z-10"
      >
        © {new Date().getFullYear()} Zircon Cloud. All Rights Reserved.
      </motion.footer>
    </div>
  );
};
