import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { TAJWEED_RULES, getTajweedRule } from "@/lib/tajweed";
import { ArrowRight } from "lucide-react";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return TAJWEED_RULES.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const r = getTajweedRule(params.id);
  if (!r) return { title: "غير موجود" };
  return { title: r.title, description: r.shortDesc };
}

export default function TajweedRulePage({ params }: PageProps) {
  const rule = getTajweedRule(params.id);
  if (!rule) return notFound();

  return (
    <article className="max-w-4xl mx-auto px-5 py-8">
      <Link href="/tajweed" className="btn btn-outline mb-5 inline-flex">
        <ArrowRight className="w-4 h-4" />
        كل الأحكام
      </Link>

      <header
        className="rounded-3xl p-8 md:p-10 text-white relative overflow-hidden mb-6"
        style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
      >
        <div className="text-sm opacity-90 mb-1">{rule.category}</div>
        <div className="text-5xl mb-3">{rule.icon}</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{rule.title}</h1>
        <p className="opacity-95 text-base md:text-lg">{rule.shortDesc}</p>
      </header>

      {/* التعريف */}
      <div className="card p-6 md:p-8 mb-5">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#0ea5e9" }}>
          📖 التعريف
        </h2>
        <p className="text-base leading-loose">{rule.definition}</p>
      </div>

      {/* الأمثلة */}
      <div className="card p-6 md:p-8 mb-5">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--gold-dark)" }}>
          ✨ أمثلة من القرآن
        </h2>
        <div className="space-y-4">
          {rule.examples.map((ex, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl"
              style={{ background: "var(--bg-soft)", borderRight: "4px solid var(--gold)" }}
            >
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{ background: "var(--gold)", color: "white" }}
              >
                {ex.rule}
              </div>
              <div
                className="font-quran text-3xl md:text-4xl leading-loose text-center my-4"
                style={{ color: "var(--primary)" }}
              >
                {ex.example}
              </div>
              <p className="text-sm leading-relaxed text-center" style={{ color: "var(--text-muted)" }}>
                {ex.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ملاحظات */}
      {rule.notes && (
        <div
          className="card p-5 md:p-6 mb-5"
          style={{ borderRight: "4px solid #d97706", background: "rgba(217,119,6,.04)" }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-bold mb-2" style={{ color: "#d97706" }}>ملاحظة مهمة</div>
              <p className="text-sm leading-relaxed">{rule.notes}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
