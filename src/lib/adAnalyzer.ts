// Rule-based ad-copy analyzer. No external AI call — it inspects the script for
// the signals that actually drive short-form ad performance and produces
// tailored feedback plus three framework rewrites for the chosen platform/voice.
//
// Frameworks (AIDA, PAS, BAB) and platform notes are based on standard
// direct-response copywriting practice for short-form video ads.

export interface PlatformPreset {
  value: string;
  label: string;
  source: string;
  /** One-line, platform-specific hook advice. */
  hookTip: string;
  /** How CTAs are typically phrased on this platform. */
  ctaNorm: string;
  /** Optimal spoken length note. */
  lengthNote: string;
}

export interface VoicePreset {
  value: string;
  label: string;
  desc: string;
  lead: string; // attention-grabbing lead-in
  ctaVerb: string; // preferred CTA verb
  proof: string; // how this voice frames proof
}

export const PLATFORMS: PlatformPreset[] = [
  { value: "tiktok", label: "TikTok In-Feed Ads", hookTip: "Show the product in use early. Build a hook, a clear benefit, and a close that feels native to TikTok.", ctaNorm: "Use one action that matches the ad button and landing page.", lengthNote: "Shoot vertically; keep text clear of interface overlays and caption spoken content.", source: "https://ads.tiktok.com/business/en/guides/what-is-ad-creative-guide" },
  { value: "instagram-reels", label: "Instagram & Facebook Reels Ads", hookTip: "Build for a full-screen vertical placement, with audio and readable captions.", ctaNorm: "Match the closing line to the destination and available ad button.", lengthNote: "Keep key text and the product within the placement's safe areas; preview before publishing.", source: "https://www.facebook.com/business/ads/facebook-instagram-reels-ads" },
  { value: "youtube-shorts", label: "YouTube Shorts Ads", hookTip: "Show the product and its benefit early in a vertical video that fits the Shorts feed.", ctaNorm: "Direct viewers to the ad's CTA button, not a pinned comment or description link.", lengthNote: "Test concise edits with audio and captions. Check current requirements for the selected campaign type.", source: "https://support.google.com/google-ads/answer/2375464" },
  { value: "facebook-feed", label: "Facebook & Instagram Feed Ads", hookTip: "Make the opening text useful on its own and ensure the visual communicates without audio.", ctaNorm: "Use a specific next step that agrees with the ad button, such as Shop Now or Learn More.", lengthNote: "Preview text truncation and image cropping for each selected feed placement.", source: "https://www.facebook.com/business/ads-guide" },
  { value: "google-instream", label: "YouTube Skippable In-Stream Ads", hookTip: "Introduce your brand and value before viewers can skip after five seconds.", ctaNorm: "Repeat the same next step in the spoken close and end card.", lengthNote: "Skippable in-stream and bumper ads are different formats; bumper ads are six seconds or less.", source: "https://support.google.com/google-ads/answer/2375464" },
  { value: "linkedin", label: "LinkedIn Sponsored Video", hookTip: "Identify the professional audience and demonstrate a relevant business outcome.", ctaNorm: "Choose a next step appropriate to the offer: view a demo, download a guide, or learn more.", lengthNote: "Use captions and a focused message. Test variations against your campaign objective.", source: "https://business.linkedin.com/advertise/ads/sponsored-content/video-ads/tips" },
];

export const VOICES: VoicePreset[] = [
  {
    value: "ugc-casual",
    label: "Authentic UGC / Casual",
    desc: "Sounds like a real person talking to camera — contractions, everyday words, zero corporate polish.",
    lead: "Ok, real talk —",
    ctaVerb: "Go grab",
    proof: "share a quick personal result or before/after",
  },
  {
    value: "direct-response",
    label: "Direct Response / Hard Sell",
    desc: "Urgent, benefit-stacked, and unmissable — built to drive the click right now.",
    lead: "Stop scrolling.",
    ctaVerb: "Claim",
    proof: "stack a concrete number and a risk-reversal",
  },
  {
    value: "professional-b2b",
    label: "Professional / B2B",
    desc: "Credible and outcome-focused — speaks to ROI, time saved, and risk reduced.",
    lead: "Here's the number most teams miss:",
    ctaVerb: "Book",
    proof: "cite a measurable business outcome or case study",
  },
  {
    value: "playful-humor",
    label: "Playful / Humorous",
    desc: "Light, witty, and self-aware — earns attention with a laugh before the pitch.",
    lead: "Nobody:\nAlso you at 2am:",
    ctaVerb: "Treat yourself —",
    proof: "make the proof funny but real",
  },
  {
    value: "luxury-premium",
    label: "Luxury / Premium",
    desc: "Refined and aspirational — fewer words, more restraint, quality over urgency.",
    lead: "Some things are worth doing properly.",
    ctaVerb: "Discover",
    proof: "let craftsmanship and detail be the proof",
  },
  {
    value: "empathetic",
    label: "Empathetic / Supportive",
    desc: "Warm and understanding — meets the viewer in the problem before offering the fix.",
    lead: "If no one's told you this today:",
    ctaVerb: "Start",
    proof: "reassure with a gentle guarantee or community",
  },
  {
    value: "bold-edgy",
    label: "Bold / Edgy",
    desc: "Contrarian and confident — challenges the status quo and takes a stance.",
    lead: "Unpopular opinion:",
    ctaVerb: "Switch to",
    proof: "back the bold claim with one hard fact",
  },
  {
    value: "inspirational",
    label: "Inspirational / Motivational",
    desc: "Uplifting and identity-driven — sells the better version of the viewer.",
    lead: "This is your sign.",
    ctaVerb: "Begin",
    proof: "paint the transformation, then prove it's achievable",
  },
];

export const getPlatform = (v: string) =>
  PLATFORMS.find((p) => p.value === v) ?? PLATFORMS[0];
export const getVoice = (v: string) =>
  VOICES.find((p) => p.value === v) ?? VOICES[0];

export interface Rewrite {
  key: string;
  framework: string;
  whenToUse: string;
  parts: { label: string; text: string }[];
}

export interface Analysis {
  signals: string[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  rewrites: Rewrite[];
}

// Local analysis is deliberately conservative: a detected claim is not verified proof.
const CTA = /^(?:cta:\s*)?(?:please\s+)?(?:buy|shop|download|try|start|click|tap|sign up|subscribe|order|book|join|learn more|discover|explore|visit|claim|get started)\b/i;
const PROOF = /\b(?:rated|reviews?|customers?|testimonial|study|studies|tested|certified)\b/i;
const CLAIM = /\b(?:guaranteed|best|never|always|cure|clinically|risk.free)\b/i;

function sentences(text: string): string[] {
  return (text.match(/[^.!?\n]+(?:[.!?]+|$)/g) ?? [text]).map(s => s.trim()).filter(Boolean);
}

export function analyzeScript(script: string, platformValue: string, voiceValue: string): Analysis {
  const text = script.trim();
  if (!text) throw new Error("Add a script before analyzing.");
  const platform = getPlatform(platformValue);
  const voice = getVoice(voiceValue);
  const lines = sentences(text);
  const opening = lines[0];
  const cta = [...lines].reverse().find(s => CTA.test(s));
  const proof = lines.find(s => PROOF.test(s) && s !== cta);
  const words = text.split(/\s+/).length;
  const openingWords = opening.split(/\s+/).length;
  const signals = [`${words} words`, `About ${Math.ceil(words / 2.5)} seconds spoken`];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const improvements: string[] = [];
  if (opening.endsWith("?")) {
    signals.push("Question opening");
    strengths.push(`“${opening}” invites the viewer to consider the situation. Test whether your intended audience recognizes it.`);
  } else if (openingWords <= 12) {
    strengths.push(`“${opening}” is a concise opening (${openingWords} words), leaving room to demonstrate the offer.`);
  } else {
    weaknesses.push(`Your opening has ${openingWords} words: “${opening}”. The main point may arrive too late.`);
    improvements.push("Split the opening into one benefit-led sentence; move supporting detail into the body.");
  }
  if (cta) {
    signals.push("Action line detected");
    strengths.push(`“${cta}” gives viewers a next step. Make sure the destination fulfills this exact offer.`);
  } else {
    weaknesses.push("No explicit action line was found. A product description alone leaves the next step unclear.");
    improvements.push(`Add a concrete action after the offer. ${platform.ctaNorm}`);
  }
  if (proof) {
    signals.push("Evidence claim detected — unverified");
    strengths.push(`“${proof}” attempts to support the offer with evidence; keep it only if you can substantiate it.`);
  } else {
    weaknesses.push("The script does not identify a review, demonstration result, or other evidence for its claims.");
    improvements.push("Show the product doing the promised job, or add a genuine, attributable customer quote. Do not invent results.");
  }
  const risky = lines.find(s => CLAIM.test(s));
  if (risky) weaknesses.push(`Check the broad claim “${risky}”. Replace absolutes with a precise, supportable description.`);
  if (words > 90) {
    weaknesses.push(`At roughly ${Math.ceil(words / 2.5)} seconds spoken, this needs a deliberate pacing check for ${platform.label}.`);
    improvements.push("Read the draft aloud. Cut repeated points before shortening the product explanation or offer terms.");
  }
  if (words < 12) weaknesses.push("This is a short concept. Add who the product helps, what it does, and the intended action before treating it as a finished ad.");
  if (/\b(today|limited|hurry|deadline|expires)\b/i.test(text)) improvements.push("Keep urgency only when a real deadline or stock limit supports it.");
  improvements.push(platform.hookTip, platform.lengthNote, `Voice direction: ${voice.desc}`);
  if (!strengths.length) strengths.push(`The script provides ${words} words of source material; no specific persuasive strength can be reliably identified from the local checks.`);
  if (!weaknesses.length) weaknesses.push("No obvious structural omission was detected. Audience relevance, truth of claims, and performance still require review.");

  // Reorder the supplied product copy, preserving its facts and CTA. Never turn
  // the advertised product into an advertisement for this writing tool.
  const body = lines.filter(s => s !== cta && s !== proof);
  const benefit = body.find(s => /\b(helps?|save|without|so you|built|designed|lets? you|with|for your)\b/i.test(s)) ?? body[body.length - 1] ?? opening;
  const remaining = body.filter(s => s !== benefit).join(" ");
  const action = cta ?? "[Add one next step that matches your offer and destination.]";
  const lead: Record<string, string> = {
    "ugc-casual": "Here's the idea:", "direct-response": "Take a closer look:",
    "professional-b2b": "The practical value:", "playful-humor": "Plot twist:",
    "luxury-premium": "Consider the details.", "empathetic": "A little support can make a difference.",
    "bold-edgy": "Look at it differently.", "inspirational": "Start with what's possible."
  };
  const unique = (values: string[]) => [...new Set(values.filter(Boolean))].join(" ");
  return { signals, strengths, weaknesses, improvements, rewrites: [
    { key: "benefit", framework: "Benefit first", whenToUse: "Test when the audience needs to understand the practical value quickly.", parts: [
      { label: "Hook", text: `${lead[voice.value]} ${benefit}` },
      { label: "Body", text: unique([remaining, proof ?? ""]) || "[Add a specific product detail.]" },
      { label: "CTA", text: action }
    ] },
    { key: "detail", framework: proof ? "Evidence first" : "Product first", whenToUse: proof ? "Test when credible evidence can answer an objection. Verify the supplied claim before publishing." : "Test when showing what the product does is more useful than amplifying a problem.", parts: [
      { label: "Hook", text: proof ?? benefit },
      { label: "Body", text: unique(proof ? [benefit, remaining] : [remaining]) || "[Demonstrate the product here.]" },
      { label: "CTA", text: action }
    ] },
    { key: "concise", framework: "Short direct version", whenToUse: "Test a focused edit against the fuller versions. Keep material offer conditions when publishing.", parts: [
      { label: "Hook", text: opening },
      { label: "Body", text: unique([benefit === opening ? "" : benefit, proof ?? ""]) || "[Show the product in use.]" },
      { label: "CTA", text: action }
    ] }
  ] };
}
