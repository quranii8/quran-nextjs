import type { Metadata } from "next";
import { HADITH_QUDSI } from "@/lib/hadith-qudsi";
import { HadithQudsiBrowser } from "@/components/HadithQudsiBrowser";

export const metadata: Metadata = {
  title: "الأحاديث القدسية",
  description: "مختارات من الأحاديث القدسية الصحيحة عن النبي ﷺ",
};

export default function HadithQudsiPage() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      <header
        className="rounded-3xl p-8 md:p-10 text-white text-center relative overflow-hidden mb-8"
        style={{ background: "linear-gradient(135deg, #be185d, #f0abfc)" }}
      >
        <div className="text-5xl mb-3">✨</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">الأحاديث القدسية</h1>
        <p className="text-base md:text-lg opacity-95 max-w-2xl mx-auto">
          الأحاديث التي يرويها النبي ﷺ عن ربّه عز وجل
        </p>
        <div className="inline-block mt-5 px-5 py-2 rounded-full bg-white/20 backdrop-blur text-sm">
          {HADITH_QUDSI.length} حديثاً قدسياً مختاراً
        </div>
      </header>

      <div
        className="card p-5 mb-6"
        style={{ borderRight: "4px solid #be185d", background: "rgba(190,24,93,.04)" }}
      >
        <p className="text-sm leading-relaxed">
          ✦ <strong>تعريف الحديث القدسي:</strong> ما يرويه النبي ﷺ عن ربه تبارك وتعالى من
          غير القرآن. يختلف عن القرآن في أنه ليس متعبداً بتلاوته ولا معجزاً، لكنه وحي من الله.
        </p>
      </div>

      <HadithQudsiBrowser hadiths={HADITH_QUDSI} />
    </section>
  );
}
