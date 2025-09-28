"use client";
import { ApiClient } from "@/app/api-client";
import { useState } from "react";

const SupportChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{
    from: "user" | "bot";
    text: string;
  }[]>([
    { from: "bot", text: "Вітаємо! Я Ваш ШІ помічник." }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    setLoading(true);
    setError("");
    try {
      const data = await ApiClient.post<{ reply: string }>("/supportchat", { userMessage: input });
      setMessages((msgs) => [...msgs, { from: "bot", text: data.reply || "Немає відповіді" }]);
    } catch (err: unknown) {
      let msg = "";
      if (err && typeof err === "object" && "message" in err) {
        msg = (err as any).message;
      } else {
        msg = String(err);
      }
      setMessages((msgs) => [...msgs, { from: "bot", text: "Помилка: " + msg }]);
      setError("Не вдалося відправити повідомлення");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
      {open ? (
        <div className="animate-fade-in shadow-2xl rounded-2xl bg-white border border-[#e5e7eb] w-[350px] max-w-[95vw] flex flex-col" style={{ boxShadow: '0 8px 32px 0 rgba(80, 36, 120, 0.18)' }}>
          <div className="flex items-center justify-between px-5 py-3 border-b bg-gradient-to-r from-[#94569f] to-[#2563eb] text-white rounded-t-2xl">
            <span className="font-semibold tracking-wide">Чат підтримки</span>
            <button onClick={() => setOpen(false)} className="text-white text-2xl leading-none hover:text-[#ffe082] transition-colors">×</button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ maxHeight: 340, background: 'linear-gradient(135deg, #f8f6fa 60%, #e3e8f7 100%)' }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <span
                  className={
                    m.from === "user"
                      ? "bg-gradient-to-br from-[#2563eb] to-[#94569f] text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%] text-sm shadow-md animate-pop"
                      : "bg-white border border-[#e5e7eb] text-[#3b3b3b] rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%] text-sm shadow animate-pop"
                  }
                  style={{ wordBreak: 'break-word' }}
                >
                  {m.text}
                </span>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400 text-center">Генеруємо відповідь...</div>}
          </div>
          <form onSubmit={handleSend} className="flex border-t p-3 gap-2 bg-[#f8f6fa] rounded-b-2xl">
            <input
              className="flex-1 border border-[#d1d5db] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#94569f] bg-white transition placeholder-gray-400"
              style={{ color: '#111', background: 'white', caretColor: '#2563eb' }}
              type="text"
              placeholder="Ваше питання..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#2563eb] to-[#94569f] text-white rounded-xl px-4 py-2 text-sm font-semibold shadow hover:from-[#94569f] hover:to-[#2563eb] transition disabled:opacity-60"
              disabled={loading || !input.trim()}
            >
              Надіслати
            </button>
          </form>
        </div>
      ) : (
        <button
          className="bg-gradient-to-r from-[#2563eb] to-[#94569f] text-white rounded-full shadow-2xl p-4 hover:scale-110 focus:outline-none transition-transform"
          onClick={() => setOpen(true)}
          aria-label="Відкрити чат підтримки"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#2563eb"/><path d="M8.5 20v-2.5a5.5 5.5 0 015.5-5.5h2.5a5.5 5.5 0 015.5 5.5V20" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="12" r="1.5" fill="#fff"/><circle cx="17" cy="12" r="1.5" fill="#fff"/></svg>
        </button>
      )}
      <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.3s; }
        .animate-pop { animation: popIn 0.18s; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: none; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SupportChatWidget;

