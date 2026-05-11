import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const surah = searchParams.get("surah");
  const verse = searchParams.get("verse");

  const where: any = { userId };
  if (surah) where.surah = parseInt(surah);
  if (verse) where.verse = parseInt(verse);

  const notes = await prisma.note.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ notes });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { surah, verse, content, id } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Empty content" }, { status: 400 });

  if (id) {
    // update
    const note = await prisma.note.update({
      where: { id, userId } as any,
      data: { content },
    });
    return NextResponse.json({ note });
  }

  if (!surah || !verse) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const note = await prisma.note.create({
    data: { userId, surah, verse, content },
  });
  return NextResponse.json({ note });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.note.deleteMany({ where: { id, userId } });
  return NextResponse.json({ success: true });
}
