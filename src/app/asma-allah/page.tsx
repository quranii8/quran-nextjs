import type { Metadata } from "next";
import { ASMA_ALLAH } from "@/lib/asma-allah";
import { AsmaAllahBrowser } from "@/components/AsmaAllahBrowser";

export const metadata: Metadata = {
  title: "أسماء الله الحسنى",
  description: "أسماء الله الحسنى التسعة والتسعون مع الشرح والمعنى",
};

export default function AsmaAllahPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      {/* Header مزخرف */}
      <header
        className="rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden mb-8"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--gold-dark))" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, white 0%, transparent 30%),
              radial-gradient(circle at 80% 70%, white 0%, transparent 30%)
            `,
          }}
        />
        <div className="relative">
          <div className="text-5xl mb-3">✨</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">أسماء الله الحسنى</h1>
          <p className="text-base md:text-lg opacity-95 max-w-2xl mx-auto">
            ﴿وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا﴾
          </p>
          <div className="text-sm opacity-80 mt-2">[الأعراف: 180]</div>
          <div className="inline-block mt-5 px-5 py-2 rounded-full bg-white/20 backdrop-blur text-sm">
            {ASMA_ALLAH.length} اسماً مع الشرح
          </div>
        </div>
      </header>

      <AsmaAllahBrowser names={ASMA_ALLAH} />
    </section>
  );
}
