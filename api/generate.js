export default async function handler(req, res) {
  try {
    const { topic, mode } = req.body;

    const prompt = `
Create high quality ${mode} content.

Topic: ${topic}

Output:
- Strong hook
- Emotional or engaging structure
- Full script
- Scene breakdown
- Viral style
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt
      })
    });

    const data = await response.json();

    const text =
      data.output?.[0]?.content?.[0]?.text ||
      "AI failed to generate content.";

    res.status(200).json({
      success: true,
      result: text
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
