"use client";

import { useState, useEffect } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, User as UserIcon, AlertCircle } from "lucide-react";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  const [providers, setProviders] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  useEffect(() => {
    if (error) {
      const messages: Record<string, string> = {
        OAuthSignin: "حدث خطأ في تسجيل الدخول",
        OAuthCallback: "تعذّر إكمال تسجيل الدخول",
        OAuthAccountNotLinked: "هذا الحساب مسجّل بطريقة أخرى",
        EmailSignin: "تعذّر إرسال البريد",
        CredentialsSignin: "بيانات الدخول غير صحيحة",
        SessionRequired: "يجب تسجيل الدخول أولاً",
        Default: "حدث خطأ غير متوقع",
      };
      setErrorMsg(messages[error] || messages.Default);
    }
  }, [error]);

  const handleDemoSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    const result = await signIn("demo", {
      email: email.trim(),
      name: name.trim(),
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setErrorMsg("تعذّر تسجيل الدخول");
      setLoading(false);
    } else if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="space-y-5">
      {/* رسالة خطأ */}
      {errorMsg && (
        <div
          className="p-3 rounded-xl flex items-start gap-2 text-sm"
          style={{
            background: "rgba(220, 38, 38, .1)",
            color: "#dc2626",
            border: "1px solid rgba(220, 38, 38, .2)",
          }}
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Google OAuth (إذا متوفر) */}
      {providers?.google && (
        <>
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all border-2 hover:-translate-y-0.5"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            المتابعة بحساب Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: "var(--border)" }} />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3" style={{ background: "var(--surface)", color: "var(--text-muted)" }}>
                أو
              </span>
            </div>
          </div>
        </>
      )}

      {/* Demo (Email-only) */}
      <form onSubmit={handleDemoSignIn} className="space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-1.5">
            <Mail className="w-4 h-4 inline ml-1" />
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2.5 rounded-xl outline-none border-2 transition-colors"
            style={{
              background: "var(--bg-soft)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">
            <UserIcon className="w-4 h-4 inline ml-1" />
            الاسم <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>(اختياري)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسمك للترحيب"
            className="w-full px-4 py-2.5 rounded-xl outline-none border-2 transition-colors"
            style={{
              background: "var(--bg-soft)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="btn btn-primary w-full !py-3 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري الدخول...
            </>
          ) : (
            "ابدأ الآن"
          )}
        </button>

        <p className="text-xs text-center" style={{ color: "var(--text-soft)" }}>
          الدخول السريع لا يتطلب كلمة مرور — مناسب للتجربة.
          <br />
          سيتم إنشاء حسابك تلقائياً عند أول دخول.
        </p>
      </form>
    </div>
  );
}
