import React, { useState, useEffect, useRef } from "react";

const TradingAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am your NovusTrade AI Assistant.\n\nYou can ask me about stock market concepts (e.g., 'What is P/E ratio?'), check live stock quotes, or execute trades via chat or voice (e.g., 'Buy 10 RELIANCE').",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle voice speech-to-text recognition
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
      processCommand(spokenText);
    };

    recognition.start();
  };

  // Parse natural language commands and trading intents
  const processCommand = (userInput) => {
    const trimmed = userInput.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response and order execution trigger
    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      let aiReply = "";

      if (lower.startsWith("buy ") || lower.startsWith("sell ")) {
        const parts = trimmed.split(" ");
        const action = parts[0].toUpperCase();
        const qty = parts[1] || "1";
        const symbol = parts.slice(2).join(" ").toUpperCase() || "STOCK";

        aiReply = `Order Placed Successfully!\n\n• Action: ${action}\n• Quantity: ${qty}\n• Instrument: ${symbol}\n• Order Type: MARKET\n• Status: EXECUTED`;
      } else if (lower.includes("price of") || lower.includes("quote") || lower.includes("price")) {
        aiReply = `Live Market Quote:\n• Instrument: RELIANCE\n• LTP: ₹1,242.00 (+0.69%)\n• 52W High: ₹1,608.00 | 52W Low: ₹1,120.00`;
      } else if (lower.includes("pe ratio") || lower.includes("p/e") || lower.includes("learn")) {
        aiReply = `Market Lesson (P/E Ratio):\nThe Price-to-Earnings (P/E) ratio measures a company's share price relative to its earnings per share. A low P/E might indicate an undervalued stock, while a high P/E suggests high growth expectations.`;
      } else if (lower.includes("support") || lower.includes("resistance")) {
        aiReply = `Technical Analysis (NIFTY 50):\n• Immediate Support: 24,750\n• Major Support: 24,500\n• Immediate Resistance: 25,100\nOverall Market Bias: Mildly Bullish.`;
      } else {
        aiReply = `Received query: "${trimmed}". Processing market data and company fundamentals...`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Pinned Top Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            AI
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              NovusTrade AI Terminal
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-[10px] text-slate-400">
              Voice & Text Intelligent Engine
            </p>
          </div>
        </div>

        <span className="bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded text-[11px] border border-blue-100">
          Terminal Active
        </span>
      </div>

      {/* Scrollable Chat Viewport */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs whitespace-pre-line ${
                m.sender === "user"
                  ? "bg-blue-600 text-white rounded-tr-none font-medium"
                  : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-200/80"
              }`}
            >
              {m.text}
              <div
                className={`text-[9px] mt-1 text-right ${
                  m.sender === "user" ? "text-blue-200" : "text-slate-400"
                }`}
              >
                {m.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Pinned Bottom Input & Quick Prompts */}
      <div className="shrink-0 bg-white border-t border-slate-100">
        {/* Quick Action Buttons */}
        <div className="px-6 pt-2 pb-1 flex gap-2 overflow-x-auto">
          {[
            "Buy 10 RELIANCE",
            "Sell 5 TCS",
            "What is P/E Ratio?",
            "Check NIFTY Support",
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => processCommand(tag)}
              className="text-[10px] font-semibold text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1 rounded-full border border-slate-200 transition-colors shrink-0"
            >
              ⚡ {tag}
            </button>
          ))}
        </div>

        {/* Action Input Form */}
        <div className="p-4 pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              processCommand(input);
            }}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-xs"
          >
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-lg transition-all ${
                isListening
                  ? "bg-rose-500 text-white animate-bounce"
                  : "hover:bg-slate-200 text-slate-600"
              }`}
              title="Voice Input"
            >
              🎙️
            </button>

            <input
              type="text"
              placeholder={
                isListening
                  ? "Listening... Speak your command..."
                  : "Ask about stocks or type 'Buy 10 RELIANCE'..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent px-2 text-xs text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg active:scale-95 transition-all shadow-xs"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TradingAssistant;