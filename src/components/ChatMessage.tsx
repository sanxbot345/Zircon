import React, { useState } from "react";
import { Bot, User as UserIcon, Lightbulb, ChevronDown, ChevronRight, File, Brain } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { motion, AnimatePresence } from "motion/react";
import { Message } from "../types";
import ReactMarkdown from "react-markdown";
import { ZirconAvatar } from "./ZirconAvatar";

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === "user";
  const [isThinkingOpen, setIsThinkingOpen] = useState(true);

  const parseContent = (content: string) => {
    if (!content && message.isTyping) {
      return (
        <div className="flex flex-col gap-3 py-1">
          <div className="flex items-center justify-center gap-1.5 bg-[#121214]/80 rounded-[100px] py-2 px-4 w-fit shadow-md">
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.75)]"
            />
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.15, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_5px_rgba(239,68,68,0.6)]"
            />
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.3, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-red-300 shadow-[0_0_5px_rgba(239,68,68,0.5)]"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="markdown-body">
        <ReactMarkdown
          components={{
            pre(props) {
              const children = props.children;
              if (React.isValidElement(children)) {
                const codeElement = children as any;
                const code = String(codeElement.props.children).replace(
                  /\n$/,
                  "",
                );
                const className = codeElement.props.className || "";
                const match = /language-(\w+)/.exec(className);
                return (
                  <CodeBlock
                    code={code}
                    language={match ? match[1] : "plaintext"}
                  />
                );
              }
              return <pre {...props} />;
            },
            code(props) {
              const { children, className, node, ...rest } = props;
              return (
                <code
                  {...rest}
                  className="bg-[#18181b] px-1.5 py-0.5 rounded-md text-[#f59e0b] font-mono text-[13px]"
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full gap-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mt-2">
          <ZirconAvatar size="sm" isTyping={message.isTyping} status={message.isTyping ? "thinking" : "idle"} />
        </div>
      )}
      <div
        className={`rounded-[20px] min-w-0 ${
          isUser
            ? "max-w-[85%] bg-[#27272a] text-[#f4f4f5] rounded-tr-[4px] px-5 py-3.5"
            : "flex-1 min-w-0 bg-transparent text-[#d4d4d8] px-1 py-3"
        }`}
      >
        {isUser && message.file && (
          <div className="mb-3 p-2 bg-[#18181b] rounded-xl flex items-center gap-3 w-fit">
            {message.file.url && message.file.url.startsWith('blob:') && message.file.name.match(/\.(jpeg|jpg|gif|png)$/i) ? (
              <img src={message.file.url} alt="Attachment" className="w-12 h-12 object-cover rounded-md" />
            ) : (
              <div className="w-10 h-10 bg-[#27272a] rounded-lg flex items-center justify-center">
                <File size={20} className="text-[#a1a1aa]" />
              </div>
            )}
            <div className="text-[13px] font-medium text-[#e2e8f0] truncate max-w-[150px]">
              {message.file.name}
            </div>
          </div>
        )}
        
        {!isUser && message.thinkingContent && (
          <div className="mb-4 flex flex-col gap-2">
            <button 
              onClick={() => setIsThinkingOpen(!isThinkingOpen)}
              className="w-fit flex items-center gap-2 px-3 py-1.5 bg-[#121214]/90 hover:bg-[#18181b] rounded-[100px] transition-all duration-200 cursor-pointer select-none text-left focus:outline-none shadow-sm"
            >
              <div className="relative flex items-center justify-center flex-shrink-0">
                <Brain size={12} className={`text-[#f59e0b] ${message.isTyping ? 'animate-pulse' : ''}`} />
                {message.isTyping && (
                  <span className="absolute inline-flex h-1.5 w-1.5 rounded-full bg-[#f59e0b] opacity-75 animate-ping" />
                )}
              </div>
              <span className="text-[10px] font-bold tracking-wider text-[#a1a1aa] uppercase">
                Proses Berpikir
              </span>
              {message.isTyping && (
                <span className="text-[9px] text-[#f59e0b] font-medium animate-pulse lowercase font-mono">
                  (berjalan...)
                </span>
              )}
              <div className="flex items-center gap-1 ml-1 pl-2">
                <ChevronDown 
                  size={11} 
                  className={`text-[#71717a] transition-transform duration-200 ${isThinkingOpen ? 'rotate-180' : ''}`} 
                />
              </div>
            </button>
            
            <AnimatePresence initial={false}>
              {isThinkingOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 p-3.5 bg-[#121214]/40 rounded-xl text-[#a1a1aa] whitespace-pre-wrap font-sans text-[12.5px] leading-relaxed tracking-wide font-light max-h-[200px] overflow-y-auto scrollbar-thin shadow-inner">
                    {message.thinkingContent}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="text-[15px] max-w-none break-words leading-[1.6]">
          {parseContent(message.content)}
        </div>

        {/* Render Grounding Sources when AI is done typing */}
        {!isUser && !message.isTyping && message.sources && message.sources.length > 0 && (
          <div className="mt-5 pt-3.5 flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Sumber Informasi:
            </div>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((src, index) => (
                <a
                  key={index}
                  href={src.uri}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#09090b] rounded-xl text-xs text-[#f59e0b] hover:text-[#fbbf24] transition-all cursor-pointer shadow-sm"
                >
                  <span className="w-4 h-4 bg-[#18181b] rounded flex items-center justify-center text-[10px] font-bold text-zinc-400">
                    {index + 1}
                  </span>
                  <span className="max-w-[200px] truncate font-medium">
                    {src.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
