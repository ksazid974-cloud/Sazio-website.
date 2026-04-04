export const config = {
  runtime: "nodejs"
};

// ---------- CORE UTIL ----------
function clean(v = "") {
  return String(v).trim();
}

// ---------- SAZIO CORE BRAIN ----------
function systemPrompt() {
  return `
You are SAZIO AI — a next-generation creator intelligence system.

Your purpose:
- create viral, cinematic, production-ready outputs
- generate full content packages
- help users create, grow, and earn

Rules:
- no generic output
- no weak responses
- always structured
- always premium
- always useful
- always creator-focused

Output must feel:
FAST + ADVANCED + VIRAL + REAL + PRACTICAL
`;
}

// ---------- MODE ROUTER ----------
function buildPrompt(topic, mode = "story") {
  const t = clean(topic);

  const base = `
Topic: "${t}"

Make output:
- high quality
- structured
- creator-ready
- global audience friendly
`;

  if (mode === "story") {
    return base + `
Return EXACT format:

TITLE:
HOOK:
FULL STORY:

SCENE SCRIPT (1-9):
Each scene visual + action

VIDEO PROMPTS:
Scene-wise cinematic prompts

EDITING PLAN:
Cuts, zoom, slow motion

SOUND DESIGN:
Effects + music

THUMBNAIL TEXT:
3 options

SEO:
Title
Description
Tags
`;
  }

  if (mode === "seo") {
    return base + `
Return:
TITLE:
DESCRIPTION:
TAGS:
THUMBNAIL TEXT:
HOOK:
`;
  }

  if (mode === "money") {
    return base + `
Return:
MONEY PLAN:
PLATFORMS:
STRATEGY:
EARNING METHODS:
7 DAY PLAN:
`;
  }

  if (mode === "caption") {
    return base + `
Return:
SHORT CAPTION:
LONG CAPTION:
HOOK:
HASHTAGS:
CTA:
`;
  }

  if (mode === "video") {
    return base + `
Return:
VIDEO SCRIPT:
SCENE BREAKDOWN:
CAMERA ANGLES:
LIGHTING:
MOTION:
SOUND PLAN:
`;
  }

  return base + `Return best advanced output.`;
}

// ---------- MAIN HANDLER ----------
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { topic, mode } = req.body || {};

    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: "Missing API key" });
    }

    const prompt = buildPrompt(topic, mode);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: [
          { role: "system", content: systemPrompt() },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data?.error?.message || "AI error"
      });
    }

    // SAFE PARSER
    let output = "";

    if (data.output_text) {
      output = data.output_text;
    } else if (data.output) {
      output = data.output
        .map(i => (i.content || []).map(p => p.text || "").join(""))
        .join("\n");
    }

    if (!output) output = "No result generated.";

    return res.status(200).json({
      success: true,
      topic,
      mode,
      result: output
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message || "Server failed"
    });
  }
}
