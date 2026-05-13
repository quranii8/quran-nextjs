import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { question, history } = await req.json();

    if (!question || typeof question !== "string" || question.trim().length < 3) {
      return NextResponse.json({ error: "السؤال قصير جداً" }, { status: 400 });
    }

    const SYSTEM_PROMPT = `أنت مساعد إسلامي متخصص اسمه "نور الفقه". مهمتك الإجابة على الأسئلة الدينية الإسلامية إجابات علمية دقيقة ومنهجية.

قواعد الإجابة:
1. ابدأ دائماً بالآيات القرآنية أو الأحاديث النبوية ذات الصلة بالسؤال (مع ذكر السورة ورقم الآية، أو اسم المحدِّث وتصنيف الحديث)
2. اذكر آراء المذاهب الأربعة (الحنفي، المالكي، الشافعي، الحنبلي) عند الاختلاف الفقهي
3. استشهد بالعلماء والمراجع الموثوقة: ابن تيمية، ابن القيم، النووي، ابن قدامة، القرطبي، الشافعي، مالك، أبو حنيفة، أحمد بن حنبل، وغيرهم
4. اذكر المصادر بوضوح في قسم "المصادر والمراجع" آخر الإجابة
5. إذا كانت المسألة خلافية وضّح ذلك بموضوعية دون ترجيح إلا عند وجود دليل راجح
6. لا تُفتي في المسائل الطبية أو القانونية التفصيلية — أحل المستخدم لمتخصص
7. استخدم لغة عربية فصيحة واضحة

هيكل الإجابة:
## الجواب
[الإجابة المباشرة والموجزة]

## الدليل من القرآن والسنة
[الآيات والأحاديث]

## أقوال العلماء والمذاهب
[آراء المذاهب والعلماء]

## خلاصة
[تلخيص عملي للمسألة]

## المصادر والمراجع
[قائمة المصادر]

تنبيه: هذه المعلومات للتوعية العلمية، وللمسائل الدقيقة يُرجى مراجعة عالم متخصص.`;

    const messages = [
      ...(history || []),
      { role: "user", content: question },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Claude API error:", err);
      return NextResponse.json({ error: "خطأ في الاتصال بالذكاء الاصطناعي" }, { status: 500 });
    }

    // Stream the response
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
                if (data === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                    controller.enqueue(encoder.encode(parsed.delta.text));
                  }
                } catch {
                  // skip malformed
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
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("AI Fatwa route error:", error);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
