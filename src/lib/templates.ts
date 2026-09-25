export interface StarterTemplate {
  name: string;
  acronym: string;
  bestFor: string;
  structure: { stage: string; hint: string }[];
  accent: string; // tailwind text/border color base, e.g. "purple"
}

// Curated, real direct-response frameworks so users can see what a good
// saved angle looks like before creating their own.
export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    name: "Problem · Agitate · Solution",
    acronym: "PAS",
    bestFor: "The viewer already feels the problem. Great for cold TikTok/Reels & landing pages.",
    accent: "purple",
    structure: [
      { stage: "Problem", hint: "Name the pain in the first line." },
      { stage: "Agitate", hint: "Twist the knife — what it costs them to ignore it." },
      { stage: "Solution", hint: "Position your product as the obvious fix + CTA." },
    ],
  },
  {
    name: "Attention · Interest · Desire · Action",
    acronym: "AIDA",
    bestFor: "Cold traffic that doesn't know they have a problem. The default for paid social.",
    accent: "blue",
    structure: [
      { stage: "Attention", hint: "A scroll-stopping hook in the first 2 seconds." },
      { stage: "Interest", hint: "Make it relevant to the person watching." },
      { stage: "Desire", hint: "Show the outcome they want + proof." },
      { stage: "Action", hint: "One clear next step." },
    ],
  },
  {
    name: "Before · After · Bridge",
    acronym: "BAB",
    bestFor: "Re-engagement & warm audiences comparing solutions. Strong for organic-style Reels.",
    accent: "emerald",
    structure: [
      { stage: "Before", hint: "The frustrating current reality." },
      { stage: "After", hint: "The dream state once it's solved." },
      { stage: "Bridge", hint: "Your product is how they get there." },
    ],
  },
  {
    name: "Features · Advantages · Benefits",
    acronym: "FAB",
    bestFor: "Comparison shoppers and product demos where specs matter.",
    accent: "amber",
    structure: [
      { stage: "Feature", hint: "What the product has or does." },
      { stage: "Advantage", hint: "Why that feature matters." },
      { stage: "Benefit", hint: "What it means for the viewer's life." },
    ],
  },
  {
    name: "Promise · Picture · Proof · Push",
    acronym: "4 P's",
    bestFor: "Promotions and seasonal pushes that need momentum.",
    accent: "rose",
    structure: [
      { stage: "Promise", hint: "The big outcome up front." },
      { stage: "Picture", hint: "Help them imagine having it." },
      { stage: "Proof", hint: "Reviews, numbers, results." },
      { stage: "Push", hint: "Urgency to act now." },
    ],
  },
  {
    name: "Problem · Amplify · Solution · Transformation · Offer · Response",
    acronym: "PASTOR",
    bestFor: "Warm leads that need trust before they commit.",
    accent: "cyan",
    structure: [
      { stage: "Problem", hint: "State the problem clearly." },
      { stage: "Amplify", hint: "Consequences of not solving it." },
      { stage: "Solution", hint: "Introduce your approach." },
      { stage: "Transformation", hint: "The change it delivers (story/proof)." },
      { stage: "Offer", hint: "Exactly what they get." },
      { stage: "Response", hint: "The specific action to take now." },
    ],
  },
];

export type LibraryItemType = "template" | "reference";

export interface LibraryItem {
  id: string;
  type: LibraryItemType;
  title: string;
  // template
  framework?: string;
  structure?: string;
  // reference / swipe file
  url?: string;
  image?: string; // data URL or external URL
  note?: string;
  createdAt: number;
}
