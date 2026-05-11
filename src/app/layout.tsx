import type { Metadata, Viewport } from "next";
import { Amiri, Noto_Kufi_Arabic, Noto_Naskh_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ThemeApplier } from "@/components/ThemeApplier";
import { SessionProvider } from "@/components/auth/SessionProvider";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const notoKufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-kufi",
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-naskh",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "منصة القرآن الكريم — اقرأ • استمع • تدبّر",
    template: "%s | منصة القرآن الكريم",
  },
  description:
    "منصة إسلامية متكاملة للقرآن الكريم: قراءة بالخط العثماني، استماع لأشهر القراء، 8 تفاسير معتمدة، أذكار، أسماء الله الحسنى، مواقيت الصلاة، اتجاه القبلة، قصص الأنبياء، وعلوم القرآن.",
  keywords: ["القرآن الكريم", "تفسير", "أذكار", "أسماء الله", "قصص الأنبياء", "علوم القرآن", "مواقيت الصلاة", "Quran"],
  openGraph: {
    title: "منصة القرآن الكريم",
    description: "رحلتك مع كتاب الله تبدأ هنا",
    locale: "ar_SA",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1B5E20" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0F0B" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${notoKufi.variable} ${notoNaskh.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <SessionProvider>
          <ThemeApplier />
          <Header />
          <main className="relative z-10 pb-32">{children}</main>
          <Footer />
          <AudioPlayer />
        </SessionProvider>
      </body>
    </html>
  );
}
