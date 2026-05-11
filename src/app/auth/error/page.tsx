import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const metadata = { title: "خطأ في تسجيل الدخول" };

export default function AuthErrorPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="max-w-md mx-auto px-5 py-16 text-center">
      <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "#dc2626" }} />
      <h1 className="text-2xl font-extrabold mb-2">حدث خطأ</h1>
      <p className="mb-6" style={{ color: "var(--text-muted)" }}>
        تعذّر إكمال عملية تسجيل الدخول.
        {searchParams.error && (
          <span className="block mt-2 text-xs" style={{ color: "var(--text-soft)" }}>
            ({searchParams.error})
          </span>
        )}
      </p>
      <Link href="/auth/signin" className="btn btn-primary">
        إعادة المحاولة
      </Link>
    </div>
  );
}
