import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookmarks });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const body = await req.json();
  const { surah, verse, text, reference, color } = body;

  if (!surah || !verse || !text || !reference) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // upsert: إذا موجودة → حدّث، وإلا → أنشئ
  const bookmark = await prisma.bookmark.upsert({
    where: { userId_surah_verse: { userId, surah, verse } },
    create: { userId, surah, verse, text, reference, color: color || "gold" },
    update: { text, reference, color },
  });

  return NextResponse.json({ bookmark });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const surah = parseInt(searchParams.get("surah") || "0");
  const verse = parseInt(searchParams.get("verse") || "0");

  if (!surah || !verse) {
    return NextResponse.json({ error: "Missing surah or verse" }, { status: 400 });
  }

  await prisma.bookmark.deleteMany({
    where: { userId, surah, verse },
  });

  return NextResponse.json({ success: true });
}
