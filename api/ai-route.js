export async function POST(request) {
  try {
    const body = await request.json();
    const prompt = (body.prompt || "").trim();
    const mode = body.mode || "router";

    if (!prompt) {
      return Response.json({ error: "Prompt is required." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY in Vercel Environment Variables." },
        { status: 500 }
      );
    }

    const systemPrompt = `
You are SAZIO X AI.
Always reply in simple Hinglish.
Be safe, honest, and trust-first.
Do not promise guaranteed profit, fixed results, or illegal outcomes.
For kids mode, keep answers clean, educational, and parent-friendly.
For product mode, use wording like "best available detected option" and mention prices may vary.
Keep answers helpful and not too long.
`.trim();

    const modeInstructionMap = {
      router: "Analyze the user request and give a short helpful response.",
      product: "Give a compact product-style response using safe wording. Mention that prices may vary.",
      kids: "Give a clean, educational, age-friendly answer.",
      moderation: "Assess if the text looks suspicious and explain briefly."
    };

    const input = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `Mode: ${mode}\nInstruction: ${modeInstructionMap[mode] || modeInstructionMap.router}\nUser Input: ${prompt}`
      }
    ];

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-5",
        input
      })
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return Response.json(
        { error: data?.error?.message || "OpenAI request failed." },
        { status: openaiResponse.status }
      );
    }

    const text =
      data.output_text ||
      "No response text returned.";

    return Response.json({ text });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Server error." },
      { status: 500 }
    );
  }
}
