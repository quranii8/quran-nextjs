import type { Metadata } from "next";
import Link from "next/link";
import { ADHKAR } from "@/lib/adhkar";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "الأذكار والأدعية",
  description: "أذكار الصباح والمساء وما بعد الصلاة وأدعية مأثورة من حصن المسلم",
};

export default function AdhkarPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      <div className="flex items-center gap-3 mb-2">
        <span
          className="w-1.5 h-8 rounded"
          style={{ background: "linear-gradient(to bottom, var(--primary), var(--gold))" }}
        />
        <h1 className="text-2xl md:text-3xl font-extrabold">🤲 الأذكار والأدعية</h1>
      </div>
      <p className="mb-8 max-w-3xl" style={{ color: "var(--text-muted)" }}>
        مجموعة من الأذكار اليومية والأدعية المأثورة من القرآن الكريم والسنة النبوية، مع عدّاد تفاعلي وذكر للمصدر والفائدة.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ADHKAR.map((cat) => (
          <Link
            key={cat.id}
            href={`/adhkar/${cat.id}`}
            className="card p-6 transition-all hover:-translate-y-1 hover:shadow-lg group relative overflow-hidden"
          >
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 transition-transform group-hover:scale-110"
              style={{ background: "var(--primary)" }}
            />
            <div className="text-5xl mb-3 relative">{cat.icon}</div>
            <h2 className="text-xl font-bold mb-2 relative">{cat.title}</h2>
            <p className="text-sm mb-4 relative" style={{ color: "var(--text-muted)" }}>
              {cat.description}
            </p>
            <div className="flex items-center justify-between relative">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
              >
                {cat.items.length} ذكر
              </span>
              <span
                className="text-sm font-semibold flex items-center gap-1"
                style={{ color: "var(--primary)" }}
              >
                ابدأ
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* روابط سريعة لميزات أخرى */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/asma-allah"
          className="card p-5 flex items-center gap-3 transition-all hover:border-green-600"
        >
          <div className="text-3xl">✨</div>
          <div>
            <div className="font-bold">أسماء الله الحسنى</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>99 اسماً مع شرحها</div>
          </div>
        </Link>
        <Link
          href="/prayer-times"
          className="card p-5 flex items-center gap-3 transition-all hover:border-green-600"
        >
          <div className="text-3xl">🕌</div>
          <div>
            <div className="font-bold">مواقيت الصلاة</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>حسب موقعك</div>
          </div>
        </Link>
        <Link
          href="/qibla"
          className="card p-5 flex items-center gap-3 transition-all hover:border-green-600"
        >
          <div className="text-3xl">🧭</div>
          <div>
            <div className="font-bold">اتجاه القبلة</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>بوصلة تفاعلية</div>
          </div>
        </Link>
      </div>
    </section>
  );
}
