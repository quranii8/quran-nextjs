export function QuickStats() {
  const stats = [
    { num: "١١٤", label: "سورة" },
    { num: "٨", label: "تفاسير" },
    { num: "٢٥", label: "نبياً" },
    { num: "٢٠+", label: "قارئاً" },
    { num: "٩٩", label: "اسماً" },
    { num: "١٠", label: "لغات" },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-5 py-8">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="card text-center p-4">
            <div className="text-xl md:text-2xl font-extrabold" style={{ color: "var(--primary)" }}>
              {s.num}
            </div>
            <div className="text-xs md:text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
