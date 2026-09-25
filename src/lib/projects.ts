export type ProjectStatus = "Generated" | "Draft" | "Exported";

export interface Project {
  id: string;
  name: string;
  items: number;
  date: string;
  status: ProjectStatus;
  description: string;
  platform: string;
  framework: string;
  hook: string;
  body: string;
  cta: string;
  /** Optional creative image in /public/images. Falls back to a gradient. */
  image?: string;
  /** Tailwind gradient classes used when there is no image. */
  gradient: string;
  /** These are pre-loaded demo projects, not real user data. */
  sample: boolean;
}

// Shared source of truth for the dashboard grid and the project detail pages.
export const projects: Project[] = [
  {
    id: "1",
    name: "Q1 Fitness Campaign",
    items: 12,
    date: "Mar 10, 2026",
    status: "Draft",
    description:
      "App conversion campaign targeting men & women 18-35 for new-year fitness resolutions.",
    platform: "TikTok / IG Reels",
    framework: "PAS Framework (Problem, Agitate, Solution)",
    hook: '"Are you tired of starting over every single January?"',
    body: "You hit the gym for two weeks, get overwhelmed by the confusing equipment, and lose all motivation by February. It's frustrating and expensive. But what if you had a personal trainer in your pocket that built custom workouts for your exact body and goals? Introducing FitPro.",
    cta: '"Download now and get your first 30 days free!"',
    image: "/images/fitness_ad.png",
    gradient: "from-emerald-500/30 to-teal-500/20",
    sample: true,
  },
  {
    id: "2",
    name: "SaaS Explainer Concepts",
    items: 8,
    date: "Mar 08, 2026",
    status: "Draft",
    description: "B2B lead-generation campaign for a new AI analytics feature.",
    platform: "YouTube Shorts",
    framework: "BAB Framework (Before, After, Bridge)",
    hook: '"Your team is spending 15 hours a week manually pulling reports."',
    body: "Imagine clicking one button and having all your multi-channel data normalized, visualized, and ready for your Monday meeting. Spectra AI connects to all your existing tools out-of-the-box and does the heavy lifting for you.",
    cta: '"Start your 14-day free trial today."',
    image: "/images/saas_ad.png",
    gradient: "from-blue-500/30 to-indigo-500/20",
    sample: true,
  },
  {
    id: "3",
    name: "Holiday Promo UGC",
    items: 24,
    date: "Mar 01, 2026",
    status: "Draft",
    description: "End-of-year Q4 sales push leveraging user-generated content.",
    platform: "Meta Advantage+ (Facebook & Instagram)",
    framework: "4 P's (Promise, Picture, Proof, Push)",
    hook: '"Get the perfect gift for them, and peace of mind for you."',
    body: "Picture the smile on their face when they unwrap the cozy comfort they've been asking for. Over 10,000 happy customers agree this is the best purchase they've made all year. But hurry, our holiday shipping cutoff is in 48 hours.",
    cta: '"Click here to shop the 30% off Holiday Sale before it\'s gone!"',
    image: "/images/holiday_ad.png",
    gradient: "from-rose-500/30 to-orange-500/20",
    sample: true,
  },
  {
    id: "4",
    name: "Glow Serum DTC Launch",
    image: "/images/serum_ad.svg",
    items: 16,
    date: "Feb 22, 2026",
    status: "Draft",
    description:
      "Cold-traffic acquisition for a vitamin-C serum targeting women 25-45 with sensitive skin.",
    platform: "TikTok / IG Reels",
    framework: "AIDA Framework (Attention, Interest, Desire, Action)",
    hook: '"That \'healthy glow\' filter everyone\'s using? You won\'t need it after 14 days."',
    body: "Most serums promise the world and sting your skin on day one. Ours is different — a fragrance-free 15% vitamin-C formula that dermatologists actually recommend for sensitive skin. In a 4-week trial, 9 out of 10 users saw brighter, more even skin without a single breakout.",
    cta: '"Try it for 30 days. Love it or your money back — tap to claim 20% off your first bottle."',
    gradient: "from-amber-500/30 to-pink-500/20",
    sample: true,
  },
  {
    id: "5",
    name: "Fintech App Awareness",
    image: "/images/fintech_ad.svg",
    items: 10,
    date: "Feb 15, 2026",
    status: "Draft",
    description:
      "Top-of-funnel awareness for a budgeting app aimed at Gen-Z first-time savers.",
    platform: "YouTube Shorts",
    framework: "FAB Framework (Features, Advantages, Benefits)",
    hook: '"Your bank app tells you what you spent. Ours tells you what you can actually spend."',
    body: "Feature: a real-time safe-to-spend balance after bills and savings goals. Advantage: no more mental math or surprise overdrafts. Benefit: you hit the weekend knowing exactly what's yours to enjoy — guilt-free.",
    cta: '"Download free. Set up your first savings goal in under 2 minutes."',
    gradient: "from-cyan-500/30 to-violet-500/20",
    sample: true,
  },
];

export const getProject = (id: string): Project | undefined =>
  projects.find((p) => p.id === id);
