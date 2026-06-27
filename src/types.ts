export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
  file?: {
    name: string;
    url?: string;
    data?: string; // base64 representation of the file
    mimeType?: string; // mime type of the file
  };
  thinkingContent?: string;
  sources?: Array<{ title: string; uri: string }>;
}
