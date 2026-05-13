“use client”;

import { useState, useRef, useEffect, useCallback } from “react”;
import { Send, Loader2, Trash2, BookOpen, ChevronDown, Sparkles } from “lucide-react”;

interface Message {
role: “user” | “assistant”;
content: string;
}

const SUGGESTED_QUESTIONS = [
“ما حكم صلاة الجمعة وشروطها؟”,
“ما هي أركان الحج وشروطه؟”,
“ما حكم الزكاة ومقدارها؟”,
“ما الفرق بين الحلال والحرام في المأكولات؟”,
“ما أحكام الصيام في رمضان؟”,
“ما حكم التأمين التجاري في الإسلام؟”,
];

function MarkdownRenderer({ text }: { text: string }) {
const lines = text.split(”\n”);
const elements: React.ReactNode[] = [];
let i = 0;

while (i < lines.length) {
const line = lines[i];

```
if (line.startsWith("## ")) {
  elements.push(
    <h2
      key={i}
      className="text-base font-bold mt-5 mb-2 flex items-center gap-2"
      style={{ color: "var(--primary)" }}
    >
      <span
        className="w-1 h-5 rounded-full inline-block"
        style={{ background: "var(--primary)" }}
      />
      {line.slice(3)}
    </h2>
  );
} else if (line.startsWith("### ")) {
  elements.push(
    <h3 key={i} className="text-sm font-bold mt-3 mb-1" style={{ color: "var(--gold)" }}>
      {line.slice(4)}
    </h3>
  );
} else if (line.startsWith("- ") || line.startsWith("• ")) {
  elements.push(
    <li key={i} className="text-sm mr-4 mb-1 list-disc" style={{ color: "var(--text)" }}>
      {line.slice(2)}
    </li>
  );
} else if (line.startsWith("**") && line.endsWith("**")) {
  elements.push(
    <p key={i} className="text-sm font-bold my-1" style={{ color: "var(--text)" }}>
      {line.slice(2, -2)}
    </p>
  );
} else if (line.trim() === "") {
  elements.push(<div key={i} className="h-2" />);
} else {
  // Inline bold processing
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  elements.push(
    <p key={i} className="text-sm leading-relaxed mb-1" style={{ color: "var(--text)" }}>
      {parts.map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j} style={{ color: "var(--primary)" }}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        )
      )}
    </p>
  );
}
i++;
```

}

return <div className="leading-7">{elements}</div>;
}

export function AiFatwaChat() {
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState(””);
const [loading, setLoading] = useState(false);
const [streamingText, setStreamingText] = useState(””);
const [showSuggestions, setShowSuggestions] = useState(true);
const bottomRef = useRef<HTMLDivElement>(null);
const textareaRef = useRef<HTMLTextAreaElement>(null);

useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: “smooth” });
}, [messages, streamingText]);

const adjustTextarea = () => {
const ta = textareaRef.current;
if (ta) {
ta.style.height = “auto”;
ta.style.height = Math.min(ta.scrollHeight, 140) + “px”;
}
};

const sendMessage = useCallback(
async (question: string) => {
if (!question.trim() || loading) return;

```
  const userMsg: Message = { role: "user", content: question.trim() };
  const newMessages = [...messages, userMsg];
  setMessages(newMessages);
  setInput("");
  setLoading(true);
  setStreamingText("");
  setShowSuggestions(false);

  if (textareaRef.current) textareaRef.current.style.height = "auto";

  try {
    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    const res = await fetch("/api/ai-fatwa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: question.trim(), history }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "خطأ في الاتصال");
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      full += chunk;
      setStreamingText(full);
    }

    setMessages((prev) => [...prev, { role: "assistant", content: full }]);
    setStreamingText("");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `❌ **خطأ:** ${message}\n\nالرجاء المحاولة مجدداً أو التحقق من الاتصال.`,
      },
    ]);
    setStreamingText("");
  } finally {
    setLoading(false);
  }
},
[messages, loading]
```

);

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
if (e.key === “Enter” && !e.shiftKey) {
e.preventDefault();
sendMessage(input);
}
};

const clearChat = () => {
setMessages([]);
setStreamingText(””);
setShowSuggestions(true);
};

const isEmpty = messages.length === 0 && !streamingText;

return (
<div
className=“flex flex-col rounded-2xl overflow-hidden border”
style={{
background: “var(–surface)”,
borderColor: “var(–border)”,
boxShadow: “var(–shadow-lg)”,
minHeight: “600px”,
maxHeight: “75vh”,
}}
>
{/* Header */}
<div
className=“flex items-center justify-between px-5 py-4 border-b”
style={{
background: “linear-gradient(135deg, var(–primary), var(–primary-light))”,
borderColor: “transparent”,
}}
>
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-white/20 grid place-items-center text-xl">
🕌
</div>
<div>
<div className="text-white font-bold text-sm">نور الفقه · مساعد إسلامي</div>
<div className="text-white/70 text-xs">يجيب بالأدلة من القرآن والسنة والمذاهب</div>
</div>
</div>
<div className="flex items-center gap-2">
<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-white/90 text-xs">
<Sparkles className="w-3 h-3" />
Claude AI
</div>
{messages.length > 0 && (
<button
onClick={clearChat}
className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
title="محادثة جديدة"
>
<Trash2 className="w-4 h-4" />
</button>
)}
</div>
</div>

```
  {/* Messages Area */}
  <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4" style={{ minHeight: 0 }}>
    {/* Welcome */}
    {isEmpty && (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">☪️</div>
        <h3 className="text-lg font-bold mb-2">مرحباً بك في نور الفقه</h3>
        <p className="text-sm max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
          اسألني عن أي مسألة دينية وسأجيبك بإجابة علمية موثّقة من القرآن الكريم والسنة
          النبوية وأقوال العلماء.
        </p>

        {/* Disclaimer */}
        <div
          className="mt-4 mx-auto max-w-sm p-3 rounded-xl text-xs"
          style={{
            background: "var(--bg-soft)",
            color: "var(--text-muted)",
            border: "1px solid var(--border-soft)",
          }}
        >
          ⚠️ هذه الإجابات للتوعية العلمية. للمسائل الفقهية الدقيقة يُرجى مراجعة عالم متخصص.
        </div>
      </div>
    )}

    {/* Suggested Questions */}
    {showSuggestions && (
      <div>
        <div
          className="flex items-center gap-2 text-xs font-semibold mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          <BookOpen className="w-3.5 h-3.5" />
          أسئلة مقترحة
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={loading}
              className="text-right px-4 py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
              style={{
                background: "var(--bg-soft)",
                border: "1px solid var(--border-soft)",
                color: "var(--text)",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Chat Messages */}
    {messages.map((msg, i) => (
      <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-xl shrink-0 grid place-items-center text-sm"
          style={{
            background:
              msg.role === "user"
                ? "linear-gradient(135deg, var(--primary), var(--primary-light))"
                : "var(--gold)",
          }}
        >
          {msg.role === "user" ? "👤" : "☪️"}
        </div>

        {/* Bubble */}
        <div
          className="flex-1 max-w-[85%] rounded-2xl px-4 py-3"
          style={
            msg.role === "user"
              ? {
                  background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
                  color: "white",
                  borderRadius: "18px 4px 18px 18px",
                }
              : {
                  background: "var(--bg-elev)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: "4px 18px 18px 18px",
                }
          }
        >
          {msg.role === "user" ? (
            <p className="text-sm leading-relaxed">{msg.content}</p>
          ) : (
            <MarkdownRenderer text={msg.content} />
          )}
        </div>
      </div>
    ))}

    {/* Streaming */}
    {streamingText && (
      <div className="flex gap-3">
        <div
          className="w-8 h-8 rounded-xl shrink-0 grid place-items-center text-sm"
          style={{ background: "var(--gold)" }}
        >
          ☪️
        </div>
        <div
          className="flex-1 max-w-[85%] rounded-2xl px-4 py-3"
          style={{
            background: "var(--bg-elev)",
            border: "1px solid var(--border-soft)",
            borderRadius: "4px 18px 18px 18px",
          }}
        >
          <MarkdownRenderer text={streamingText} />
          <span
            className="inline-block w-2 h-4 mr-0.5 rounded-sm animate-pulse"
            style={{ background: "var(--primary)", verticalAlign: "middle" }}
          />
        </div>
      </div>
    )}

    {/* Loading dots */}
    {loading && !streamingText && (
      <div className="flex gap-3">
        <div
          className="w-8 h-8 rounded-xl shrink-0 grid place-items-center text-sm"
          style={{ background: "var(--gold)" }}
        >
          ☪️
        </div>
        <div
          className="px-5 py-4 rounded-2xl flex items-center gap-1.5"
          style={{
            background: "var(--bg-elev)",
            border: "1px solid var(--border-soft)",
            borderRadius: "4px 18px 18px 18px",
          }}
        >
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                background: "var(--primary)",
                animationDelay: `${d * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    )}

    <div ref={bottomRef} />
  </div>

  {/* Input Area */}
  <div
    className="px-4 py-3 border-t"
    style={{ borderColor: "var(--border-soft)", background: "var(--bg-elev)" }}
  >
    {messages.length > 0 && !showSuggestions && (
      <button
        onClick={() => setShowSuggestions((v) => !v)}
        className="flex items-center gap-1.5 text-xs mb-2 px-3 py-1 rounded-full transition"
        style={{
          color: "var(--text-muted)",
          background: "var(--bg-soft)",
          border: "1px solid var(--border-soft)",
        }}
      >
        <BookOpen className="w-3 h-3" />
        أسئلة مقترحة
        <ChevronDown className="w-3 h-3" />
      </button>
    )}

    <div
      className="flex items-end gap-3 rounded-xl px-4 py-2"
      style={{ background: "var(--bg-soft)", border: "1px solid var(--border)" }}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          adjustTextarea();
        }}
        onKeyDown={handleKeyDown}
        placeholder="اكتب سؤالك الديني هنا… (Enter للإرسال، Shift+Enter لسطر جديد)"
        disabled={loading}
        rows={1}
        className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed py-1.5"
        style={{
          color: "var(--text)",
          fontFamily: "var(--font-noto-kufi)",
          maxHeight: "140px",
        }}
      />
      <button
        onClick={() => sendMessage(input)}
        disabled={loading || !input.trim()}
        className="shrink-0 w-9 h-9 rounded-xl grid place-items-center transition-all disabled:opacity-40"
        style={{
          background: input.trim()
            ? "linear-gradient(135deg, var(--primary), var(--primary-light))"
            : "var(--border)",
        }}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        ) : (
          <Send className="w-4 h-4 text-white" />
        )}
      </button>
    </div>
    <p className="text-center text-xs mt-2" style={{ color: "var(--text-soft)" }}>
      نور الفقه · مدعوم بالذكاء الاصطناعي · للاستشارات الفقهية الدقيقة راجع عالماً متخصصاً
    </p>
  </div>
</div>
```

);
}