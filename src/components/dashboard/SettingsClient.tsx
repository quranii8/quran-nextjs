"use client";

import { useQuranStore } from "@/lib/store";
import { TAFASIR, TRANSLATIONS } from "@/lib/tafasir";
import { RECITERS } from "@/lib/reciters";
import { User, Palette, BookOpen, Mic, Globe } from "lucide-react";

interface Props {
  user: { name: string; email: string };
}

export function SettingsClient({ user }: Props) {
  const {
    theme,
    toggleTheme,
    fontSize,
    setFontSize,
    selectedTafsir,
    setTafsir,
    selectedTranslation,
    setTranslation,
    reciter,
    setReciter,
    showTranslation,
    toggleTranslation,
  } = useQuranStore();

  return (
    <div className="space-y-5">
      {/* الحساب */}
      <Section title="الحساب" icon={<User className="w-5 h-5" />}>
        <Field label="الاسم">
          <div className="font-medium">{user.name || "—"}</div>
        </Field>
        <Field label="البريد الإلكتروني">
          <div className="font-medium text-sm" dir="ltr">{user.email}</div>
        </Field>
      </Section>

      {/* المظهر */}
      <Section title="المظهر" icon={<Palette className="w-5 h-5" />}>
        <Field label="الوضع">
          <div className="flex gap-2">
            <button
              onClick={() => theme === "dark" && toggleTheme()}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{
                background: theme === "light" ? "var(--primary)" : "var(--bg-soft)",
                color: theme === "light" ? "white" : "var(--text-muted)",
              }}
            >
              ☀️ نهاري
            </button>
            <button
              onClick={() => theme === "light" && toggleTheme()}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{
                background: theme === "dark" ? "var(--primary)" : "var(--bg-soft)",
                color: theme === "dark" ? "white" : "var(--text-muted)",
              }}
            >
              🌙 ليلي
            </button>
          </div>
        </Field>
        <Field label={`حجم الخط (${fontSize.toFixed(1)}rem)`}>
          <input
            type="range"
            min="1.2"
            max="2.6"
            step="0.1"
            value={fontSize}
            onChange={(e) => setFontSize(parseFloat(e.target.value))}
            className="w-full"
            style={{ accentColor: "var(--primary)" }}
          />
        </Field>
      </Section>

      {/* القراءة */}
      <Section title="القراءة" icon={<BookOpen className="w-5 h-5" />}>
        <Field label="التفسير الافتراضي">
          <select
            value={selectedTafsir}
            onChange={(e) => setTafsir(e.target.value)}
            className="w-full p-2.5 rounded-lg text-sm outline-none"
            style={{ background: "var(--bg-soft)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {TAFASIR.map((t) => (
              <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
            ))}
          </select>
        </Field>
        <Field label="إظهار الترجمة تلقائياً">
          <button
            onClick={toggleTranslation}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              background: showTranslation ? "var(--primary)" : "var(--bg-soft)",
              color: showTranslation ? "white" : "var(--text-muted)",
            }}
          >
            {showTranslation ? "✓ مفعّل" : "معطّل"}
          </button>
        </Field>
      </Section>

      {/* الترجمة */}
      <Section title="الترجمة" icon={<Globe className="w-5 h-5" />}>
        <Field label="اللغة الافتراضية">
          <select
            value={selectedTranslation}
            onChange={(e) => setTranslation(e.target.value)}
            className="w-full p-2.5 rounded-lg text-sm outline-none"
            style={{ background: "var(--bg-soft)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {TRANSLATIONS.map((t) => (
              <option key={t.id} value={t.id}>{t.flag} {t.language} — {t.name}</option>
            ))}
          </select>
        </Field>
      </Section>

      {/* القارئ */}
      <Section title="الاستماع" icon={<Mic className="w-5 h-5" />}>
        <Field label="القارئ الافتراضي">
          <select
            value={reciter}
            onChange={(e) => setReciter(e.target.value)}
            className="w-full p-2.5 rounded-lg text-sm outline-none"
            style={{ background: "var(--bg-soft)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>{r.name} — {r.country}</option>
            ))}
          </select>
        </Field>
      </Section>

      <div
        className="p-4 rounded-xl text-xs leading-relaxed text-center"
        style={{ background: "var(--bg-soft)", color: "var(--text-muted)" }}
      >
        ✦ التغييرات تُحفظ تلقائياً على جهازك. التزامن مع حسابك يحفظ المحفوظات والملاحظات فقط.
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--primary)" }}>
        {icon} {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      {children}
    </div>
  );
}
