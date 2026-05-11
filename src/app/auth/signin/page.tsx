import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "سجّل دخولك لمزامنة محفوظاتك وملاحظاتك",
};

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto px-5 py-12">
      <div className="text-center mb-8">
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-2xl grid place-items-center text-white text-3xl shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-light))" }}
        >
          ۩
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2">مرحباً بعودتك</h1>
        <p style={{ color: "var(--text-muted)" }}>
          سجّل دخولك لمزامنة محفوظاتك وملاحظاتك بين أجهزتك
        </p>
      </div>

      <div className="card p-6 md:p-8">
        <SignInForm />
      </div>

      <div className="text-center mt-6 text-xs" style={{ color: "var(--text-soft)" }}>
        🔒 لا نستخدم بياناتك لأي أغراض تجارية. كل ما نحفظه محمي ومشفّر.
      </div>
    </div>
  );
}
