"use client";

import { useState, useMemo } from "react";
import { Search, Copy, BookOpen, X } from "lucide-react";
import { HadithQudsi } from "@/lib/hadith-qudsi";
import { toArabicNum } from "@/lib/utils";

interface Props {
  hadiths: HadithQudsi[];
}

export function HadithQudsiBrowser({ hadiths }: Props) {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<string>("all");

  const topics = useMemo(() => {
    const set = new Set<string>();
    hadiths.forEach((h) => set.add(h.topic));
    return Array.from(set);
  }, [hadiths]);

  const filtered = useMemo(() => {
    let arr = hadiths;
    if (topic !== "all") arr = arr.filter((h) => h.topic === topic);
    if (q.trim()) {
      const ql = q.toLowerCase();
      arr = arr.filter(
        (h) =>
          h.text.includes(q) ||
          h.benefit?.includes(q) ||
          h.narrator.includes(q) ||
          h.source.toLowerCase().includes(ql)
      );
    }
    return arr;
  }, [hadiths, topic, q]);

  const copy = (h: HadithQudsi) => {
    navigator.clipboard.writeText(`${h.text}\n\nراويه: ${h.narrator}\nالمصدر: ${h.source}`);
  };

  return (
    <>
      {/* فلاتر + بحث */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث في الأحاديث..."
            className="w-full py-2.5 pr-10 pl-10 rounded-full text-sm outline-none border-2"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
          {q && (
            <button onClick={() => setQ("")} className="absolute left-3 top-1/2 -translate-y-1/2 icon-btn !w-7 !h-7">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="px-4 py-2.5 rounded-full text-sm outline-none border-2"
          style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
        >
          <option value="all">كل المواضيع</option>
          {topics.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        {toArabicNum(filtered.length)} حديثاً
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <p style={{ color: "var(--text-muted)" }}>لا توجد نتائج</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((h) => (
            <div
              key={h.n}
              className="card p-6 md:p-7 transition-all hover:shadow-md"
              style={{ borderRight: "4px solid #be185d" }}
            >
              <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl grid place-items-center font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #be185d, #f0abfc)" }}
                  >
                    {toArabicNum(h.n)}
                  </div>
                  <div>
                    <div
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: "rgba(190,24,93,.12)", color: "#be185d" }}
                    >
                      {h.topic}
                    </div>
                  </div>
                </div>
                <button onClick={() => copy(h)} className="icon-btn !w-8 !h-8" title="نسخ">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <p className="font-quran text-lg md:text-xl leading-loose mb-4">{h.text}</p>

              <div className="flex flex-wrap gap-3 text-xs pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <span style={{ color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text)" }}>الراوي:</strong> {h.narrator}
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text)" }}>المصدر:</strong> {h.source}
                </span>
              </div>

              {h.benefit && (
                <div
                  className="mt-3 text-sm p-3 rounded-lg"
                  style={{ background: "var(--bg-soft)", color: "var(--text)" }}
                >
                  ✦ <strong style={{ color: "var(--gold-dark)" }}>الفائدة:</strong> {h.benefit}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
