import type { Metadata } from "next";
import Link from "next/link";
import { QURAN_SCIENCES } from "@/lib/quran-sciences";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "علوم القرآن",
  description: "أصول علوم القرآن: أسباب النزول، المكي والمدني، الناسخ والمنسوخ، إعجاز القرآن، وغيرها",
};

export default function QuranSciencesPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      <header
        className="rounded-3xl p-8 md:p-10 text-white text-center relative overflow-hidden mb-8"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 30%, white, transparent 40%)",
          }}
        />
        <div className="relative">
          <div className="text-5xl mb-3">📖</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">علوم القرآن الكريم</h1>
          <p className="text-base md:text-lg opacity-95 max-w-2xl mx-auto">
            الأصول والمعارف التي يحتاجها كل مسلم لفهم كتاب الله
          </p>
          <div className="inline-block mt-5 px-5 py-2 rounded-full bg-white/20 backdrop-blur text-sm">
            {QURAN_SCIENCES.length} علوم رئيسية
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QURAN_SCIENCES.map((s) => (
          <Link
            key={s.id}
            href={`/quran-sciences/${s.id}`}
            className="card p-6 transition-all hover:-translate-y-1 hover:shadow-lg group"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl grid place-items-center text-3xl shrink-0 transition-transform group-hover:scale-110"
                style={{ background: "rgba(124,58,237,.12)" }}
              >
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg mb-1">{s.title}</h2>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>
                  {s.shortDesc}
                </p>
                <div
                  className="text-sm font-semibold flex items-center gap-1"
                  style={{ color: "#7c3aed" }}
                >
                  استكشف
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
