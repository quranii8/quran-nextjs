import type { Metadata } from "next";
import { PrayerTimesWidget } from "@/components/PrayerTimesWidget";

export const metadata: Metadata = {
  title: "مواقيت الصلاة",
  description: "مواقيت الصلاة الدقيقة حسب موقعك الجغرافي",
};

export default function PrayerTimesPage() {
  return (
    <section className="max-w-4xl mx-auto px-5 py-8">
      <div className="flex items-center gap-3 mb-2">
        <span
          className="w-1.5 h-8 rounded"
          style={{ background: "linear-gradient(to bottom, var(--primary), var(--gold))" }}
        />
        <h1 className="text-2xl md:text-3xl font-extrabold">🕌 مواقيت الصلاة</h1>
      </div>
      <p className="mb-8" style={{ color: "var(--text-muted)" }}>
        مواقيت الصلاة الدقيقة حسب موقعك الجغرافي — اسمح للموقع باستخدام مكانك للحصول على أوقات صحيحة.
      </p>

      <PrayerTimesWidget />
    </section>
  );
}
