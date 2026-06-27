import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightCode = (codeText: string) => {
    let escaped = codeText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return escaped
      .replace(/(\/\/.*?$)(?![^<]*>)/gm, '<span style="color:#64748b; font-style:italic">$1</span>')
      .replace(/(&quot;.*?&quot;|&#39;.*?&#39;|".*?"|'.*?'|`.*?`)(?![^<]*>)/g, '<span style="color:#ecc48d">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|from|class|extends|new)\b(?![^<]*>)/g, '<span style="color:#c792ea">$1</span>')
      .replace(/([{}[\]()])(?![^<]*>)/g, '<span style="color:#82aaff">$1</span>')
      .replace(/\b(\d+)\b(?![^<]*>)/g, '<span style="color:#c792ea">$1</span>');
  };

  return (
    <div className="mt-3 rounded-[10px] overflow-hidden bg-[#000000] font-mono">
      <div className="flex items-center justify-between px-4 py-2 bg-[#09090b] text-[12px] text-[#a1a1aa]">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-[#71717a] hover:text-[#e2e8f0] cursor-pointer transition-colors"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-[13px] leading-[1.5] text-[#d6deeb]">
        <pre className="font-mono m-0">
          <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
        </pre>
      </div>
    </div>
  );
}
