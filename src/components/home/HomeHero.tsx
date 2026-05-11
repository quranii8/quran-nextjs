"use client";

import Link from "next/link";
import { Play, Headphones, BookOpen } from "lucide-react";
import { SearchBar } from "../SearchBar";

export function HomeHero() {
  return (
    <section className="relative max-w-7xl mx-auto px-5 pt-12 pb-8 text-center overflow-hidden">
      {/* زخارف خلفية ناعمة */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gold)" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
      </div>

      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
        style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
      >
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: "var(--primary)" }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: "var(--primary)" }}
          />
        </span>
        منصة إسلامية متكاملة
      </div>

      <h1
        className="font-extrabold leading-tight mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
        style={{
          backgroundImage: "linear-gradient(135deg, var(--primary), var(--gold-dark))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        رحلتك مع كتاب الله تبدأ هنا
      </h1>

      <p
        className="max-w-2xl mx-auto text-base md:text-lg mb-7"
        style={{ color: "var(--text-muted)" }}
      >
        قرآن بالخط العثماني، تلاوات لـ <strong style={{ color: "var(--primary)" }}>20+ قارئاً</strong> بدون انقطاع،
        و <strong style={{ color: "var(--primary)" }}>8 تفاسير</strong>،
        أذكار، أسماء الله الحسنى، مواقيت الصلاة، واتجاه القبلة.
      </p>

      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/surah/1" className="btn btn-primary">
          <Play className="w-4 h-4" />
          ابدأ القراءة
        </Link>
        <Link href="/reciters" className="btn btn-outline">
          <Headphones className="w-4 h-4" />
          استمع الآن
        </Link>
        <Link href="/tafsir" className="btn btn-outline">
          <BookOpen className="w-4 h-4" />
          استكشف التفاسير
        </Link>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap gap-2 justify-center mt-8 text-xs">
        {[
          { emoji: "🤲", label: "أذكار" },
          { emoji: "✨", label: "أسماء الله" },
          { emoji: "🕌", label: "مواقيت الصلاة" },
          { emoji: "🧭", label: "اتجاه القبلة" },
          { emoji: "🌙", label: "وضع ليلي" },
          { emoji: "★", label: "محفوظات" },
        ].map((f, i) => (
          <span
            key={i}
            className="px-3 py-1.5 rounded-full font-semibold"
            style={{
              background: "var(--bg-soft)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
          >
            {f.emoji} {f.label}
          </span>
        ))}
      </div>
    </section>
  );
}
