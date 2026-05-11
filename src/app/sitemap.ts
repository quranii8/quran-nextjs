import type { MetadataRoute } from "next";
import { SURAHS } from "@/lib/surahs";
import { TAFASIR } from "@/lib/tafasir";
import { RECITERS } from "@/lib/reciters";
import { ADHKAR } from "@/lib/adhkar";
import { PROPHETS } from "@/lib/prophets";
import { QURAN_SCIENCES } from "@/lib/quran-sciences";
import { TAJWEED_RULES } from "@/lib/tajweed";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://quran.example.com";
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, priority: 1, changeFrequency: "daily" },
    { url: `${base}/surahs`, lastModified: now, priority: 0.9 },
    { url: `${base}/tafsir`, lastModified: now, priority: 0.9 },
    { url: `${base}/reciters`, lastModified: now, priority: 0.8 },
    { url: `${base}/adhkar`, lastModified: now, priority: 0.85 },
    { url: `${base}/asma-allah`, lastModified: now, priority: 0.85 },
    { url: `${base}/prayer-times`, lastModified: now, priority: 0.85 },
    { url: `${base}/qibla`, lastModified: now, priority: 0.8 },
    { url: `${base}/prophets`, lastModified: now, priority: 0.85 },
    { url: `${base}/quran-sciences`, lastModified: now, priority: 0.85 },
    { url: `${base}/tajweed`, lastModified: now, priority: 0.85 },
    { url: `${base}/hadith-qudsi`, lastModified: now, priority: 0.85 },
    { url: `${base}/bookmarks`, lastModified: now, priority: 0.5 },
    { url: `${base}/about`, lastModified: now, priority: 0.5 },
    { url: `${base}/auth/signin`, lastModified: now, priority: 0.4 },
    ...SURAHS.map((s) => ({
      url: `${base}/surah/${s.n}`,
      lastModified: now,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...TAFASIR.map((t) => ({
      url: `${base}/tafsir/${encodeURIComponent(t.id)}`,
      lastModified: now,
      priority: 0.7,
    })),
    ...RECITERS.map((r) => ({
      url: `${base}/reciters/${encodeURIComponent(r.id)}`,
      lastModified: now,
      priority: 0.6,
    })),
    ...ADHKAR.map((c) => ({
      url: `${base}/adhkar/${c.id}`,
      lastModified: now,
      priority: 0.7,
    })),
    ...PROPHETS.map((p) => ({
      url: `${base}/prophets/${p.id}`,
      lastModified: now,
      priority: 0.75,
    })),
    ...QURAN_SCIENCES.map((s) => ({
      url: `${base}/quran-sciences/${s.id}`,
      lastModified: now,
      priority: 0.7,
    })),
    ...TAJWEED_RULES.map((r) => ({
      url: `${base}/tajweed/${r.id}`,
      lastModified: now,
      priority: 0.7,
    })),
  ];
}
