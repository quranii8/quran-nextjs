import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="relative z-10 border-t mt-16 pt-10 pb-24 px-5"
      style={{ background: "var(--bg-elev)", borderColor: "var(--border)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-sm">
          <FooterColumn title="القرآن">
            <FooterLink href="/surahs">السور</FooterLink>
            <FooterLink href="/tafsir">التفاسير</FooterLink>
            <FooterLink href="/reciters">القراء</FooterLink>
            <FooterLink href="/bookmarks">المحفوظات</FooterLink>
          </FooterColumn>

          <FooterColumn title="المحتوى">
            <FooterLink href="/prophets">قصص الأنبياء</FooterLink>
            <FooterLink href="/quran-sciences">علوم القرآن</FooterLink>
            <FooterLink href="/tajweed">أحكام التجويد</FooterLink>
            <FooterLink href="/hadith-qudsi">الأحاديث القدسية</FooterLink>
          </FooterColumn>

          <FooterColumn title="إسلاميات">
            <FooterLink href="/adhkar">الأذكار</FooterLink>
            <FooterLink href="/asma-allah">أسماء الله</FooterLink>
            <FooterLink href="/prayer-times">المواقيت</FooterLink>
            <FooterLink href="/qibla">القبلة</FooterLink>
          </FooterColumn>

          <FooterColumn title="حسابي">
            <FooterLink href="/dashboard">لوحة التحكم</FooterLink>
            <FooterLink href="/auth/signin">تسجيل الدخول</FooterLink>
            <FooterLink href="/about">عن المنصة</FooterLink>
          </FooterColumn>
        </div>

        <div className="text-center pt-6 border-t" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            صُنع بحب لخدمة كتاب الله تعالى ✦ © {new Date().getFullYear()}
          </p>
          <p className="mt-1.5 text-xs" style={{ color: "var(--text-soft)" }}>
            المصادر: api.alquran.cloud • mp3quran.net • everyayah.com • aladhan.com
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-bold mb-3 text-sm" style={{ color: "var(--primary)" }}>{title}</h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm transition-colors hover:underline"
      style={{ color: "var(--text-muted)" }}
    >
      {children}
    </Link>
  );
}
