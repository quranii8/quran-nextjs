import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookmarkCheck, FileText, Clock, Award, BookOpen, Settings } from "lucide-react";
import { getSurah } from "@/lib/surahs";
import { toArabicNum } from "@/lib/utils";

export const metadata = {
  title: "لوحة التحكم",
  description: "لوحة التحكم الشخصية",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const userId = (session.user as any).id;

  const [bookmarksCount, notesCount, recentBookmarks, recentNotes, history] = await Promise.all([
    prisma.bookmark.count({ where: { userId } }),
    prisma.note.count({ where: { userId } }),
    prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.readingLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const uniqueSurahs = new Set(history.map((h) => h.surah)).size;
  const totalReadingTime = history.reduce((sum, h) => sum + (h.duration || 0), 0);

  return (
    <section className="max-w-6xl mx-auto px-5 py-8">
      {/* Welcome */}
      <div
        className="rounded-3xl p-8 text-white mb-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--gold-dark))" }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white, transparent 50%)" }} />
        <div className="relative">
          <div className="text-sm opacity-90 mb-1">مرحباً بك يا</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            {session.user.name || session.user.email?.split("@")[0]}
          </h1>
          <p className="opacity-95 text-sm md:text-base">
            هذه لوحة تحكمك الشخصية — تابع رحلتك مع كتاب الله 🌿
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={<BookmarkCheck className="w-6 h-6" />}
          label="الآيات المحفوظة"
          value={toArabicNum(bookmarksCount)}
          color="#16a34a"
        />
        <StatCard
          icon={<FileText className="w-6 h-6" />}
          label="الملاحظات"
          value={toArabicNum(notesCount)}
          color="#0ea5e9"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          label="سور قرأتها"
          value={toArabicNum(uniqueSurahs)}
          color="#7c3aed"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="وقت القراءة"
          value={`${toArabicNum(Math.floor(totalReadingTime / 60))} د`}
          color="#d97706"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <QuickAction href="/surah/1" icon="📖" label="ابدأ قراءة" />
        <QuickAction href="/bookmarks" icon="★" label="محفوظاتي" />
        <QuickAction href="/dashboard/notes" icon="📝" label="ملاحظاتي" />
        <QuickAction href="/dashboard/settings" icon="⚙️" label="الإعدادات" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Bookmarks */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5" style={{ color: "var(--primary)" }} />
              آخر المحفوظات
            </h2>
            <Link href="/bookmarks" className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
              عرض الكل ←
            </Link>
          </div>
          {recentBookmarks.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>
              لم تحفظ أي آية بعد
            </p>
          ) : (
            <div className="space-y-2">
              {recentBookmarks.map((b) => {
                const s = getSurah(b.surah);
                return (
                  <Link
                    key={b.id}
                    href={`/surah/${b.surah}#verse-${b.verse}`}
                    className="block p-3 rounded-lg transition-colors hover:bg-green-50 dark:hover:bg-green-900/10"
                    style={{ borderRight: "3px solid var(--gold)" }}
                  >
                    <div className="font-bold text-sm mb-1">
                      {s?.a} : {toArabicNum(b.verse)}
                    </div>
                    <div className="text-xs line-clamp-2 font-quran" style={{ color: "var(--text-muted)" }}>
                      {b.text}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Notes */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" style={{ color: "var(--primary)" }} />
              آخر الملاحظات
            </h2>
            <Link href="/dashboard/notes" className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
              عرض الكل ←
            </Link>
          </div>
          {recentNotes.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>
              لا توجد ملاحظات بعد
            </p>
          ) : (
            <div className="space-y-2">
              {recentNotes.map((n) => {
                const s = getSurah(n.surah);
                return (
                  <Link
                    key={n.id}
                    href={`/surah/${n.surah}#verse-${n.verse}`}
                    className="block p-3 rounded-lg transition-colors hover:bg-green-50 dark:hover:bg-green-900/10"
                    style={{ borderRight: "3px solid var(--primary)" }}
                  >
                    <div className="font-bold text-sm mb-1">
                      {s?.a} : {toArabicNum(n.verse)}
                    </div>
                    <div className="text-xs line-clamp-2" style={{ color: "var(--text-muted)" }}>
                      {n.content}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-8 card p-6">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" style={{ color: "var(--gold-dark)" }} />
          الإنجازات
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <Achievement title="القارئ المبتدئ" description="قرأت أول سورة" achieved={uniqueSurahs >= 1} icon="🌱" />
          <Achievement title="القارئ النشيط" description="قرأت 10 سور" achieved={uniqueSurahs >= 10} icon="📖" />
          <Achievement title="الحافظ" description="حفظت 10 آيات" achieved={bookmarksCount >= 10} icon="★" />
          <Achievement title="المتأمّل" description="كتبت 5 ملاحظات" achieved={notesCount >= 5} icon="✍️" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="card p-4 text-center">
      <div
        className="w-12 h-12 mx-auto mb-2 rounded-xl grid place-items-center"
        style={{ background: `${color}15`, color }}
      >
        {icon}
      </div>
      <div className="text-2xl font-extrabold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
    </div>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="card p-4 flex items-center gap-3 transition-all hover:-translate-y-0.5 hover:border-green-600"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-bold text-sm">{label}</span>
    </Link>
  );
}

function Achievement({ title, description, achieved, icon }: { title: string; description: string; achieved: boolean; icon: string }) {
  return (
    <div
      className="p-4 rounded-xl text-center transition-all"
      style={{
        background: achieved ? "var(--primary-soft)" : "var(--bg-soft)",
        opacity: achieved ? 1 : 0.5,
        border: achieved ? "2px solid var(--primary)" : "1px solid var(--border)",
      }}
    >
      <div className="text-3xl mb-1" style={{ filter: achieved ? "none" : "grayscale(100%)" }}>
        {icon}
      </div>
      <div className="font-bold text-xs mb-0.5">{title}</div>
      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{description}</div>
      {achieved && (
        <div className="text-[10px] font-bold mt-1" style={{ color: "var(--primary)" }}>✓ مُنجز</div>
      )}
    </div>
  );
}
