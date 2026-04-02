export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed"
      });
    }

    const body = req.body || {};
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const mode = typeof body.mode === "string" ? body.mode : "router";

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt required"
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY"
      });
    }

    const systemPrompt = `
You are SAZIO X AI.
Always reply in simple Hinglish.
Be safe, honest, and trust-first.
Never promise guaranteed profit, fixed match results, or illegal outcomes.
For kids mode, keep answers clean, educational, and parent-friendly.
For product mode, use wording like "best available detected option" and clearly mention that prices may vary.
Keep answers useful, simple, and not too long.
`.trim();

    const finalPrompt = `${systemPrompt}\n\nMode: ${mode}\nUser input: ${prompt}`;

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: finalPrompt
      })
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return res.status(openaiResponse.status).json({
        error: data?.error?.message || "OpenAI request failed"
      });
    }

    return res.status(200).json({
      text: data.output_text || "No response text returned."
    });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Server error"
    });
  }
}
