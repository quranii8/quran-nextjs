import Link from "next/link";
import { RECITERS } from "@/lib/reciters";
import { ChevronLeft, Mic } from "lucide-react";
import { ReciterAvatar } from "@/components/ReciterAvatar";

export function RecitersHighlight() {
  const featured = RECITERS.slice(0, 8);

  return (
    <section className="relative max-w-7xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <span
            className="w-1.5 h-7 rounded"
            style={{ background: "linear-gradient(to bottom, var(--primary), var(--gold))" }}
          />
          <h2 className="text-xl md:text-2xl font-extrabold">🎙️ أبرز القراء</h2>
        </div>
        <Link
          href="/reciters"
          className="text-sm font-semibold flex items-center gap-1"
          style={{ color: "var(--primary)" }}
        >
          عرض الجميع
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {featured.map((r) => (
          <Link
            key={r.id}
            href={`/reciters/${encodeURIComponent(r.id)}`}
            className="card p-5 text-center transition-all hover:-translate-y-1 group"
          >
            <div className="flex justify-center mb-3">
              <ReciterAvatar
                name={r.name}
                imageUrl={r.image}
                size={80}
                ring
                className="transition-transform group-hover:scale-105 shadow-md"
              />
            </div>
            <div className="font-bold text-sm leading-tight">{r.name}</div>
            <div className="text-xs mt-1.5 flex items-center justify-center gap-1" style={{ color: "var(--text-muted)" }}>
              <Mic className="w-3 h-3" />
              {r.country}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
