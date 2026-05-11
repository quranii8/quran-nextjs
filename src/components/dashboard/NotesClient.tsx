"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Edit3, FileText, Save, X } from "lucide-react";
import { toArabicNum } from "@/lib/utils";

interface Note {
  id: string;
  surah: number;
  verse: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  surahName: string;
}

export function NotesClient({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const startEdit = (n: Note) => {
    setEditing(n.id);
    setEditContent(n.content);
  };

  const saveEdit = async (id: string) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, content: editContent }),
    });
    if (res.ok) {
      setNotes(notes.map((n) => (n.id === id ? { ...n, content: editContent, updatedAt: new Date().toISOString() } : n)));
      setEditing(null);
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm("هل تريد حذف هذه الملاحظة؟")) return;
    const res = await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotes(notes.filter((n) => n.id !== id));
    }
  };

  if (notes.length === 0) {
    return (
      <div className="card p-10 text-center">
        <FileText className="w-14 h-14 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
        <h2 className="font-bold mb-2">لا توجد ملاحظات بعد</h2>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          عند قراءة أي آية يمكنك إضافة ملاحظتك التأملية وستظهر هنا.
        </p>
        <Link href="/surahs" className="btn btn-primary">
          ابدأ القراءة
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
        {toArabicNum(notes.length)} ملاحظة
      </div>
      {notes.map((n) => (
        <div
          key={n.id}
          className="card p-5"
          style={{ borderRight: "4px solid var(--primary)" }}
        >
          <div className="flex items-center justify-between mb-3 gap-2">
            <Link
              href={`/surah/${n.surah}#verse-${n.verse}`}
              className="font-bold text-sm hover:underline"
              style={{ color: "var(--primary)" }}
            >
              سورة {n.surahName} — الآية {toArabicNum(n.verse)}
            </Link>
            <div className="flex items-center gap-1">
              {editing === n.id ? (
                <>
                  <button onClick={() => saveEdit(n.id)} className="icon-btn !w-8 !h-8" title="حفظ">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditing(null)} className="icon-btn !w-8 !h-8" title="إلغاء">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(n)} className="icon-btn !w-8 !h-8" title="تعديل">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteNote(n.id)} className="icon-btn !w-8 !h-8" title="حذف">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          {editing === n.id ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 rounded-lg outline-none text-sm leading-relaxed"
              style={{ background: "var(--bg-soft)", border: "1px solid var(--border)", color: "var(--text)", minHeight: "100px" }}
              autoFocus
            />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{n.content}</p>
          )}
          <div className="text-xs mt-3" style={{ color: "var(--text-soft)" }}>
            {new Date(n.updatedAt).toLocaleDateString("ar-EG")}
          </div>
        </div>
      ))}
    </div>
  );
}
