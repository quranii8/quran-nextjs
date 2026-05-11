"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogIn, LogOut, User as UserIcon, LayoutDashboard, BookmarkCheck, Settings } from "lucide-react";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Loading state
  if (status === "loading") {
    return (
      <div
        className="w-9 h-9 rounded-full animate-pulse"
        style={{ background: "var(--border)" }}
      />
    );
  }

  // Not logged in
  if (!session?.user) {
    return (
      <Link
        href="/auth/signin"
        className="hidden sm:inline-flex btn btn-primary !py-1.5 !px-3 !text-xs"
      >
        <LogIn className="w-3.5 h-3.5" />
        دخول
      </Link>
    );
  }

  const user = session.user;
  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full grid place-items-center text-white font-bold text-sm shadow-md transition-transform hover:scale-105 overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--primary), var(--gold-dark))" }}
        aria-label="قائمة المستخدم"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-64 rounded-2xl overflow-hidden shadow-xl z-50 animate-fade-in"
          style={{
            background: "var(--bg-elev)",
            border: "1px solid var(--border)",
          }}
        >
          {/* User info */}
          <div className="p-4 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full grid place-items-center text-white font-bold shrink-0 overflow-hidden"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--gold-dark))" }}
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  initial
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm truncate">{user.name || "مستخدم"}</div>
                <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-2">
            <MenuItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} onClose={() => setOpen(false)}>
              لوحة التحكم
            </MenuItem>
            <MenuItem href="/bookmarks" icon={<BookmarkCheck className="w-4 h-4" />} onClose={() => setOpen(false)}>
              المحفوظات
            </MenuItem>
            <MenuItem href="/dashboard/settings" icon={<Settings className="w-4 h-4" />} onClose={() => setOpen(false)}>
              الإعدادات
            </MenuItem>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-right"
              style={{ color: "#dc2626" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(220, 38, 38, .08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ href, icon, children, onClose }: { href: string; icon: React.ReactNode; children: React.ReactNode; onClose: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
      style={{ color: "var(--text)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-soft)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {icon}
      {children}
    </Link>
  );
}
