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

    const systemPrompt = [
      "You are SAZIO X AI.",
      "Always reply in simple Hinglish.",
      "Be safe, honest, and trust-first.",
      "Never promise guaranteed profit, fixed match results, or illegal outcomes.",
      "For kids mode, keep answers clean and educational.",
      "For product mode, say best available detected option and mention prices may vary.",
      "Keep answers short, useful, and clear."
    ].join(" ");

    const finalPrompt =
      systemPrompt + "\n\n" +
      "Mode: " + mode + "\n" +
      "User: " + prompt;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: finalPrompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "OpenAI request failed"
      });
    }

    const text =
  data.output_text ||
  data.output?.[0]?.content?.[0]?.text ||
  "No response";

return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Server error"
    });
  }
}
