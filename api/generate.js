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
    const cleanMode = String(mode || "story").trim().toLowerCase();

    if (!cleanTopic) {
      return res.status(400).json({
        success: false,
        error: "No topic provided"
      });
    }

    function titleCase(text) {
      return text
        .split(" ")
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    function makeHooks(t) {
      return [
        `Sab log soch rahe the ki ${t} khatam ho gaya... lekin asli twist abhi baaki tha.`,
        `${titleCase(t)} ki ye kahani pehle shock degi, phir rulayegi, phir jeet dilayegi.`,
        `Sirf 5 second ke andar ${t} ne sab kuch badal diya.`
      ].join("\n");
    }

    function makeStory(t) {
      return `TITLE:
${titleCase(t)} | Emotional Viral Story

HOOK:
${titleCase(t)} ki shuruaat ek achanak danger se hoti hai. Pehle 3 second me hi tension, shock aur emotion build hota hai.

FULL STORY:
Ek aisa character jo kamzor lagta hai, ${t} ki situation me phans jata hai. Log use ignore karte hain, kuch hans dete hain, kuch bas dekhte rehte hain. Problem badhti chali jati hai. Character tootne lagta hai, lekin andar se himmat nahi chhodta. Dheere-dheere ek emotional turning point aata hai jahan se kahani direction badalti hai. Fir ek strong comeback hota hai. Last me situation sirf solve nahi hoti, balki sabko shock kar deti hai. Ending emotional aur satisfying hoti hai.

SCENE SCRIPT (1-9):
Scene 1: Sudden danger appears around ${t}. Camera shake, instant tension.
Scene 2: Main character ka close-up. Dar, confusion, helplessness.
Scene 3: Public reaction. Kuch log shock me, kuch log bas dekh rahe hain.
Scene 4: Problem aur badi ho jati hai. Character struggle karta hai.
Scene 5: Emotional breakdown. Aankhon me aansu, background me silence.
Scene 6: Character ek smart idea ya inner courage se khada hota hai.
Scene 7: Big twist. Jo sab impossible samajh rahe the, wahi start hota hai.
Scene 8: Victory moment. Problem solve, crowd stunned, clapping ya emotional reaction.
Scene 9: Loop ending. Final frame beginning se connect hota hai.

VIDEO PROMPTS:
Scene 1: Ultra realistic cinematic shot of ${t}, sudden danger, dramatic lighting, fast movement, realistic environment.
Scene 2: Emotional close-up, watery eyes, shallow depth of field, cinematic camera.
Scene 3: Crowd reaction, realistic faces, tension in background.
Scene 4: Struggle shot, dust, motion blur, intense realism.
Scene 5: Silent emotional breakdown, extreme close-up, cinematic tears.
Scene 6: Smart comeback setup, slow push camera, hope tone.
Scene 7: Twist reveal, fast cut, impact frame.
Scene 8: Hero victory shot, crowd emotional, bright dramatic light.
Scene 9: Loop-ready final frame, same mood as opening but transformed.

EDITING PLAN:
- First 2 sec: very fast cut
- Scene 2-5: emotional pacing + close-ups
- Scene 6: slow push-in
- Scene 7: impact cut
- Scene 8: wide reaction + close-up mix
- Scene 9: loop frame hold

SOUND DESIGN:
- Scene 1: impact sound + danger rise
- Scene 2: emotional hum + breathing
- Scene 3: crowd murmur
- Scene 4: struggle effects
- Scene 5: crying / silence
- Scene 6: hope music build
- Scene 7: dramatic hit
- Scene 8: clap / cheer / emotional swell
- Scene 9: soft loop-end music

THUMBNAIL TEXT:
1. SAB KUCH BADAL GAYA!
2. LAST TWIST SHOCKING!
3. YE KOI SOCH NAHI SAKTA THA!

SEO:
Title: ${titleCase(t)} | Emotional Viral Story You Must Watch
Description: ${titleCase(t)} ki ye emotional aur engaging kahani ek strong hook, deep struggle, aur shocking twist ke saath end hoti hai.
Tags: ${t}, viral story, emotional shorts, twist story, cinematic reels, youtube shorts, viral content, trending story, hook story, emotional video`;
    }

    function makeSeo(t) {
      return `TITLE:
${titleCase(t)} | Viral Emotional Story

DESCRIPTION:
${titleCase(t)} par based ye content highly engaging, emotional aur share-worthy hai. End tak dekhna kyunki last twist sab kuch change kar deta hai.

TAGS:
${t}, viral, reels, shorts, emotional story, trending, hook, cinematic, viral video, content idea

THUMBNAIL TEXT:
1. LAST TWIST!
2. SHOCKING END!
3. MUST WATCH!

HOOK LINE:
${titleCase(t)} ki kahani jo pehle shock degi, phir rula degi.`;
    }

    function makeMoney(t) {
      return `MONEY PLAN:
${titleCase(t)} ko short video, reels, captions aur freelance service me convert karo.

PLATFORMS:
- YouTube Shorts
- Instagram Reels
- Facebook Reels
- Fiverr
- Upwork

STRATEGY:
- Daily 3 pieces of content banao
- Ek long idea ko 5 shorts me tod do
- Hook first, twist later, CTA end me

EARNING METHODS:
- Referral links
- Freelance script writing
- Thumbnail service
- Video editing service
- Affiliate links

7 DAY PLAN:
Day 1: ${t} par 3 hook ideas
Day 2: 1 full short script
Day 3: Thumbnail + caption
Day 4: Video edit
Day 5: Upload + share
Day 6: Offer service on Fiverr/Upwork
Day 7: Analyze best-performing format`;
    }

    function makeCaption(t) {
      return `SHORT CAPTION:
${titleCase(t)} but make it viral 🔥

LONG CAPTION:
Ye kahani sirf content nahi, emotion + twist + comeback ka perfect combo hai. End tak dekhna kyunki jo hota hai wo sabki expectation ko tod deta hai.

HOOK:
End tak dekhna... last part tumhe shock karega.

HASHTAGS:
#viral #reels #shorts #trending #${t.replace(/\s+/g, "").toLowerCase()}

CTA:
Share karo agar tum bhi aisi stories pasand karte ho.`;
    }

    function makeVideo(t) {
      return `VIDEO SCRIPT:
${titleCase(t)} ke liye ek ultra realistic cinematic short video package.

SCENE BREAKDOWN:
1. Danger hook
2. Hero emotional close-up
3. Public reaction
4. Struggle
5. Breakdown
6. Smart comeback
7. Twist
8. Victory
9. Loop ending

CAMERA ANGLES:
- Extreme close-up
- Ground-level hero shot
- Top wide reaction shot
- Slow push-in on emotional face

LIGHTING:
- Start tense
- Middle emotional low tone
- End brighter comeback tone

MOTION:
- Fast opening
- Slow emotional middle
- Sharp twist cut
- Hero finish hold

SOUND PLAN:
- Impact
- Crying
- Crowd murmur
- Hope rise
- Victory swell`;
    }

    let result = "";

    if (cleanMode === "story") result = makeStory(cleanTopic);
    else if (cleanMode === "seo") result = makeSeo(cleanTopic);
    else if (cleanMode === "money") result = makeMoney(cleanTopic);
    else if (cleanMode === "caption") result = makeCaption(cleanTopic);
    else if (cleanMode === "video") result = makeVideo(cleanTopic);
    else {
      result = `HOOK IDEAS:
${makeHooks(cleanTopic)}

STORY:
${makeStory(cleanTopic)}`;
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
