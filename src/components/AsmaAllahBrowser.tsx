"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { DivineName } from "@/lib/asma-allah";
import { toArabicNum } from "@/lib/utils";

interface Props {
  names: DivineName[];
}

export function AsmaAllahBrowser({ names }: Props) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<DivineName | null>(null);

  const filtered = useMemo(() => {
    if (!q.trim()) return names;
    const ql = q.toLowerCase().trim();
    return names.filter(
      (n) =>
        n.ar.includes(q) ||
        n.en.toLowerCase().includes(ql) ||
        n.meaning.includes(q) ||
        n.explanation.includes(q)
    );
  }, [q, names]);

  return (
    <>
      {/* Search */}
      <div className="relative max-w-xl mx-auto mb-8">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن اسم أو معنى..."
          className="w-full py-3 pr-12 pl-12 rounded-full text-base outline-none border-2 transition-colors"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        />
        <Search
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: "var(--text-muted)" }}
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute left-4 top-1/2 -translate-y-1/2 icon-btn !w-7 !h-7"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="text-center text-sm mb-5" style={{ color: "var(--text-muted)" }}>
        {toArabicNum(filtered.length)} اسماً
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((name) => (
          <button
            key={name.n}
            onClick={() => setSelected(name)}
            className="card p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lg group cursor-pointer"
          >
            <div
              className="text-xs font-bold mb-2"
              style={{ color: "var(--gold-dark)" }}
            >
              {toArabicNum(name.n)}
            </div>
            <div
              className="font-quran text-2xl md:text-3xl mb-2 transition-colors group-hover:text-green-700 dark:group-hover:text-green-400"
              style={{ color: "var(--primary)" }}
            >
              {name.ar}
            </div>
            <div
              className="text-xs leading-relaxed line-clamp-2"
              style={{ color: "var(--text-muted)" }}
            >
              {name.meaning}
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔍</div>
          <p style={{ color: "var(--text-muted)" }}>لا توجد نتائج لـ &quot;{q}&quot;</p>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
          style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(6px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[88vh] rounded-3xl overflow-hidden flex flex-col animate-slide-up"
            style={{ background: "var(--bg-elev)", boxShadow: "0 20px 50px rgba(0,0,0,.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="p-8 text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--gold-dark))" }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 left-4 w-9 h-9 rounded-full grid place-items-center bg-white/20 backdrop-blur transition-colors hover:bg-white/30"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-center">
                <div className="text-sm opacity-90 mb-2">
                  الاسم {toArabicNum(selected.n)} من ٩٩
                </div>
                <div className="font-quran text-5xl md:text-6xl font-bold mb-2">
                  {selected.ar}
                </div>
                <div className="opacity-90">{selected.en}</div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 md:p-8 space-y-5">
              <div
                className="p-5 rounded-xl text-center"
                style={{ background: "var(--bg-soft)" }}
              >
                <div
                  className="text-xs font-bold mb-2"
                  style={{ color: "var(--gold-dark)" }}
                >
                  ✦ المعنى
                </div>
                <p className="text-base md:text-lg font-medium">{selected.meaning}</p>
              </div>

              <div
                className="p-5 rounded-xl"
                style={{ background: "var(--bg-soft)", borderRight: "4px solid var(--primary)" }}
              >
                <div
                  className="text-xs font-bold mb-3"
                  style={{ color: "var(--primary)" }}
                >
                  📖 الشرح
                </div>
                <p className="text-base leading-loose">{selected.explanation}</p>
              </div>

              {/* Navigation */}
              <div className="flex justify-between gap-3 pt-3">
                <button
                  onClick={() => {
                    const prev = names.find((n) => n.n === selected.n - 1);
                    if (prev) setSelected(prev);
                  }}
                  disabled={selected.n === 1}
                  className="btn btn-outline !py-2 disabled:opacity-30"
                >
                  ← السابق
                </button>
                <button
                  onClick={() => {
                    const next = names.find((n) => n.n === selected.n + 1);
                    if (next) setSelected(next);
                  }}
                  disabled={selected.n === names.length}
                  className="btn btn-outline !py-2 disabled:opacity-30"
                >
                  التالي →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
