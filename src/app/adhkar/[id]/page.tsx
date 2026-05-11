import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ADHKAR, getCategoryById } from "@/lib/adhkar";
import { ArrowRight } from "lucide-react";
import { DhikrCounter } from "@/components/DhikrCounter";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return ADHKAR.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cat = getCategoryById(params.id);
  if (!cat) return { title: "غير موجود" };
  return {
    title: cat.title,
    description: cat.description,
  };
}

export default function AdhkarCategoryPage({ params }: PageProps) {
  const cat = getCategoryById(params.id);
  if (!cat) return notFound();

  return (
    <article className="max-w-4xl mx-auto px-5 py-8">
      <Link href="/adhkar" className="btn btn-outline mb-5 inline-flex">
        <ArrowRight className="w-4 h-4" />
        كل الأذكار
      </Link>

      <header
        className="rounded-3xl p-8 md:p-10 text-white text-center relative overflow-hidden mb-6"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-light))" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, white, transparent 50%)",
          }}
        />
        <div className="text-6xl mb-3 relative">{cat.icon}</div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 relative">{cat.title}</h1>
        <p className="opacity-95 relative">{cat.description}</p>
        <div className="inline-block mt-3 px-4 py-1 rounded-full text-sm bg-white/20 backdrop-blur relative">
          {cat.items.length} ذكر
        </div>
      </header>

      <div className="space-y-4">
        {cat.items.map((dhikr, i) => (
          <DhikrCounter key={i} dhikr={dhikr} index={i + 1} categoryId={cat.id} />
        ))}
      </div>
    </article>
  );
}
