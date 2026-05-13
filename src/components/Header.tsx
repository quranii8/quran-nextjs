"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Moon, Sun, Search, X, BookOpen } from "lucide-react";
import { useQuranStore } from "@/lib/store";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./auth/UserMenu";

export function Header() {
  const theme = useQuranStore((s) => s.theme);
  const toggleTheme = useQuranStore((s) => s.toggleTheme);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-5 py-3 flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 md:gap-3 font-extrabold shrink-0" style={{ color: "var(--primary)" }}>
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl grid place-items-center text-white" 
               style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-light))" }}>
            <span className="text-xl">۩</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-base leading-tight">منصة القرآن</div>
            <div className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>اقرأ . استمع . تدبر</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-1 mr-auto">
          <NavLink href="/">الرئيسية</NavLink>
          <NavLink href="/surahs">السور</NavLink>
          <NavLink href="/tafsir">التفاسير</NavLink>
          <NavLink href="/reciters">القراء</NavLink>
          <Link href="/ai-fatwa" className="px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 text-white"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-light))" }}>
            <BookOpen className="w-4 h-4" />
            المساعد الذكي
          </Link>
        </nav>

        <div className="xl:hidden flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <UserMenu />
          <button className="p-2 rounded-lg xl:hidden transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t animate-fade-in" style={{ borderColor: "var(--border-soft)", background: "var(--bg-elev)" }}>
          <div className="max-w-3xl mx-auto px-5 py-4">
            <SearchBar autoFocus onSelect={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t animate-fade-in max-h-[80vh] overflow-y-auto" style={{ borderColor: "var(--border-soft)", background: "var(--bg-elev)" }}>
          <nav className="max-w-3xl mx-auto p-3 space-y-3">
            <MobileSection title="القرآن">
              <MobileNavLink href="/" icon="🏠" onClose={() => setMobileOpen(false)}>الرئيسية</MobileNavLink>
              <MobileNavLink href="/surahs" icon="📖" onClose={() => setMobileOpen(false)}>السور</MobileNavLink>
              <MobileNavLink href="/tafsir" icon="📚" onClose={() => setMobileOpen(false)}>التفسير</MobileNavLink>
            </MobileSection>
            <MobileSection title="الذكاء الاصطناعي">
              <MobileNavLink href="/ai-fatwa" icon="✨" onClose={() => setMobileOpen(false)}>نور الفقه</MobileNavLink>
            </MobileSection>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-3 py-2 rounded-lg font-medium text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" style={{ color: "var(--text-muted)" }}>
      {children}
    </Link>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold mb-1.5 px-2 uppercase tracking-wider" style={{ color: "var(--primary)" }}>{title}</div>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </div>
  );
}

function MobileNavLink({ href, children, onClose, icon }: { href: string; children: React.ReactNode; onClose: () => void; icon: string }) {
  return (
    <Link href={href} onClick={onClose} className="px-3 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
          style={{ background: "var(--bg-soft)", color: "var(--text)" }}>
      <span>{icon}</span>
      {children}
    </Link>
  );
}
