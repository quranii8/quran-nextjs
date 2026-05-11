import type { Metadata } from "next";
import Link from "next/link";
import { PROPHETS } from "@/lib/prophets";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "قصص الأنبياء",
  description: "قصص الأنبياء والمرسلين عليهم السلام من القرآن والسنة",
};

export default function ProphetsPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      {/* Header */}
      <header
        className="rounded-3xl p-8 md:p-10 text-white text-center relative overflow-hidden mb-8"
        style={{ background: "linear-gradient(135deg, #16a34a, #84cc16)" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, white, transparent 30%), radial-gradient(circle at 80% 70%, white, transparent 30%)",
          }}
        />
        <div className="relative">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">قصص الأنبياء عليهم السلام</h1>
          <p className="text-base md:text-lg opacity-95 max-w-2xl mx-auto">
            ﴿لَقَدْ كَانَ فِي قَصَصِهِمْ عِبْرَةٌ لِّأُولِي الْأَلْبَابِ﴾
          </p>
          <div className="text-sm opacity-80 mt-2">[يوسف: 111]</div>
          <div className="inline-block mt-5 px-5 py-2 rounded-full bg-white/20 backdrop-blur text-sm">
            قصص {PROPHETS.length} نبياً ورسولاً
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROPHETS.map((p, i) => (
          <Link
            key={p.id}
            href={`/prophets/${p.id}`}
            className="card p-5 transition-all hover:-translate-y-1 hover:shadow-lg group relative overflow-hidden"
          >
            <div
              className="absolute -top-12 -left-12 w-32 h-32 rounded-full opacity-10 transition-transform group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #16a34a, #84cc16)" }}
            />
            <div className="flex items-start gap-3 relative">
              <div
                className="w-14 h-14 rounded-xl grid place-items-center text-2xl shrink-0 font-bold text-white shadow-md transition-transform group-hover:scale-110"
                style={{ background: "linear-gradient(135deg, #16a34a, #84cc16)" }}
              >
                {p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-xl mb-0.5">{p.name}</h2>
                <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                  عليه السلام • {p.nameEn}
                </div>
                {p.title && (
                  <div
                    className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2"
                    style={{ background: "rgba(22,163,74,.15)", color: "#16a34a" }}
                  >
                    {p.title}
                  </div>
                )}
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--text-muted)" }}>
                  {p.story}
                </p>
                <div
                  className="mt-2 text-xs font-semibold flex items-center gap-1"
                  style={{ color: "#16a34a" }}
                >
                  اقرأ القصة
                  <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
