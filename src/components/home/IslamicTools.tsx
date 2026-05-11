import Link from "next/link";

interface Tool {
  href: string;
  icon: string;
  title: string;
  desc: string;
  gradient: string;
}

const TOOLS: Tool[] = [
  {
    href: "/adhkar",
    icon: "🤲",
    title: "الأذكار والأدعية",
    desc: "أذكار الصباح والمساء وأذكار الصلاة والنوم مع عدّاد تفاعلي",
    gradient: "linear-gradient(135deg, #16a34a, #84cc16)",
  },
  {
    href: "/asma-allah",
    icon: "✨",
    title: "أسماء الله الحسنى",
    desc: "الأسماء التسعة والتسعون مع شرح المعنى والدلالة لكل اسم",
    gradient: "linear-gradient(135deg, #d97706, #f59e0b)",
  },
  {
    href: "/prayer-times",
    icon: "🕌",
    title: "مواقيت الصلاة",
    desc: "مواقيت دقيقة حسب موقعك مع عدّ تنازلي للصلاة القادمة",
    gradient: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
  },
  {
    href: "/qibla",
    icon: "🧭",
    title: "اتجاه القبلة",
    desc: "بوصلة احترافية تتبع حركة جهازك لتحديد اتجاه الكعبة المشرفة",
    gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
  },
];

export function IslamicTools() {
  return (
    <section className="relative max-w-7xl mx-auto px-5 py-10">
      <div className="flex items-center gap-3 mb-2">
        <span
          className="w-1.5 h-7 rounded"
          style={{ background: "linear-gradient(to bottom, var(--primary), var(--gold))" }}
        />
        <h2 className="text-xl md:text-2xl font-extrabold">🌟 أدوات إسلامية متكاملة</h2>
      </div>
      <p className="mb-6 text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
        أدوات تساعدك في يومك: الأذكار، أسماء الله، مواقيت الصلاة، واتجاه القبلة — كل ذلك في مكان واحد.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="card p-6 transition-all hover:-translate-y-1 hover:shadow-lg group relative overflow-hidden"
          >
            <div
              className="absolute -top-12 -left-12 w-32 h-32 rounded-full opacity-15 transition-transform group-hover:scale-150"
              style={{ background: t.gradient }}
            />
            <div
              className="w-14 h-14 rounded-2xl text-3xl mb-4 grid place-items-center text-white shadow-md transition-transform group-hover:scale-110 relative"
              style={{ background: t.gradient }}
            >
              {t.icon}
            </div>
            <h3 className="font-bold text-lg mb-2 relative">{t.title}</h3>
            <p className="text-sm leading-relaxed relative" style={{ color: "var(--text-muted)" }}>
              {t.desc}
            </p>
            <div
              className="mt-4 text-sm font-semibold flex items-center gap-1 relative transition-all group-hover:gap-2"
              style={{ color: "var(--primary)" }}
            >
              ابدأ الآن ←
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
