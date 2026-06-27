/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  MessageSquare,
  Globe,
  ArrowUp,
  ArrowDown,
  Menu,
  X,
  File,
  Search,
  Lightbulb,
  Settings,
  Archive,
  Trash2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  Zap,
  Rocket,
  Code2,
  Cpu,
  Wrench,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message } from "./types";
import { ChatMessage } from "./components/ChatMessage";
import { ZirconAvatar } from "./components/ZirconAvatar";
import { LandingPage } from "./components/LandingPage";
import { SplashScreen } from "./components/SplashScreen";

const INITIAL_MESSAGES: Message[] = [];

type ChatHistoryItem = {
  id: string;
  title: string;
  messages: Message[];
};

interface ModelInfo {
  id: string;
  name: string;
  shortName: string;
  color: string;
  logoBg: string;
  textColor: string;
  isUnlimited: boolean;
}

const MODELS_LIST: ModelInfo[] = [
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    shortName: "Gemini 2.5 Flash",
    color: "from-blue-500 to-indigo-500",
    logoBg: "bg-blue-600",
    textColor: "text-blue-400",
    isUnlimited: true
  },
  {
    id: "qwen/qwen-2.5-coder-32b-instruct",
    name: "Qwen 3 Coder",
    shortName: "Qwen 3 Coder",
    color: "from-purple-500 to-pink-500",
    logoBg: "bg-purple-600",
    textColor: "text-purple-400",
    isUnlimited: true
  },
  {
    id: "google/gemma-2-27b-it",
    name: "Gemma 4 26B A4B",
    shortName: "Gemma 4 26B A4B",
    color: "from-teal-500 to-emerald-500",
    logoBg: "bg-teal-600",
    textColor: "text-teal-400",
    isUnlimited: true
  },
  {
    id: "nvidia/llama-3.1-nemotron-70b-instruct",
    name: "Nemotron 3 Ultra",
    shortName: "Nemotron 3 Ultra",
    color: "from-green-500 to-lime-600",
    logoBg: "bg-green-600",
    textColor: "text-green-400",
    isUnlimited: true
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    shortName: "DeepSeek V3",
    color: "from-blue-600 to-cyan-500",
    logoBg: "bg-blue-700",
    textColor: "text-blue-400",
    isUnlimited: false
  }
];

const ModelLogo = ({ id, size = "sm" }: { id: string; size?: "sm" | "md" | "lg" }) => {
  const dimensions = size === "sm" ? "w-5 h-5" : size === "md" ? "w-6 h-6" : "w-8 h-8";
  
  let src = "";
  if (id === "google/gemini-2.5-flash") {
    src = "/gemini.jpg";
  } else if (id === "qwen/qwen-2.5-coder-32b-instruct") {
    src = "/qwen.jpg";
  } else if (id === "google/gemma-2-27b-it") {
    src = "/gemma.jpg";
  } else if (id === "nvidia/llama-3.1-nemotron-70b-instruct") {
    src = "/nemotron.jpg";
  } else if (id === "deepseek/deepseek-chat") {
    src = "/deepseek.jpg";
  }

  if (src) {
    return (
      <img
        src={src}
        alt={`${id} logo`}
        referrerPolicy="no-referrer"
        className={`${dimensions} rounded-lg object-cover shadow-sm shrink-0 border border-white/10`}
      />
    );
  }

  // Custom fallback
  const iconSize = size === "sm" ? 11 : size === "md" ? 14 : 18;
  return (
    <div className={`${dimensions} rounded-lg bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center font-bold text-white shadow-sm shrink-0 border border-white/10`}>
      <Wrench size={iconSize} className="text-white" />
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );

  const headerModelDropdownRef = useRef<HTMLDivElement>(null);
  const [headerModelOpen, setHeaderModelOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerModelDropdownRef.current && !headerModelDropdownRef.current.contains(event.target as Node)) {
        setHeaderModelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'chat' | 'training'>('main');

  // Temporary training form states
  const [tempUserName, setTempUserName] = useState("");
  const [tempAiStyle, setTempAiStyle] = useState<'professional' | 'casual' | 'technical' | 'concise'>("professional");
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [tempCustomContext, setTempCustomContext] = useState("");
  const [tempSelectedModel, setTempSelectedModel] = useState("google/gemini-2.5-flash");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [archivedChats, setArchivedChats] = useState<ChatHistoryItem[]>([]);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // User AI personalization profile states
  const [aiTrainingProfile, setAiTrainingProfile] = useState<{
    userName: string;
    aiStyle: 'professional' | 'casual' | 'technical' | 'concise';
    customContext: string;
    selectedModel?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem("ai_training_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedModel === "cognitivecomputations/dolphin-mixtral-8x22b") {
          parsed.selectedModel = "deepseek/deepseek-chat";
          localStorage.setItem("ai_training_profile", JSON.stringify(parsed));
        }
        return parsed;
      }
      return { userName: "", aiStyle: "professional", customContext: "", selectedModel: "google/gemini-2.5-flash" };
    } catch (e) {
      return { userName: "", aiStyle: "professional", customContext: "", selectedModel: "google/gemini-2.5-flash" };
    }
  });

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isGeneratingRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("chats");
    const savedArchived = localStorage.getItem("archived_chats");
    if (saved) {
      const parsed = JSON.parse(saved);
      setChatHistory(parsed);
    }
    if (savedArchived) {
      const parsedArchived = JSON.parse(savedArchived);
      setArchivedChats(parsedArchived);
    }
    setActiveChatId(Date.now().toString());
    setMessages([]);
  }, []);

  useEffect(() => {
    if (messages.length > 0 && activeChatId) {
      const timeoutId = setTimeout(() => {
        const title =
          messages[0].content.slice(0, 30) +
          (messages[0].content.length > 30 ? "..." : "");

        // Strip heavy base64 data to avoid localStorage 5MB quota errors
        const cleanMessages = messages.map(m => {
          if (m.file && m.file.data) {
            const { data, ...fileWithoutData } = m.file;
            return { ...m, file: fileWithoutData };
          }
          return m;
        });

        setChatHistory((prev) => {
          const existing = prev.find((c) => c.id === activeChatId);
          let updated;
          if (existing) {
            updated = prev.map((c) =>
              c.id === activeChatId ? { ...c, title, messages: cleanMessages } : c,
            );
          } else {
            updated = [{ id: activeChatId, title, messages: cleanMessages }, ...prev];
          }
          localStorage.setItem("chats", JSON.stringify(updated));
          return updated;
        });
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, activeChatId]);

  const stopTyping = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setIsTyping(false);
  };

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isSettingsOpen) {
      setTempUserName(aiTrainingProfile.userName || "");
      setTempAiStyle(aiTrainingProfile.aiStyle || "professional");
      setTempCustomContext(aiTrainingProfile.customContext || "");
      setTempSelectedModel(aiTrainingProfile.selectedModel || "google/gemini-2.5-flash");
    }
  }, [isSettingsOpen, aiTrainingProfile]);

  const handleSaveTrainingProfile = () => {
    const updatedProfile = {
      userName: tempUserName,
      aiStyle: tempAiStyle,
      customContext: tempCustomContext,
      selectedModel: tempSelectedModel
    };
    setAiTrainingProfile(updatedProfile);
    localStorage.setItem("ai_training_profile", JSON.stringify(updatedProfile));
    setSettingsView('main');
  };

  const handleSelectModelInHeader = (modelId: string) => {
    const updatedProfile = {
      ...aiTrainingProfile,
      selectedModel: modelId
    };
    setAiTrainingProfile(updatedProfile);
    localStorage.setItem("ai_training_profile", JSON.stringify(updatedProfile));
    setTempSelectedModel(modelId);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const handleNewChat = () => {
    stopTyping();
    setActiveChatId(Date.now().toString());
    setMessages([]);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleSelectChat = (id: string) => {
    stopTyping();
    const chat = chatHistory.find((c) => c.id === id);
    if (chat) {
      setActiveChatId(id);
      setMessages(chat.messages);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }
  };

  const handleArchiveChats = () => {
    stopTyping();
    const updatedArchived = [...archivedChats, ...chatHistory];
    setArchivedChats(updatedArchived);
    localStorage.setItem("archived_chats", JSON.stringify(updatedArchived));
    setChatHistory([]);
    localStorage.removeItem("chats");
    setActiveChatId(Date.now().toString());
    setMessages([]);
    setIsSettingsOpen(false);
  };

  const handleDeleteChats = () => {
    stopTyping();
    setChatHistory([]);
    localStorage.removeItem("chats");
    setActiveChatId(Date.now().toString());
    setMessages([]);
    setIsSettingsOpen(false);
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: behavior,
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isScrolledUp = target.scrollHeight - target.scrollTop - target.clientHeight > 150;
    setShowScrollButton(isScrolledUp);
  };

  useEffect(() => {
    if (isTyping) {
      scrollToBottom("auto");
    } else {
      scrollToBottom("smooth");
    }
  }, [messages, isTyping]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if ((!inputValue.trim() && !attachedFile) || isTyping || isGeneratingRef.current) return;
    
    // Stop any existing typing interval
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    isGeneratingRef.current = true;

    let fileData;
    if (attachedFile) {
      let base64Data = "";
      try {
        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(attachedFile);
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(",")[1];
            resolve(base64);
          };
          reader.onerror = (err) => reject(err);
        });
      } catch (err) {
        console.error("Failed to read attached file as base64:", err);
      }

      fileData = {
        name: attachedFile.name,
        url: URL.createObjectURL(attachedFile),
        data: base64Data,
        mimeType: attachedFile.type || "application/octet-stream"
      };
    }

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      file: fileData
    };

    const responseId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: responseId,
      role: "assistant",
      content: "",
      isTyping: true,
      thinkingContent: isThinkingMode ? "Thinking..." : undefined,
    };

    const newMessages = [...messages, newUserMsg];
    // Set both user and assistant messages in a single atomic update!
    setMessages([...newMessages, assistantMsg]);
    
    setInputValue("");
    setAttachedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages, 
          isSearchMode, 
          isThinkingMode,
          aiTrainingProfile 
        }),
      });
      const data = await res.json();
      
      let fullResponse = data.text || "";
      let thinkingContent = undefined;

      if (data.error) {
        fullResponse = `Error: ${data.error}`;
      } else if (fullResponse) {
        const thinkMatch = fullResponse.match(/<think>([\s\S]*?)(?:<\/think>|$)/);
        if (thinkMatch) {
          thinkingContent = thinkMatch[1].trim();
          fullResponse = fullResponse.replace(/<think>[\s\S]*?(?:<\/think>|$)/, '').trim();
        }
      }

      fullResponse = fullResponse || "Sorry, Zircon did not receive a response from the server.";

      let i = 0;
      // High-performance dynamic step size to prevent React render lag on large responses/code blocks.
      const step = Math.max(8, Math.ceil(fullResponse.length / 80));

      const typeInterval = setInterval(() => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === responseId) {
              return {
                ...msg,
                content: fullResponse.slice(0, i + step),
                thinkingContent: thinkingContent,
              };
            }
            return msg;
          }),
        );
        i += step;
        if (i >= fullResponse.length) {
          clearInterval(typeInterval);
          typingIntervalRef.current = null;
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id === responseId) {
                return { ...msg, content: fullResponse, thinkingContent: thinkingContent || msg.thinkingContent, sources: data.sources || [], isTyping: false };
              }
              return msg;
            }),
          );
          setIsTyping(false);
          isGeneratingRef.current = false;
        }
      }, 25);
      typingIntervalRef.current = typeInterval;
    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === responseId) {
            return { ...msg, content: "An error occurred while connecting to the server.", isTyping: false };
          }
          return msg;
        }),
      );
      setIsTyping(false);
      isGeneratingRef.current = false;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (showLandingPage) {
    return <LandingPage onEnter={() => setShowLandingPage(false)} />;
  }

  return (
    <div className="flex h-[100dvh] w-full bg-[#000000] text-[#e2e8f0] overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed md:static inset-y-0 left-0 z-[9999] w-[320px] h-full bg-[#09090b] flex flex-col p-3"
          >
            <div className="px-3 py-2 mb-2">
              <span className="text-xl font-bold text-[#f8fafc] tracking-tight flex items-center gap-2">
                Zircon
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto pb-24">
              {chatHistory.length > 0 && (
                <>
                  <div className="text-[11px] text-[#71717a] uppercase tracking-[1px] mb-3 px-3">
                    Recent Chats
                  </div>
                  <div className="space-y-1">
                    {chatHistory.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectChat(item.id)}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2 text-[13px] rounded-lg transition-colors truncate cursor-pointer ${item.id === activeChatId ? "bg-[#18181b] text-[#f8fafc] font-medium" : "text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#f8fafc]"}`}
                      >
                        <span className="truncate">{item.title}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Floating New Chat Button */}
            <button
              onClick={handleNewChat}
              className="absolute bottom-6 left-6 flex justify-center items-center gap-2 px-4 bg-[#f8fafc] text-[#09090b] shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] h-[52px] rounded-full cursor-pointer hover:bg-[#e2e8f0] transition-transform hover:scale-105 z-40 font-medium"
            >
              <Plus size={20} />
              <span>New Chat</span>
            </button>

            {/* Floating Settings Button */}
            <button
              onClick={() => {
                setSettingsView('main');
                setIsSettingsOpen(true);
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
              className="absolute bottom-6 right-6 flex justify-center items-center bg-[#18181b] text-[#a1a1aa] shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] w-[52px] h-[52px] rounded-full cursor-pointer hover:text-[#f8fafc] hover:bg-[#27272a] transition-transform hover:scale-105 z-40"
            >
              <Settings size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative bg-[#000000]">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 bg-[#000000] sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-[#a1a1aa] hover:text-[#f8fafc] transition-all duration-200 rounded-full hover:bg-[#18181b] cursor-pointer"
            >
              <Menu size={20} />
            </button>

            {/* Model Dropdown Selector in Header */}
            <div ref={headerModelDropdownRef} className="relative">
              <button
                onClick={() => setHeaderModelOpen(!headerModelOpen)}
                className="flex items-center gap-2 bg-[#09090b] hover:bg-[#18181b]/50 rounded-full px-3 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.4)] text-sm text-[#f8fafc] transition-all duration-200 cursor-pointer focus:outline-none select-none max-w-[200px] sm:max-w-[250px]"
              >
                <ModelLogo id={aiTrainingProfile.selectedModel || "google/gemini-2.5-flash"} size="sm" />
                <span className="font-semibold text-xs text-[#e4e4e7] truncate">
                  {MODELS_LIST.find(m => m.id === aiTrainingProfile.selectedModel)?.shortName || "Model AI"}
                </span>
                <ChevronDown size={14} className={`text-[#71717a] transition-transform duration-200 shrink-0 ${headerModelOpen ? 'rotate-180' : ''}`} />
              </button>

               {headerModelOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-[#09090b] rounded-2xl overflow-hidden z-50 shadow-2xl flex flex-col">
                  <div className="px-3.5 py-2 bg-[#050507] text-[10px] font-bold text-[#71717a] uppercase tracking-wider">
                    Select AI Model
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto flex flex-col">
                    {MODELS_LIST.map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          handleSelectModelInHeader(model.id);
                          setHeaderModelOpen(false);
                        }}
                        className={`px-3.5 py-3 text-left hover:bg-[#18181b] transition-all flex items-center gap-3 w-full group cursor-pointer ${aiTrainingProfile.selectedModel === model.id ? 'bg-[#18181b]/30' : ''}`}
                      >
                        <ModelLogo id={model.id} size="sm" />
                        <div className="flex-1 min-w-0 flex items-center justify-between">
                          <span className={`text-xs font-semibold truncate ${aiTrainingProfile.selectedModel === model.id ? 'text-[#f59e0b]' : 'text-[#f8fafc] group-hover:text-white'}`}>
                            {model.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto pt-6 pb-48 flex flex-col"
        >
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 select-none">
              <div className="mb-6">
                <ZirconAvatar size="lg" />
              </div>
              <h1 className="text-[22px] font-semibold text-[#f8fafc] mb-2">{getGreeting()}, {aiTrainingProfile.userName || "Guest"}</h1>
              <p className="text-[#a1a1aa] max-w-md text-[14px] leading-relaxed">
                I'm Zircon, your smart AI assistant. I support all languages fluently. Ask me anything about any topics, ideas, or coding.
              </p>
            </div>
          ) : (
            <div className="w-full mx-auto max-w-[768px] px-6 flex flex-col gap-8">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="fixed md:absolute bottom-4 sm:bottom-6 left-0 right-0 px-4 z-30 pointer-events-none">
          <div className="max-w-[768px] mx-auto relative pointer-events-auto">
            <AnimatePresence>
              {showScrollButton && (
                <motion.button
                  key="scroll-to-bottom"
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.8 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  onClick={() => scrollToBottom("smooth")}
                  className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 z-40 w-10 h-10 rounded-full flex items-center justify-center bg-[#09090b]/95 text-red-400 hover:text-white shadow-[0_0_12px_rgba(239,68,68,0.25)] hover:shadow-[0_0_18px_rgba(239,68,68,0.45)] transition-all duration-300 backdrop-blur-md cursor-pointer group active:scale-90"
                  title="Scroll to Bottom"
                >
                  <ArrowDown size={18} className="group-hover:translate-y-0.5 transition-transform duration-200" />
                </motion.button>
              )}
            </AnimatePresence>
            <div
              className={`bg-[#09090b]/85 backdrop-blur-md border rounded-[20px] p-3 sm:p-4 min-h-[100px] sm:min-h-[120px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-200 ${inputValue.trim() || isTyping ? "border-[#f59e0b] shadow-[0_0_0_1px_rgba(245,158,11,0.3)]" : "border-[#27272a] focus-within:border-[#f59e0b] focus-within:shadow-[0_0_0_1px_rgba(245,158,11,0.3)]"}`}
            >
              <div className="relative flex-1 mb-3 flex flex-col gap-2">
                {attachedFile && (
                  <div className="relative w-fit">
                    <div className="flex items-center gap-2 p-2 pr-8 bg-[#18181b] rounded-lg">
                      {attachedFile.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(attachedFile)} alt="preview" className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <File size={20} className="text-[#a1a1aa]" />
                      )}
                      <span className="text-[13px] text-[#f8fafc] max-w-[150px] truncate">{attachedFile.name}</span>
                    </div>
                    <button
                      onClick={() => setAttachedFile(null)}
                      className="absolute -top-2 -right-2 bg-[#27272a] text-[#f8fafc] rounded-full p-1 hover:bg-[#3f3f46] cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <div className="relative w-full">
                  {!inputValue && (
                    <div className="absolute inset-0 pointer-events-none pt-1">
                      <span className="text-[#a1a1aa] text-[15px]">Ask anything about coding...</span>
                      <motion.span 
                        animate={{ opacity: [1, 0, 1] }} 
                        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} 
                        className="inline-block w-[1.5px] h-[1.1em] bg-[#a1a1aa] align-middle ml-[1px]"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAttachedFile(e.target.files[0]);
                      }
                      setIsAttachmentMenuOpen(false);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="hidden"
                  />
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none outline-none text-[#f8fafc] text-[15px] resize-none w-full h-full pt-1"
                    rows={1}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setIsAttachmentMenuOpen(!isAttachmentMenuOpen)
                      }
                      className={`text-[#a1a1aa] bg-[#18181b] rounded-full p-1.5 cursor-pointer flex items-center justify-center hover:text-[#e2e8f0] hover:bg-[#27272a] transition-all duration-300 ${isAttachmentMenuOpen ? "rotate-45" : ""}`}
                    >
                      <Plus size={16} strokeWidth={2.5} />
                    </button>

                    <AnimatePresence>
                      {isAttachmentMenuOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40 cursor-default"
                            onClick={() => setIsAttachmentMenuOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-0 mb-3 w-40 bg-[#18181b] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden p-1.5 z-50 flex flex-col gap-0.5"
                          >
                            <button 
                              onClick={() => {
                                fileInputRef.current?.click();
                                setIsAttachmentMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-[#a1a1aa] hover:text-[#f8fafc] hover:bg-[#27272a] rounded-lg transition-colors text-left cursor-pointer"
                            >
                              <File size={15} /> File
                            </button>
                            <button 
                              onClick={() => {
                                setIsSearchMode(!isSearchMode);
                                setIsAttachmentMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-[13px] rounded-lg transition-colors text-left cursor-pointer ${isSearchMode ? 'text-[#f59e0b] bg-[#f59e0b]/10' : 'text-[#a1a1aa] hover:text-[#f8fafc] hover:bg-[#27272a]'}`}
                            >
                              <Search size={15} /> Search {isSearchMode && '(On)'}
                            </button>
                            <button 
                              onClick={() => {
                                setIsThinkingMode(!isThinkingMode);
                                setIsAttachmentMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-[13px] rounded-lg transition-colors text-left cursor-pointer ${isThinkingMode ? 'text-[#f59e0b] bg-[#f59e0b]/10' : 'text-[#a1a1aa] hover:text-[#f8fafc] hover:bg-[#27272a]'}`}
                            >
                              <Lightbulb size={15} /> Thinking {isThinkingMode && '(On)'}
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={(!inputValue.trim() && !attachedFile) || isTyping}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    (inputValue.trim() || attachedFile) && !isTyping
                      ? "bg-[#f59e0b] text-[#000000] opacity-90 hover:opacity-100 cursor-pointer"
                      : "bg-[#f59e0b]/50 text-[#000000]/50 cursor-not-allowed"
                  }`}
                >
                  <ArrowUp size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#09090b] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  {settingsView !== 'main' && (
                    <button
                      onClick={() => setSettingsView('main')}
                      className="p-1 text-[#a1a1aa] hover:text-[#f8fafc] hover:bg-[#27272a] rounded-md transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  <h2 className="text-[17px] font-semibold text-[#f8fafc]">
                    {settingsView === 'main' ? 'Settings' : settingsView === 'chat' ? 'Chat Settings' : 'Personalization'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1 text-[#a1a1aa] hover:text-[#f8fafc] hover:bg-[#27272a] rounded-md transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-3 min-h-[220px] max-h-[80vh] overflow-y-auto">
                {settingsView === 'main' && (
                  <>
                    {/* Option 1: Chat Settings */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSettingsView('chat')}
                      className="w-full flex items-center justify-between p-3.5 bg-[#18181b] hover:bg-[#27272a] rounded-xl text-[#f8fafc] transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare size={18} className="text-[#a1a1aa] group-hover:text-[#f8fafc]" />
                        <span className="font-medium text-[14px]">Chat Settings</span>
                      </div>
                      <ChevronRight size={18} className="text-[#a1a1aa]" />
                    </motion.button>

                    {/* Option 2: Personalization */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setSettingsView('training');
                        setIsStyleDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-3.5 bg-[#18181b] hover:bg-[#27272a] rounded-xl text-[#f8fafc] transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles size={18} className="text-[#f59e0b] group-hover:text-[#f8fafc]" />
                        <span className="font-medium text-[14px]">Personalization</span>
                      </div>
                      <ChevronRight size={18} className="text-[#a1a1aa]" />
                    </motion.button>
                  </>
                )}

                {settingsView === 'chat' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleArchiveChats}
                      className="w-full flex items-center gap-3 p-3 bg-[#18181b] hover:bg-[#27272a] rounded-xl text-[#f8fafc] transition-colors cursor-pointer"
                    >
                      <Archive size={18} className="text-[#a1a1aa]" />
                      <span className="font-medium text-[14px]">Archive All Chats</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleDeleteChats}
                      className="w-full flex items-center gap-3 p-3 bg-[#18181b] hover:bg-[#ef4444]/20 rounded-xl text-[#ef4444] transition-colors cursor-pointer"
                    >
                      <Trash2 size={18} />
                      <span className="font-medium text-[14px]">Clear Chat History</span>
                    </motion.button>
                  </>
                )}

                {settingsView === 'training' && (
                  <div className="flex flex-col gap-4 text-left">
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">
                      Train Zircon to customize its responses, conversational style, and preferences to your liking on this device.
                    </p>

                    {/* Field 1: Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#a1a1aa] uppercase tracking-wider">Your Name</label>
                      <input
                        type="text"
                        value={tempUserName}
                        onChange={(e) => setTempUserName(e.target.value)}
                        placeholder="e.g., John, Alice"
                        className="w-full bg-[#18181b] rounded-xl px-3.5 py-2.5 text-sm text-[#f8fafc] placeholder-[#52525b] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Field 2: AI Style */}
                    <div className="flex flex-col gap-1.5 relative">
                      <label className="text-[12px] font-semibold text-[#a1a1aa] uppercase tracking-wider">AI Response Style</label>
                      <button
                        type="button"
                        onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                        className="w-full bg-[#18181b] rounded-xl px-3.5 py-2.5 text-sm text-[#f8fafc] flex items-center justify-between transition-colors cursor-pointer text-left focus:outline-none"
                      >
                        <span>
                          {tempAiStyle === "professional" && "Polite & Professional"}
                          {tempAiStyle === "casual" && "Casual, Friendly & Close"}
                          {tempAiStyle === "technical" && "Technical, Detailed & Analytical"}
                          {tempAiStyle === "concise" && "Concise & Straight to the Point"}
                        </span>
                        <ChevronDown size={16} className={`text-[#a1a1aa] transition-transform duration-200 ${isStyleDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isStyleDropdownOpen && (
                        <div className="absolute top-[100%] left-0 right-0 mt-1.5 bg-[#0e0e11] rounded-xl overflow-hidden z-50 shadow-2xl flex flex-col">
                          <button
                            type="button"
                            onClick={() => {
                              setTempAiStyle("professional");
                              setIsStyleDropdownOpen(false);
                            }}
                            className={`px-4 py-2.5 text-sm text-left hover:bg-[#18181b] transition-colors cursor-pointer w-full ${tempAiStyle === 'professional' ? 'text-[#f59e0b] font-medium bg-[#18181b]/30' : 'text-[#a1a1aa]'}`}
                          >
                            Polite & Professional
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTempAiStyle("casual");
                              setIsStyleDropdownOpen(false);
                            }}
                            className={`px-4 py-2.5 text-sm text-left hover:bg-[#18181b] transition-colors cursor-pointer w-full ${tempAiStyle === 'casual' ? 'text-[#f59e0b] font-medium bg-[#18181b]/30' : 'text-[#a1a1aa]'}`}
                          >
                            Casual, Friendly & Close
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTempAiStyle("technical");
                              setIsStyleDropdownOpen(false);
                            }}
                            className={`px-4 py-2.5 text-sm text-left hover:bg-[#18181b] transition-colors cursor-pointer w-full ${tempAiStyle === 'technical' ? 'text-[#f59e0b] font-medium bg-[#18181b]/30' : 'text-[#a1a1aa]'}`}
                          >
                            Technical, Detailed & Analytical
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTempAiStyle("concise");
                              setIsStyleDropdownOpen(false);
                            }}
                            className={`px-4 py-2.5 text-sm text-left hover:bg-[#18181b] transition-colors cursor-pointer w-full ${tempAiStyle === 'concise' ? 'text-[#f59e0b] font-medium bg-[#18181b]/30' : 'text-[#a1a1aa]'}`}
                          >
                            Concise & Straight to the Point
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Field 3: Custom context */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#a1a1aa] uppercase tracking-wider">Custom Instructions & Context</label>
                      <textarea
                        value={tempCustomContext}
                        onChange={(e) => setTempCustomContext(e.target.value)}
                        placeholder="e.g., Explain React JS line-by-line. Use fruit metaphors for analogies."
                        rows={3}
                        className="w-full bg-[#18181b] rounded-xl px-3.5 py-2.5 text-sm text-[#f8fafc] placeholder-[#52525b] focus:outline-none transition-colors resize-none"
                      />
                    </div>



                    {/* Submit Row */}
                    <div className="flex items-center gap-2 pt-2 mt-1">
                      <button
                        onClick={() => {
                          handleSaveTrainingProfile();
                          setIsStyleDropdownOpen(false);
                          setIsModelDropdownOpen(false);
                        }}
                        className="flex-1 bg-[#f59e0b] text-black text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer text-center"
                      >
                        Save Profile
                      </button>
                      <button
                        onClick={() => {
                          setSettingsView('main');
                          setIsStyleDropdownOpen(false);
                          setIsModelDropdownOpen(false);
                        }}
                        className="flex-1 bg-zinc-900 text-zinc-400 text-sm font-semibold py-2.5 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-center"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
