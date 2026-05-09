"use client";

import { useState } from "react";

interface Message {
  role: "user" | "bot";
  text: string;
}

async function sendMessage(question: string): Promise<string> {
  try {
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return data.answer;
  } catch (error) {
    console.error("API hatası:", error);
    return "Üzgünüm, bağlantı hatası oluştu. Lütfen backend'in çalıştığından emin olun.";
  }
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    const answer = await sendMessage(userMsg);

    setMessages((prev) => [...prev, { role: "bot", text: answer }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-green-100">
            <span className="text-5xl">🌾</span>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                AgriTech Tarım Asistanı
              </h1>
              <p className="text-sm text-gray-600 mt-1">Yapay Zeka Destekli Tarım Danışmanınız</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-green-100 p-6 mb-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-8 mb-4">
                <span className="text-6xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Merhaba! 👋</h3>
              <p className="text-gray-600 max-w-md">
                Tarım, bitki hastalıkları, gübreleme, sulama ve daha fazlası hakkında 
                sorularını sorabilirsin. Sana yardımcı olmaktan mutluluk duyarım!
              </p>
              <div className="flex gap-2 mt-6">
                <span className="px-3 py-1 bg-white rounded-full text-sm text-green-700 shadow-sm">
                  🌱 Domates yetiştiriciliği
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-sm text-green-700 shadow-sm">
                  💧 Sulama zamanlaması
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-sm text-green-700 shadow-sm">
                  🐛 Zararlılar
                </span>
              </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">
                    {msg.role === "user" ? "👤 Siz" : "🤖 AgriBot"}
                  </span>
                </div>
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">🤖 AgriBot</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-4">
          <div className="flex gap-3">
            <input
              className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-gray-800 placeholder-gray-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Örneğin: Domates neden sararır? 🍅"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold"
            >
              {loading ? "Gönderiliyor..." : "Gönder →"}
            </button>
          </div>
          <div className="text-xs text-gray-500 text-center mt-3">
            🔒 Güvenli bağlantı • 💡 Tarım uzmanı yapay zeka
          </div>
        </div>
      </div>
    </div>
  );
}