"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Moon, Sun, Search, X } from "lucide-react";
import { useQuranStore } from "@/lib/store";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./auth/UserMenu";

export function Header() {
  const theme = useQuranStore((s) => s.theme);
  const toggleTheme = useQuranStore((s) => s.toggleTheme);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 glass border-b"
      style={{ borderColor: "var(--border-soft)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-5 py-3 flex items-center gap-3 md:gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 md:gap-3 font-extrabold shrink-0"
          style={{ color: "var(--primary)" }}
        >
          <div
            className="w-10 h-10 md:w-11 md:h-11 rounded-xl grid place-items-center text-white text-lg md:text-xl shadow-md relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), var(--primary-light))",
            }}
          >
            ۩
            <div className="absolute inset-[3px] border border-white/30 rounded-[9px]" />
          </div>

          <div className="hidden sm:block">
            <div className="text-base leading-tight">منصة القرآن</div>

            <div
              className="text-[11px] font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              اقرأ • استمع • تدبر
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-1 mr-auto">
          <NavLink href="/">الرئيسية</NavLink>
          <NavLink href="/surahs">السور</NavLink>
          <NavLink href="/tafsir">التفاسير</NavLink>
          <NavLink href="/reciters">القراء</NavLink>

          <Link
            href="/ai-fatwa"
            className="px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5 text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), var(--primary-light))",
              boxShadow: "0 2px 8px rgba(27,94,32,0.3)",
            }}
          >
            المساعد الذكي
          </Link>

          <NavGroup
            label="المحتوى"
            items={[
              { href: "/prophets", label: "قصص الأنبياء" },
              { href: "/quran-sciences", label: "علوم القرآن" },
              { href: "/tajweed", label: "أحكام التجويد" },
              { href: "/hadith-qudsi", label: "الأحاديث القدسية" },
            ]}
          />

          <NavGroup
            label="إسلاميات"
            items={[
              { href: "/adhkar", label: "الأذكار" },
              { href: "/asma-allah", label: "أسماء الله" },
              { href: "/prayer-times", label: "المواقيت" },
              { href: "/qibla", label: "القبلة" },
            ]}
          />
        </nav>

        {/* Spacer */}
        <div className="xl:hidden flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            className="icon-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="بحث"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="تبديل الوضع"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <UserMenu />

          <button
            className="icon-btn xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="القائمة"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      {searchOpen && (
        <div
          className="border-t animate-fade-in"
          style={{
            borderColor: "var(--border-soft)",
            background: "var(--bg-elev)",
          }}
        >
          <div className="max-w-3xl mx-auto px-5 py-4">
            <SearchBar
              autoFocus
              onSelect={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="xl:hidden border-t animate-fade-in max-h-[80vh] overflow-y-auto"
          style={{
            borderColor: "var(--border-soft)",
            background: "var(--bg-elev)",
          }}
        >
          <nav className="max-w-3xl mx-auto p-3 space-y-3">
            <MobileSection title="القرآن">
              <MobileNavLink
                href="/"
                onClose={() => setMobileOpen(false)}
                icon="🏠"
              >
                الرئيسية
              </MobileNavLink>

              <MobileNavLink
                href="/surahs"
                onClose={() => setMobileOpen(false)}
                icon="📖"
              >
                السور
              </MobileNavLink>

              <MobileNavLink
                href="/tafsir"
                onClose={() => setMobileOpen(false)}
                icon="📚"
              >
                التفاسير
              </MobileNavLink>

              <MobileNavLink
                href="/reciters"
                onClose={() => setMobileOpen(false)}
                icon="🎧"
              >
                القراء
              </MobileNavLink>
            </MobileSection>

            <MobileSection title="المحتوى الإسلامي">
              <MobileNavLink
                href="/prophets"
                onClose={() => setMobileOpen(false)}
                icon="✨"
              >
                قصص الأنبياء
              </MobileNavLink>

              <MobileNavLink
                href="/quran-sciences"
                onClose={() => setMobileOpen(false)}
                icon="🕌"
              >
                علوم القرآن
              </MobileNavLink>

              <MobileNavLink
                href="/tajweed"
                onClose={() => setMobileOpen(false)}
                icon="📜"
              >
                أحكام التجويد
              </MobileNavLink>

              <MobileNavLink
                href="/hadith-qudsi"
                onClose={() => setMobileOpen(false)}
                icon="☪️"
              >
                الأحاديث القدسية
              </MobileNavLink>
            </MobileSection>

            <MobileSection title="الذكاء الاصطناعي">
              <MobileNavLink
                href="/ai-fatwa"
                onClose={() => setMobileOpen(false)}
                icon="🤖"
              >
                المساعد الديني الذكي
              </MobileNavLink>
            </MobileSection>

            <MobileSection title="أدوات إسلامية">
              <MobileNavLink
                href="/adhkar"
                onClose={() => setMobileOpen(false)}
                icon="📿"
              >
                الأذكار
              </MobileNavLink>

              <MobileNavLink
                href="/asma-allah"
                onClose={() => setMobileOpen(false)}
                icon="🕋"
              >
                أسماء الله
              </MobileNavLink>

              <MobileNavLink
                href="/prayer-times"
                onClose={() => setMobileOpen(false)}
                icon="🕌"
              >
                المواقيت
              </MobileNavLink>

              <MobileNavLink
                href="/qibla"
                onClose={() => setMobileOpen(false)}
                icon="🧭"
              >
                القبلة
              </MobileNavLink>
            </MobileSection>

            <MobileSection title="حسابي">
              <MobileNavLink
                href="/dashboard"
                onClose={() => setMobileOpen(false)}
                icon="⚙️"
              >
                لوحة التحكم
              </MobileNavLink>

              <MobileNavLink
                href="/bookmarks"
                onClose={() => setMobileOpen(false)}
                icon="⭐"
              >
                المحفوظات
              </MobileNavLink>

              <MobileNavLink
                href="/about"
                onClose={() => setMobileOpen(false)}
                icon="ℹ️"
              >
                عن المنصة
              </MobileNavLink>
            </MobileSection>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-lg font-medium text-sm transition-colors"
      style={{ color: "var(--text-muted)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--primary-soft)";
        e.currentTarget.style.color = "var(--primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--text-muted)";
      }}
    >
      {children}
    </Link>
  );
}

function NavGroup({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div className="relative group">
      <button
        className="px-3 py-2 rounded-lg font-medium text-sm transition-colors"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </button>

      <div
        className="absolute top-full right-0 mt-1 hidden group-hover:block min-w-[200px] py-2 rounded-xl shadow-lg z-50"
        style={{
          background: "var(--bg-elev)",
          border: "1px solid var(--border)",
        }}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 text-sm transition-colors hover:bg-green-50 dark:hover:bg-green-900/20"
            style={{ color: "var(--text)" }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="text-xs font-bold mb-1.5 px-2"
        style={{ color: "var(--gold-dark)" }}
      >
        {title}
      </div>

      <div className="grid grid-cols-2 gap-1">
        {children}
      </div>
    </div>
  );
}

function MobileNavLink({
  href,
  children,
  onClose,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  onClose: () => void;
  icon: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="px-3 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
      style={{
        background: "var(--bg-soft)",
        color: "var(--text)",
      }}
    >
      <span className="text-base">{icon}</span>
      {children}
    </Link>
  );
}
