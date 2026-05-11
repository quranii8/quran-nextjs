import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { QURAN_SCIENCES, getScience } from "@/lib/quran-sciences";
import { ArrowRight } from "lucide-react";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return QURAN_SCIENCES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const s = getScience(params.id);
  if (!s) return { title: "غير موجود" };
  return { title: s.title, description: s.shortDesc };
}

export default function ScienceDetailPage({ params }: PageProps) {
  const science = getScience(params.id);
  if (!science) return notFound();

  const idx = QURAN_SCIENCES.findIndex((s) => s.id === science.id);
  const prev = QURAN_SCIENCES[idx - 1];
  const next = QURAN_SCIENCES[idx + 1];

  return (
    <article className="max-w-4xl mx-auto px-5 py-8">
      <Link href="/quran-sciences" className="btn btn-outline mb-5 inline-flex">
        <ArrowRight className="w-4 h-4" />
        كل العلوم
      </Link>

      <header
        className="rounded-3xl p-8 md:p-10 text-white relative overflow-hidden mb-6"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
      >
        <div className="text-5xl mb-3">{science.icon}</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{science.title}</h1>
        <p className="opacity-95 text-base md:text-lg">{science.shortDesc}</p>
      </header>

      <div className="space-y-5">
        {science.content.map((section, i) => (
          <div key={i} className="card p-6 md:p-7">
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: "#7c3aed" }}
            >
              <span
                className="w-8 h-8 rounded-full grid place-items-center text-sm"
                style={{ background: "rgba(124,58,237,.12)" }}
              >
                {i + 1}
              </span>
              {section.heading}
            </h2>
            <p className="text-base leading-loose whitespace-pre-line">{section.text}</p>
          </div>
        ))}

        {science.examples && science.examples.length > 0 && (
          <div className="card p-6 md:p-7" style={{ borderRight: "4px solid #d97706" }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#d97706" }}>
              💡 أمثلة تطبيقية
            </h2>
            <div className="space-y-3">
              {science.examples.map((ex, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl"
                  style={{ background: "var(--bg-soft)" }}
                >
                  <div className="font-bold mb-2" style={{ color: "#d97706" }}>
                    {ex.title}
                  </div>
                  <p className="text-sm leading-relaxed">{ex.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* تنقل */}
      <div className="grid grid-cols-2 gap-3 mt-8">
        {prev ? (
          <Link href={`/quran-sciences/${prev.id}`} className="card p-4 flex items-center gap-3 hover:border-purple-600 transition">
            <ArrowRight className="w-5 h-5" />
            <div>
              <small className="block text-xs" style={{ color: "var(--text-muted)" }}>السابق</small>
              <div className="font-bold">{prev.title}</div>
            </div>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/quran-sciences/${next.id}`} className="card p-4 flex items-center gap-3 justify-end text-right hover:border-purple-600 transition">
            <div>
              <small className="block text-xs" style={{ color: "var(--text-muted)" }}>التالي</small>
              <div className="font-bold">{next.title}</div>
            </div>
            <span className="text-lg">←</span>
          </Link>
        ) : <div />}
      </div>
    </article>
  );
}
