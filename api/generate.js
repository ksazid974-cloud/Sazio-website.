export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { topic, mode } = req.body || {};

    if (!topic || !String(topic).trim()) {
      return res.status(400).json({
        success: false,
        error: "No topic provided"
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "Missing OPENAI_API_KEY"
      });
    }

    const safeMode = mode || "story";
    const prompt = `Create ${safeMode} about: ${topic}. Make it extremely emotional, cinematic, detailed, viral, and engaging. Give full script.`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        instructions:
          "You are a powerful AI that creates viral emotional stories, scripts, SEO, and content.",
        input: prompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data?.error?.message || "OpenAI request failed"
      });
    }

    let result = data.output_text || "";

    if (!result && Array.isArray(data.output)) {
      result = data.output
        .map((item) => {
          if (!Array.isArray(item.content)) return "";
          return item.content
            .map((part) => part.text || part.value || "")
            .join("");
        })
        .join("\n");
    }

    if (!result || !String(result).trim()) {
      result = "No content generated";
    }

    return res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Server error"
    });
  }
}
