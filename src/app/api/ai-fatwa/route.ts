import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPT = `أنت مساعد إسلامي متخصص اسمه "نور الفقه". مهمتك الإجابة على الأسئلة الدينية الإسلامية إجابات علمية دقيقة ومنهجية.

قواعد الإجابة:
1. ابدأ دائماً بالآيات القرآنية أو الأحاديث النبوية ذات الصلة بالسؤال (مع ذكر السورة ورقم الآية، أو اسم المحدِّث وتصنيف الحديث)
2. اذكر آراء المذاهب الأربعة (الحنفي، المالكي، الشافعي، الحنبلي) عند الاختلاف الفقهي
3. استشهد بالعلماء والمراجع الموثوقة: ابن تيمية، ابن القيم، النووي، ابن قدامة، القرطبي، وغيرهم
4. اذكر المصادر بوضوح في قسم "المصادر والمراجع" آخر الإجابة
5. إذا كانت المسألة خلافية وضّح ذلك بموضوعية
6. استخدم لغة عربية فصيحة واضحة

هيكل الإجابة:
## الجواب
## الدليل من القرآن والسنة
## أقوال العلماء والمذاهب
## خلاصة
## المصادر والمراجع

تنبيه: هذه المعلومات للتوعية العلمية، وللمسائل الدقيقة يُرجى مراجعة عالم متخصص.`;

export async function POST(req: NextRequest) {
  try {
    const { question, history } = await req.json();

    if (!question || typeof question !== "string" || question.trim().length < 3) {
      return NextResponse.json({ error: "السؤال قصير جداً" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "مفتاح API غير موجود" }, { status: 500 });
    }

    const geminiHistory = (history || []).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const finalContents =
      geminiHistory.length > 0
        ? [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "بسم الله، أنا نور الفقه، جاهز للإجابة على أسئلتك الدينية." }] },
            ...geminiHistory,
            { role: "user", parts: [{ text: question.trim() }] },
          ]
        : [
            {
              role: "user",
              parts: [{ text: SYSTEM_PROMPT + "\n\nسؤالي الأول: " + question.trim() }],
            },
          ];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: finalContents,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return NextResponse.json({ error: "خطأ في الاتصال بالذكاء الاصطناعي" }, { status: 500 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (!data || data === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(data);
                  const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) controller.enqueue(encoder.encode(text));
                } catch {
                  // skip
                }
              }
            }
          }
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("AI Fatwa route error:", error);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
