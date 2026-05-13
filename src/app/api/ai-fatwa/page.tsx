import type { Metadata } from “next”;
import { AiFatwaChat } from “@/components/AiFatwaChat”;
import { Sparkles, BookOpen, ShieldCheck, MessagesSquare } from “lucide-react”;

export const metadata: Metadata = {
title: “المساعد الديني الذكي — نور الفقه”,
description:
“اسأل أي سؤال ديني واحصل على إجابة علمية موثقة من القرآن الكريم والسنة النبوية وأقوال العلماء”,
};

const FEATURES = [
{
icon: <BookOpen className="w-5 h-5" />,
title: “مصادر موثقة”,
desc: “إجابات مدعومة بآيات وأحاديث صحيحة مع ذكر المصادر”,
},
{
icon: <MessagesSquare className="w-5 h-5" />,
title: “آراء المذاهب”,
desc: “يعرض آراء المذاهب الأربعة عند الاختلاف الفقهي”,
},
{
icon: <ShieldCheck className="w-5 h-5" />,
title: “دقة علمية”,
desc: “يستند لكبار العلماء كالنووي وابن تيمية وابن القيم”,
},
{
icon: <Sparkles className="w-5 h-5" />,
title: “محادثة متواصلة”,
desc: “يتذكر سياق المحادثة للأسئلة المتعلقة ببعضها”,
},
];

export default function AiFatwaPage() {
return (
<section className="max-w-7xl mx-auto px-5 py-8">
{/* Page Header */}
<div className="flex items-center gap-3 mb-2">
<span
className=“w-1.5 h-8 rounded”
style={{ background: “linear-gradient(to bottom, var(–primary), var(–gold))” }}
/>
<h1 className="text-2xl md:text-3xl font-extrabold">🤖 المساعد الديني الذكي</h1>
</div>
<p className=“mb-8 max-w-2xl” style={{ color: “var(–text-muted)” }}>
اسأل أي سؤال ديني وسيجيبك مساعدنا الإسلامي المدعوم بالذكاء الاصطناعي بإجابة علمية موثقة
من القرآن والسنة وأقوال العلماء.
</p>

```
  {/* Feature Cards */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
    {FEATURES.map((f) => (
      <div
        key={f.title}
        className="card p-4 flex flex-col gap-2"
      >
        <div
          className="w-9 h-9 rounded-lg grid place-items-center"
          style={{
            background: "var(--primary-soft)",
            color: "var(--primary)",
          }}
        >
          {f.icon}
        </div>
        <div className="font-bold text-sm">{f.title}</div>
        <div className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {f.desc}
        </div>
      </div>
    ))}
  </div>

  {/* Chat Interface */}
  <AiFatwaChat />

  {/* Disclaimer */}
  <div
    className="mt-6 p-4 rounded-xl text-sm text-center"
    style={{
      background: "var(--bg-soft)",
      border: "1px solid var(--border-soft)",
      color: "var(--text-muted)",
    }}
  >
    ⚠️ <strong>تنبيه مهم:</strong> إجابات هذا المساعد للتوعية العلمية العامة فقط. للمسائل
    الفقهية الدقيقة أو القضايا الشخصية المعقدة يُرجى مراجعة عالم أو مفتٍ متخصص.
  </div>
</section>
```

);
}