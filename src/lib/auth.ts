import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

const providers: NextAuthOptions["providers"] = [];

// Google OAuth (إذا توفرت credentials)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Demo Mode: تسجيل دخول بإيميل فقط (بدون كلمة مرور) - مناسب للتجربة
// في الإنتاج: استخدم EmailProvider مع SMTP أو OAuth حقيقي
providers.push(
  CredentialsProvider({
    id: "demo",
    name: "تسجيل سريع (للتجربة)",
    credentials: {
      email: { label: "البريد الإلكتروني", type: "email", placeholder: "you@example.com" },
      name: { label: "الاسم", type: "text", placeholder: "اسمك" },
    },
    async authorize(credentials) {
      if (!credentials?.email) return null;

      const email = credentials.email.toLowerCase().trim();
      const name = credentials.name?.trim() || email.split("@")[0];

      // إنشاء/جلب المستخدم
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            emailVerified: new Date(), // demo mode: نعتبره verified
          },
        });
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  })
);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers,
  session: {
    strategy: "jwt", // JWT لدعم CredentialsProvider
    maxAge: 30 * 24 * 60 * 60, // 30 يوم
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
