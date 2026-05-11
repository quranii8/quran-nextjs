import type { Metadata } from "next";
import Link from "next/link";
import { getTajweedCategories } from "@/lib/tajweed";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "أحكام التجويد",
  description: "تعلّم أحكام التجويد مع الأمثلة من القرآن الكريم",
};

export default function TajweedPage() {
  const categories = getTajweedCategories();

  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      <header
        className="rounded-3xl p-8 md:p-10 text-white text-center relative overflow-hidden mb-8"
        style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
      >
        <div className="text-5xl mb-3">🎵</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">أحكام التجويد</h1>
        <p className="text-base md:text-lg opacity-95 max-w-2xl mx-auto">
          ﴿وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا﴾ — تعلّم أحكام التجويد مع أمثلة عملية
        </p>
        <div className="text-sm opacity-80 mt-2">[المزمل: 4]</div>
      </header>

      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-1.5 h-7 rounded"
                style={{ background: "linear-gradient(to bottom, #0ea5e9, #06b6d4)" }}
              />
              <h2 className="text-xl md:text-2xl font-extrabold">{cat.name}</h2>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                ({cat.rules.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.rules.map((rule) => (
                <Link
                  key={rule.id}
                  href={`/tajweed/${rule.id}`}
                  className="card p-5 transition-all hover:-translate-y-1 hover:shadow-md group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl grid place-items-center text-2xl shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: "rgba(14,165,233,.1)" }}
                    >
                      {rule.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base mb-1">{rule.title}</h3>
                      <p
                        className="text-xs leading-relaxed line-clamp-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {rule.shortDesc}
                      </p>
                      <div
                        className="mt-2 text-xs font-semibold flex items-center gap-1"
                        style={{ color: "#0ea5e9" }}
                      >
                        تعلّم
                        <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
