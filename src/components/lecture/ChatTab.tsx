import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '@/services/api';
import type { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';

interface ChatTabProps {
  lectureId: string;
  onTimestampClick: (time: number) => void;
}

function parseTimestamps(text: string, onClick: (t: number) => void) {
  const parts = text.split(/(\[\d{2}:\d{2}\])/g);
  return parts.map((part, i) => {
    const match = part.match(/\[(\d{2}):(\d{2})\]/);
    if (match) {
      const seconds = parseInt(match[1]) * 60 + parseInt(match[2]);
      return (
        <button key={i} className="font-mono text-primary hover:underline" onClick={() => onClick(seconds)}>
          {part}
        </button>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatTab({ lectureId, onTimestampClick }: ChatTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: 'Hi! I\'m your AI study assistant. Ask me anything about this lecture.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { id: String(Date.now()), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(lectureId, userMsg.content);
      // Simulate streaming
      setStreamingText('');
      for (let i = 0; i <= response.length; i++) {
        await new Promise(r => setTimeout(r, 15));
        setStreamingText(response.slice(0, i));
      }
      setMessages(prev => [...prev, { id: String(Date.now()), role: 'assistant', content: response }]);
      setStreamingText('');
    } catch {
      setMessages(prev => [...prev, { id: String(Date.now()), role: 'assistant', content: 'Sorry, something went wrong.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col" style={{ height: '60vh' }}>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'bg-muted text-foreground rounded-bl-md'
            }`}>
              {msg.role === 'assistant' ? parseTimestamps(msg.content, onTimestampClick) : msg.content}
            </div>
          </div>
        ))}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm">
              {parseTimestamps(streamingText, onTimestampClick)}
              <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-0.5" />
            </div>
          </div>
        )}
        {loading && !streamingText && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t border-border p-3">
        <Input
          placeholder="Ask about this lecture..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <Button size="icon" onClick={handleSend} disabled={!input.trim() || loading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
