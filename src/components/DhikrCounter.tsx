"use client";

import { useState } from "react";
import { RotateCcw, Check, Volume2, Copy } from "lucide-react";
import { Dhikr } from "@/lib/adhkar";
import { toArabicNum } from "@/lib/utils";

interface Props {
  dhikr: Dhikr;
  index: number;
  categoryId: string;
}

export function DhikrCounter({ dhikr, index }: Props) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  const progress = (count / dhikr.count) * 100;
  const isComplete = count >= dhikr.count;

  const handleClick = () => {
    if (isComplete) return;
    const newCount = count + 1;
    setCount(newCount);
    if (newCount >= dhikr.count) {
      setDone(true);
      // اهتزاز خفيف على الموبايل
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
    } else if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  const reset = () => {
    setCount(0);
    setDone(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(dhikr.text);
  };

  return (
    <div
      className="card overflow-hidden transition-all"
      style={{
        borderColor: done ? "var(--primary)" : "var(--border-soft)",
        borderWidth: done ? "2px" : "1px",
      }}
    >
      {/* Progress bar */}
      <div className="h-1 relative" style={{ background: "var(--border-soft)" }}>
        <div
          className="h-full transition-all duration-300 absolute right-0"
          style={{
            width: `${progress}%`,
            background: done
              ? "var(--primary)"
              : "linear-gradient(to left, var(--primary), var(--gold))",
          }}
        />
      </div>

      <div className="p-5 md:p-6">
        {/* رأس البطاقة */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full grid place-items-center text-sm font-bold"
              style={{
                background: done ? "var(--primary)" : "var(--primary-soft)",
                color: done ? "white" : "var(--primary)",
              }}
            >
              {done ? <Check className="w-5 h-5" /> : toArabicNum(index)}
            </div>
            <div>
              {dhikr.reference && (
                <div
                  className="text-xs font-semibold"
                  style={{ color: "var(--gold-dark)" }}
                >
                  📖 {dhikr.reference}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={copy}
              className="icon-btn !w-8 !h-8"
              title="نسخ"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={reset}
              className="icon-btn !w-8 !h-8"
              title="إعادة تصفير العدّاد"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* نص الذكر */}
        <p
          className="font-quran text-lg md:text-xl leading-loose mb-4"
          style={{ color: done ? "var(--text-soft)" : "var(--text)" }}
        >
          {dhikr.text}
        </p>

        {/* الفائدة */}
        {dhikr.benefit && (
          <div
            className="text-sm mb-4 p-3 rounded-lg"
            style={{
              background: "var(--bg-soft)",
              color: "var(--text-muted)",
              borderRight: "3px solid var(--gold)",
            }}
          >
            ✦ <strong style={{ color: "var(--gold-dark)" }}>الفضل:</strong> {dhikr.benefit}
          </div>
        )}

        {/* العدّاد التفاعلي */}
        <button
          onClick={handleClick}
          disabled={isComplete}
          className="w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 select-none"
          style={{
            background: done ? "var(--primary)" : "var(--primary-soft)",
            color: done ? "white" : "var(--primary)",
            cursor: isComplete ? "default" : "pointer",
          }}
          onTouchStart={(e) => {
            if (!isComplete) {
              e.currentTarget.style.transform = "scale(0.97)";
            }
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {done ? (
            <>
              <Check className="w-5 h-5" />
              تم بحمد الله ({toArabicNum(dhikr.count)})
            </>
          ) : (
            <>
              <span className="text-2xl">{toArabicNum(count)}</span>
              <span className="opacity-50">/</span>
              <span className="text-lg opacity-70">{toArabicNum(dhikr.count)}</span>
              <span className="text-xs opacity-70 mr-2">— اضغط للعدّ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
