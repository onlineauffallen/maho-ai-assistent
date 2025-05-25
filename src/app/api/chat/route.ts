import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    console.log("📬 Prompt an OpenAI:");
    console.dir(messages, { depth: null });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Project": process.env.OPENAI_PROJECT_ID ?? "",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenAI API Fehler:", data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data.choices[0].message.content);
  } catch (err) {
    console.error("❌ Interner API Fehler:", err);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
