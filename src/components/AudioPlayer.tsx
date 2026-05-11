"use client";

import { useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, X, Repeat, Repeat1 } from "lucide-react";
import { useAudioStore } from "@/lib/audio-store";
import { useQuranStore } from "@/lib/store";
import { RECITERS, getReciter } from "@/lib/reciters";
import { formatTime } from "@/lib/utils";
import { ReciterAvatar } from "./ReciterAvatar";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { queue, index, isPlaying, isVisible, currentTime, duration, repeat } = useAudioStore();
  const { setPlaying, setProgress, next, close, toggleRepeat } = useAudioStore();
  const reciter = useQuranStore((s) => s.reciter);
  const setReciter = useQuranStore((s) => s.setReciter);

  const current = queue[index];
  const reciterInfo = getReciter(reciter);

  // Sync isPlaying state -> audio element
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !current) return;
    if (a.src !== current.url) {
      a.src = current.url;
    }
    if (isPlaying) {
      a.play().catch(() => setPlaying(false));
    } else {
      a.pause();
    }
  }, [isPlaying, current, setPlaying]);

  // Highlight verse in DOM (للوضع آية بآية فقط)
  useEffect(() => {
    if (!current || !current.verse) return;
    document.querySelectorAll(".verse-playing").forEach((el) => el.classList.remove("verse-playing"));
    const el = document.querySelector(`[data-verse-key="${current.surah}:${current.verse}"]`);
    if (el) {
      el.classList.add("verse-playing");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [current]);

  // عند تغيير القارئ - أعد بناء الـ queue (للوضع full فقط)
  useEffect(() => {
    if (!current || current.type !== "full") return;
    const newReciter = getReciter(reciter);
    if (!newReciter?.fullSurahServer) return;

    const wasPlaying = !audioRef.current?.paused;
    const newUrl = `${newReciter.fullSurahServer}${String(current.surah).padStart(3, "0")}.mp3`;
    if (audioRef.current && audioRef.current.src !== newUrl) {
      audioRef.current.src = newUrl;
      // تحديث الـ queue
      const newQueue = queue.map((item) =>
        item.type === "full"
          ? {
              ...item,
              url: `${newReciter.fullSurahServer}${String(item.surah).padStart(3, "0")}.mp3`,
              subtitle: newReciter.name,
            }
          : item
      );
      useAudioStore.setState({ queue: newQueue });
      if (wasPlaying) audioRef.current.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reciter]);

  if (!isVisible || !current) return null;

  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          setProgress(a.currentTime, a.duration || 0);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          if (repeat === "one") {
            const a = audioRef.current;
            if (a) {
              a.currentTime = 0;
              a.play().catch(() => {});
            }
          } else if (index < queue.length - 1) {
            next();
          } else if (repeat === "all") {
            useAudioStore.setState({ index: 0, currentTime: 0, isPlaying: true });
          } else {
            setPlaying(false);
          }
        }}
        onError={() => setPlaying(false)}
      />

      <div
        className="fixed bottom-0 inset-x-0 z-40 border-t no-print"
        style={{
          background: "var(--bg-elev)",
          borderColor: "var(--border)",
          boxShadow: "0 -8px 24px rgba(0,0,0,.12)",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 flex flex-wrap items-center gap-3">
          {/* Avatar + Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="shrink-0">
              <ReciterAvatar
                name={reciterInfo?.name || "—"}
                imageUrl={reciterInfo?.image}
                size={48}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{current.title}</div>
              <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {current.subtitle}
                {current.type === "full" && (
                  <span
                    className="inline-block mr-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
                    style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
                  >
                    سورة كاملة
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              className="icon-btn !w-9 !h-9"
              onClick={toggleRepeat}
              title={repeat === "off" ? "بدون تكرار" : repeat === "all" ? "تكرار الكل" : "تكرار الواحدة"}
              style={{ color: repeat !== "off" ? "var(--primary)" : undefined }}
            >
              {repeat === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
            <button
              className="icon-btn !w-9 !h-9"
              onClick={() => useAudioStore.getState().prev()}
              disabled={index === 0}
              aria-label="السابق"
            >
              {/* في RTL: السابق يكون على اليمين */}
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full grid place-items-center text-white transition-all hover:scale-105"
              style={{ background: "var(--primary)" }}
              aria-label={isPlaying ? "إيقاف" : "تشغيل"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 mr-0.5" />}
            </button>
            <button
              className="icon-btn !w-9 !h-9"
              onClick={() => useAudioStore.getState().next()}
              disabled={index >= queue.length - 1 && repeat !== "all"}
              aria-label="التالي"
            >
              <SkipBack className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 flex-[2] min-w-[200px] order-3 md:order-none basis-full md:basis-auto">
            <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)", minWidth: "42px" }}>
              {formatTime(currentTime)}
            </span>
            <div
              className="flex-1 h-1.5 rounded-full cursor-pointer relative group"
              style={{ background: "var(--border)" }}
              onClick={(e) => {
                const a = audioRef.current;
                if (!a || !duration) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const ratio = (rect.width - x) / rect.width; // RTL
                a.currentTime = ratio * duration;
              }}
            >
              <div
                className="h-full rounded-full transition-[width] relative"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(to left, var(--primary), var(--gold))",
                }}
              >
                <div
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "var(--gold)", boxShadow: "0 0 0 2px var(--bg-elev)" }}
                />
              </div>
            </div>
            <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)", minWidth: "42px" }}>
              {formatTime(duration)}
            </span>
          </div>

          {/* Reciter selector */}
          <select
            value={reciter}
            onChange={(e) => setReciter(e.target.value)}
            className="hidden lg:block py-2 px-3 rounded-lg text-xs cursor-pointer outline-none transition-colors max-w-[180px]"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <button className="icon-btn !w-9 !h-9" onClick={close} aria-label="إغلاق">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .verse-playing {
          background: linear-gradient(transparent, rgba(200, 169, 81, 0.35)) !important;
          border-radius: 6px;
          box-shadow: 0 0 0 2px rgba(200, 169, 81, 0.2);
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
