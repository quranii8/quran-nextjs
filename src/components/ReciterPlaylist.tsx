"use client";

import { useState } from "react";
import { Play, Search } from "lucide-react";
import { SURAHS } from "@/lib/surahs";
import { useAudioStore, AudioQueueItem } from "@/lib/audio-store";
import { useQuranStore } from "@/lib/store";
import { getReciter, getFullSurahUrl } from "@/lib/reciters";
import { toArabicNum } from "@/lib/utils";

interface Props {
  reciterId: string;
  reciterName: string;
}

export function ReciterPlaylist({ reciterId, reciterName }: Props) {
  const [q, setQ] = useState("");
  const setQueue = useAudioStore((s) => s.setQueue);
  const setReciterStore = useQuranStore((s) => s.setReciter);

  const filtered = q.trim()
    ? SURAHS.filter((s) => s.a.includes(q) || s.e.toLowerCase().includes(q.toLowerCase()))
    : SURAHS;

  /**
   * تشغيل السورة كاملة (ملف صوتي متواصل بدون انقطاع)
   * + يبني playlist لكل السور بعدها لتشغيل تلقائي متتابع
   */
  const playSurah = (surahNum: number) => {
    setReciterStore(reciterId);
    const reciter = getReciter(reciterId);
    if (!reciter) return;

    // بناء قائمة تشغيل بكل السور (يبدأ من المختارة)
    const queue: AudioQueueItem[] = SURAHS.map((s) => {
      const url = getFullSurahUrl(reciter, s.n);
      return {
        surah: s.n,
        url: url || "",
        title: `سورة ${s.a}`,
        subtitle: reciterName,
        type: "full" as const,
      };
    }).filter((item) => item.url);

    const startIndex = queue.findIndex((item) => item.surah === surahNum);
    setQueue(queue, Math.max(0, startIndex));
  };

  /** تشغيل كل المصحف من الفاتحة */
  const playAll = () => {
    playSurah(1);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">المصحف الكامل</h2>
          <button
            onClick={playAll}
            className="btn btn-primary !py-1.5 !px-3 !text-xs"
          >
            <Play className="w-3.5 h-3.5" />
            تشغيل كل القرآن
          </button>
        </div>
        <div className="relative w-full sm:w-56">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث..."
            className="px-4 py-2 pr-10 rounded-full text-sm outline-none border w-full"
            style={{ background: "var(--bg-soft)", borderColor: "var(--border)", color: "var(--text)" }}
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-muted)" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[600px] overflow-y-auto pr-1">
        {filtered.map((s) => (
          <button
            key={s.n}
            onClick={() => playSurah(s.n)}
            className="flex items-center gap-3 p-3 rounded-xl text-right transition-all hover:bg-green-50 dark:hover:bg-green-900/20 group"
          >
            <div
              className="w-10 h-10 rounded-full grid place-items-center text-white shrink-0 transition-transform group-hover:scale-110"
              style={{ background: "var(--primary)" }}
            >
              <Play className="w-4 h-4 mr-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm flex items-center gap-2">
                <span style={{ color: "var(--text-muted)" }}>{toArabicNum(s.n)}.</span>
                <span className="font-quran text-base">{s.a}</span>
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {toArabicNum(s.v)} آية • {s.t === "makki" ? "مكية" : "مدنية"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
