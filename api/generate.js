export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { topic, mode } = req.body || {};

    const cleanTopic = String(topic || "").trim();
    const cleanMode = String(mode || "story").toLowerCase().trim();

    if (!cleanTopic) {
      return res.status(400).json({
        success: false,
        error: "No topic provided"
      });
    }

    // RANDOM VARIATION (IMPORTANT)
    const randomSeed = Math.floor(Math.random() * 10000);
    const variation = randomSeed % 3;

    function titleCase(text) {
      return text
        .split(" ")
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    function makeStory(t) {

      const hero =
        variation === 0
          ? "Ek aisa character jo sabse kamzor lagta hai"
          : variation === 1
          ? "Ek aisa insaan jise sab ignore karte hain"
          : "Ek aisa hero jise duniya ne kabhi seriously nahi liya";

      return `TITLE:
${titleCase(t)} | Emotional Viral Story

HOOK:
Sirf 3 second me ${t} ki kahani sab kuch badal deti hai.

FULL STORY:
${hero}, ${t} ki situation me phans jata hai. Log use ignore karte hain, kuch hans dete hain. Problem dheere-dheere badhti hai. Character tootne lagta hai lekin himmat nahi chhodta. Ek emotional turning point aata hai jahan se kahani badalti hai. Fir ek strong comeback hota hai aur last me sabko shock kar deta hai.

SCENE SCRIPT (1-9):
1. Sudden danger
2. Close emotional face
3. Public reaction
4. Struggle
5. Crying breakdown
6. Comeback plan
7. Big twist
8. Victory
9. Loop ending

THUMBNAIL:
SHOCKING TWIST 😱

SEO:
${t}, viral story, emotional reels, shorts, trending content`;
    }

    function makeSeo(t) {
      return `TITLE:
${titleCase(t)} | Viral Content

DESCRIPTION:
${titleCase(t)} par based ye content highly engaging aur viral potential wala hai.

TAGS:
${t}, viral, reels, shorts, trending, emotional`;
    }

    function makeMoney(t) {
      return `EARNING PLAN:
${titleCase(t)} ko reels, shorts aur freelance service me convert karo.

PLATFORM:
YouTube Shorts, Instagram, Fiverr

STRATEGY:
Daily 3 content banao, hook strong rakho, end me twist do.`;
    }

    let result = "";

    if (cleanMode === "story") result = makeStory(cleanTopic);
    else if (cleanMode === "seo") result = makeSeo(cleanTopic);
    else if (cleanMode === "money") result = makeMoney(cleanTopic);
    else result = makeStory(cleanTopic);

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
