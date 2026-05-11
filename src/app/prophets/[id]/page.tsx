import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PROPHETS, getProphet } from "@/lib/prophets";
import { ArrowRight, MapPin, Clock, Users, Lightbulb, BookOpen } from "lucide-react";
import { getSurah } from "@/lib/surahs";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return PROPHETS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = getProphet(params.id);
  if (!p) return { title: "غير موجود" };
  return {
    title: `قصة ${p.name} عليه السلام`,
    description: p.story.slice(0, 160),
  };
}

export default function ProphetPage({ params }: PageProps) {
  const prophet = getProphet(params.id);
  if (!prophet) return notFound();

  const idx = PROPHETS.findIndex((p) => p.id === prophet.id);
  const prev = PROPHETS[idx - 1];
  const next = PROPHETS[idx + 1];

  return (
    <article className="max-w-4xl mx-auto px-5 py-8">
      <Link href="/prophets" className="btn btn-outline mb-5 inline-flex">
        <ArrowRight className="w-4 h-4" />
        كل الأنبياء
      </Link>

      {/* Header */}
      <header
        className="rounded-3xl p-8 md:p-10 text-white relative overflow-hidden mb-6"
        style={{ background: "linear-gradient(135deg, #16a34a, #84cc16)" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, white, transparent 50%)",
          }}
        />
        <div className="relative">
          <div className="text-sm opacity-90 mb-1">قصة النبي</div>
          <h1 className="font-quran text-5xl md:text-6xl font-bold mb-1">{prophet.name}</h1>
          <div className="opacity-90 text-base mb-3">عليه السلام — {prophet.nameEn}</div>
          {prophet.title && (
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur text-sm">
              {prophet.title}
            </div>
          )}
          <div className="flex flex-wrap justify-start gap-3 mt-5 text-sm opacity-90">
            {prophet.era && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {prophet.era}
              </span>
            )}
            {prophet.people && (
              <span className="inline-flex items-center gap-1">
                <Users className="w-4 h-4" />
                {prophet.people}
              </span>
            )}
            {prophet.burial && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {prophet.burial}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* القصة */}
      <div className="card p-6 md:p-8 mb-5">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#16a34a" }}>
          📖 القصة
        </h2>
        <p className="text-base md:text-lg leading-loose">{prophet.story}</p>
      </div>

      {/* الدروس */}
      <div className="card p-6 md:p-8 mb-5" style={{ borderRight: "4px solid var(--gold)" }}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--gold-dark)" }}>
          <Lightbulb className="w-6 h-6" />
          الدروس المستفادة
        </h2>
        <ul className="space-y-2">
          {prophet.lessons.map((l, i) => (
            <li key={i} className="flex items-start gap-3 text-base leading-relaxed">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full grid place-items-center text-xs font-bold"
                style={{ background: "var(--gold)", color: "#fff" }}
              >
                {i + 1}
              </span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* مواضع ذكره في القرآن */}
      <div className="card p-6 md:p-8 mb-5">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--primary)" }}>
          <BookOpen className="w-6 h-6" />
          مواضع ذكره في القرآن
        </h2>
        <div className="space-y-2 mb-4">
          {prophet.quranRefs.map((ref, i) => (
            <div
              key={i}
              className="p-3 rounded-lg flex items-center justify-between"
              style={{ background: "var(--bg-soft)" }}
            >
              <div>
                <span className="font-bold">سورة {ref.surah}</span>
                <span className="text-sm mr-2" style={{ color: "var(--text-muted)" }}>
                  — الآيات {ref.verses}
                </span>
              </div>
            </div>
          ))}
        </div>

        {prophet.surahs && prophet.surahs.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="text-xs font-semibold mb-2 w-full" style={{ color: "var(--text-muted)" }}>
              السور التي تحكي قصته:
            </div>
            {prophet.surahs.map((sn) => {
              const s = getSurah(sn);
              if (!s) return null;
              return (
                <Link
                  key={sn}
                  href={`/surah/${sn}`}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:-translate-y-0.5"
                  style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
                >
                  📖 {s.a}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* تنقل */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {prev ? (
          <Link href={`/prophets/${prev.id}`} className="card p-4 flex items-center gap-3 hover:border-green-600 transition">
            <ArrowRight className="w-5 h-5" />
            <div>
              <small className="block text-xs" style={{ color: "var(--text-muted)" }}>السابق</small>
              <div className="font-bold">{prev.name}</div>
            </div>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/prophets/${next.id}`} className="card p-4 flex items-center gap-3 justify-end text-right hover:border-green-600 transition">
            <div>
              <small className="block text-xs" style={{ color: "var(--text-muted)" }}>التالي</small>
              <div className="font-bold">{next.name}</div>
            </div>
            <span className="text-lg">←</span>
          </Link>
        ) : <div />}
      </div>
    </article>
  );
}
