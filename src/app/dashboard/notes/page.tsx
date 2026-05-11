import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowRight, FileText } from "lucide-react";
import { getSurah } from "@/lib/surahs";
import { toArabicNum } from "@/lib/utils";
import { NotesClient } from "@/components/dashboard/NotesClient";

export const metadata = { title: "ملاحظاتي" };
export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin?callbackUrl=/dashboard/notes");

  const userId = (session.user as any).id;
  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <section className="max-w-4xl mx-auto px-5 py-8">
      <Link href="/dashboard" className="btn btn-outline mb-5 inline-flex">
        <ArrowRight className="w-4 h-4" />
        لوحة التحكم
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <span className="w-1.5 h-8 rounded" style={{ background: "linear-gradient(to bottom, var(--primary), var(--gold))" }} />
        <h1 className="text-2xl md:text-3xl font-extrabold">📝 ملاحظاتي</h1>
      </div>
      <p className="mb-6" style={{ color: "var(--text-muted)" }}>
        ملاحظاتك التأملية على آيات القرآن الكريم.
      </p>

      <NotesClient initialNotes={notes.map((n) => ({
        id: n.id,
        surah: n.surah,
        verse: n.verse,
        content: n.content,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
        surahName: getSurah(n.surah)?.a || "",
      }))} />
    </section>
  );
}
