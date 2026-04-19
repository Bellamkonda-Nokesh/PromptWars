'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, Bot, RefreshCw } from 'lucide-react';
import { ChatMessage, INITIAL_BOT_MESSAGE, FLOWBOT_SUGGESTIONS, MOCK_QUEUES } from '@/lib/data';

const GEMINI_RESPONSES: Record<string, string> = {
  seat: `📍 Your seat is in **North Stand, Row H, Seat 24**.

To get there from Gate A:
1. Enter through Gate A
2. Follow signs for **North Stand**
3. Take the stairwell up to **Level 2**
4. Row H is the 8th row from the front
5. Seat 24 is near the center — great view! 🎉

Estimated walk time from the main entrance: **~4 minutes**`,

  queue: `🍔 Here are the **fastest food options** right now:

| Stand | Wait | Type |
|-------|------|------|
| 🟢 **Snack Zone C3** | 2 min | Snacks |
| 🟢 **Stadium Grill A1** | 4 min | Hot Food |
| 🟡 **Fan Fare D4** | 9 min | Food |
| 🔴 **Brew House B2** | 18 min | Drinks |

💡 Since you prefer **vegetarian**, I recommend **Snack Zone C3** — they have nachos and veggie wraps, and the wait is only 2 minutes!`,

  restroom: `🚻 **Nearest restrooms** to your seat (North Stand, Row H):

- **Restroom 2N** — Level 2, North corridor — **< 1 min walk**
- **Restroom 1N** — Level 1, near Gate A — **2 min walk**

⚡ Pro tip: The Level 2 one has **shorter queues** — just checked the sensors!`,

  exit: `🚪 **Emergency exits** near your location:

- **Exit N1** — North Stand, Level 2 East — closest
- **Exit N2** — North Stand, Level 1 Gate A — main exit
- **Exit W3** — West Wing stairwell

In an emergency, follow the **green overhead signs** and staff instructions. Please stay calm and don't rush.`,

  points: `⭐ **Your Loyalty Status:**

- **Tier:** 🥇 Gold
- **Points:** 2,840
- **Next Tier:** Platinum (only 160 more!)

Available rewards you can redeem now:
- 🥤 Free Soft Drink (200 pts)
- 🌮 Nachos Upgrade (350 pts)
- 🧣 Team Scarf (800 pts)

Want to redeem anything?`,

  leave: `⏱️ **Best time to leave** analysis:

Current match: 71st minute (2-1 City FC)

**My recommendation:**
- ✅ **Stay until final whistle** — you're in a great seat!
- If you need to beat traffic, leave **85th minute**

**Traffic prediction:**
- Leave at 90 min → ~35 min to clear parking
- Leave at 85 min → ~15 min to clear parking
- Best parking exit: **P3 North** (less congested right now)`,
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('seat') || lower.includes('where')) return GEMINI_RESPONSES.seat;
  if (lower.includes('queue') || lower.includes('food') || lower.includes('eat') || lower.includes('hungry')) return GEMINI_RESPONSES.queue;
  if (lower.includes('restroom') || lower.includes('bathroom') || lower.includes('toilet')) return GEMINI_RESPONSES.restroom;
  if (lower.includes('exit') || lower.includes('emergency') || lower.includes('escape')) return GEMINI_RESPONSES.exit;
  if (lower.includes('points') || lower.includes('loyalty') || lower.includes('reward')) return GEMINI_RESPONSES.points;
  if (lower.includes('leave') || lower.includes('traffic') || lower.includes('parking')) return GEMINI_RESPONSES.leave;

  return `I'm here to help with **${input}**! 

You're at **North Stand, Row H, Seat 24** at MetroArena. Here's what I can help you with:
- 📍 Navigation & directions
- 🍔 Food recommendations & queue times
- 🚻 Restroom locations
- 🚪 Exit guidance
- ⭐ Loyalty points & rewards
- 🚗 Parking & traffic predictions

What would you like to know?`;
}

function MarkdownText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\|[^|]+\|(?:\|[^|]*\|)*)/g);
  return (
    <>
      {text.split('\n').map((line, i) => {
        if (line.startsWith('|')) {
          const cells = line.split('|').filter(Boolean).map(c => c.trim());
          if (cells.every(c => c.match(/^[-:]+$/))) return null;
          return (
            <div key={i} className="flex gap-2 text-xs my-0.5">
              {cells.map((c, j) => (
                <span key={j} className="flex-1 px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.04)', color: '#e2e8f0' }}>
                  {c.replace(/\*\*/g, '')}
                </span>
              ))}
            </div>
          );
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return <div key={i} className="flex gap-2 text-sm" style={{ color: '#cbd5e1' }}>
            <span>•</span>
            <span dangerouslySetInnerHTML={{
              __html: line.slice(2).replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#f1f5f9">$1</strong>')
            }} />
          </div>;
        }
        if (line.match(/^\d+\./)) {
          return <div key={i} className="text-sm" style={{ color: '#cbd5e1' }}
            dangerouslySetInnerHTML={{
              __html: line.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#f1f5f9">$1</strong>')
            }} />;
        }
        if (line === '') return <div key={i} style={{ height: 6 }} />;
        return (
          <div key={i} className="text-sm" style={{ color: '#cbd5e1' }}
            dangerouslySetInnerHTML={{
              __html: line.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#f1f5f9">$1</strong>')
            }} />
        );
      })}
    </>
  );
}

export default function FlowBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_BOT_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate Gemini API latency
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const botMsg: ChatMessage = {
      id: `b-${Date.now()}`,
      role: 'assistant',
      content: getResponse(text),
      timestamp: new Date(),
      suggestions: FLOWBOT_SUGGESTIONS.filter(s => !s.toLowerCase().includes(text.slice(0, 5).toLowerCase())).slice(0, 3),
    };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const reset = () => {
    setMessages([INITIAL_BOT_MESSAGE]);
    setInput('');
  };

  return (
    <div className="animate-fade-in-up h-full flex flex-col" style={{ maxHeight: 'calc(100vh - 80px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Outfit, sans-serif', color: '#f1f5f9' }}>
            <span className="text-gradient-primary">FlowBot</span> AI Assistant
          </h1>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
            Powered by Gemini 1.5 Flash · Context-aware · Real-time venue data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="badge badge-purple">
            <Sparkles className="w-3 h-3" />
            Gemini AI
          </div>
          <button onClick={reset} className="btn-secondary" style={{ padding: '8px 14px' }}>
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 card overflow-y-auto" style={{ padding: 20, minHeight: 400 }}>
        {/* Context chip */}
        <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: '#6366f1' }} />
          <span className="text-xs" style={{ color: '#94a3b8' }}>
            Context loaded: <strong style={{ color: '#a5b4fc' }}>Alex Rivera · North Stand H24 · Gold Tier · Vegetarian · Live event</strong>
          </span>
        </div>

        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div style={{ maxWidth: '80%' }}>
                {msg.role === 'assistant' ? (
                  <div className="chat-bot">
                    <MarkdownText text={msg.content} />
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {msg.suggestions.map(s => (
                          <button key={s} onClick={() => sendMessage(s)}
                            className="text-xs px-3 py-1.5 rounded-xl transition-all hover:translate-y-[-1px]"
                            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="chat-user">{msg.content}</div>
                )}
                <div className="text-xs mt-1 px-2" style={{ color: '#475569', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="chat-bot">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#6366f1', animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#6366f1', animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#6366f1', animationDelay: '300ms' }} />
                  <span className="text-xs ml-1" style={{ color: '#64748b' }}>FlowBot is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="flex gap-2 my-3 flex-wrap">
        {FLOWBOT_SUGGESTIONS.slice(0, 4).map(s => (
          <button key={s} onClick={() => sendMessage(s)}
            className="text-xs px-3 py-2 rounded-xl transition-all hover:translate-y-[-1px]"
            style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 rounded-xl px-4"
          style={{ background: '#111827', border: '1px solid rgba(99,102,241,0.3)' }}>
          <input
            id="flowbot-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask FlowBot anything about your venue experience..."
            className="flex-1 bg-transparent py-3.5 text-sm outline-none"
            style={{ color: '#f1f5f9' }}
          />
          <Mic className="w-4 h-4" style={{ color: '#475569', cursor: 'pointer' }} />
        </div>
        <button
          id="flowbot-send"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="btn-primary"
          style={{ padding: '12px 18px', opacity: !input.trim() || loading ? 0.5 : 1 }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
