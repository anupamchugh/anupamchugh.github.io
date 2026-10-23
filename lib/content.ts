import appRecords from "../content/apps.json";
import resumeRecord from "../content/resume.json";

export const resume = resumeRecord;

export const siteConfig = {
  name: "Anupam Chugh",
  title: "anupam chugh - ios & macos engineer",
  description:
    "eleven years of apps, two and a half editing other engineers. the writing is an archive. the work is shipping.",
  url: "https://anupamchugh.github.io",
  caseStyle: "lowercase",
  social: {
    twitter: "https://x.com/chughgpt",
    github: "https://github.com/anupamchugh",
    linkedin: "https://linkedin.com/in/anupamchugh",
  },
};

export type NavItem = { href: string; label: string };

export const navItems: NavItem[] = [
  { href: "/posts/", label: "writing" },
  { href: "/work/", label: "work" },
  { href: "/apps/", label: "apps" },
  { href: "/photos/", label: "photos" },
  { href: "/notes/", label: "notes" },
  { href: "/reviews/", label: "reviews" },
  { href: "/review/", label: "review" },
  { href: "/about/", label: "about" },
];

export const heroContent = {
  eyebrow: "ios & macos engineer, former editor of better programming",
  headline: "started in code.",
  headlineGradient: "held the board back.",
  headlineSuffix: "now i ship small apps.",
  intro:
    "i began building apps for fun and started an e-commerce startup. it did not pan out. the consolation prize is shipping. the essays from journaldev and better programming stay here as an archive, not as a current blog.",
  primaryCta: { label: "see the apps", href: "/apps/" },
  secondaryCta: { label: "the archive", href: "/posts/" },
};

export type Stat = { label: string; value: string; description?: string };

export const heroStats: Stat[] = [
  { label: "writing", value: "2015–23", description: "archive, not a current blog" },
  { label: "open source", value: "900+", description: "stars on iowncode" },
  { label: "archive", value: "300+", description: "articles and drafts under review" },
  { label: "apps", value: "18", description: "small shipped experiments" },
];

export type AppItem = {
  name: string;
  slug: string;
  description: string;
  status: "live" | "preview" | "building" | "archive";
  href: string;
  icon?: string;
  tags: string[];
};

export const apps: AppItem[] = appRecords.map((record) => {
  const status = record.status;
  if (status !== "live" && status !== "preview" && status !== "building" && status !== "archive") {
    throw new Error(`Unknown app status for ${record.name}: ${status}`);
  }
  return {
    name: record.name,
    slug: record.slug,
    description: record.description,
    status,
    href: record.href,
    icon: record.icon,
    tags: [...record.tags],
  };
});

export type WorkItem = {
  name: string;
  description: string;
  href: string;
  status: "live" | "building" | "archive" | "writing";
  tags: string[];
  image?: string;
};

export const selectedWork: WorkItem[] = [
  {
    name: "vision credit scan",
    description:
      "real-time credit card scanning using rectangle detection and OCR on the selected region.",
    href: "https://github.com/anupamchugh/VisionCreditScan",
    status: "archive",
    tags: ["vision", "ocr"],
  },
  {
    name: "best face from live photos",
    description:
      "a Vision experiment for scoring faces and finding the best expression inside Live Photos.",
    href: "https://github.com/anupamchugh/iowncode/tree/master/iOSVisionFaceQualityLivePhoto",
    status: "archive",
    tags: ["vision", "live photos"],
  },
  {
    name: "swipeless tinder",
    description:
      "a tinder-style card stack controlled by vision hand pose and face gestures. thumbs up, swipe right.",
    href: "https://github.com/anupamchugh/iOS14VisionHandPose",
    status: "archive",
    tags: ["vision", "swiftui"],
  },
  {
    name: "emoji hunt",
    description:
      "a SwiftUI and Core ML camera game where the app hunts for emoji-like objects in the real world.",
    href: "https://github.com/anupamchugh/iowncode/tree/master/SwiftUICoreMLEmojiHuntGame",
    status: "archive",
    tags: ["core ml", "game"],
  },
];

// This is intentionally a hand-maintained shelf. Public does not mean reviewed;
// only projects explicitly checked for ownership and presentation belong here.
export const recentlyReviewedProjects: WorkItem[] = [
  {
    name: "pastport",
    description:
      "on-device Safari history intelligence for macOS, with local answers grounded in your own browsing history.",
    href: "https://github.com/anupamchugh/pastport/releases/latest",
    status: "live",
    tags: ["macOS", "Foundation Models", "reviewed 2026"],
  },
  {
    name: "takeout tax",
    description:
      "a local CLI that turns a Google Takeout export into an invoice for the migration cost of products that disappeared.",
    href: "/work/takeout-tax/",
    status: "archive",
    tags: ["javascript", "privacy", "reviewed 2026"],
  },
];

export type TimelineItem = {
  year: string;
  title: string;
  description: string;
  tags?: string[];
};

export const timeline: TimelineItem[] = [
  {
    year: "2015",
    title: "started writing",
    description: "android tutorials, freelance work, and the first lesson that writing can teach code back.",
    tags: ["android", "journaldev"],
  },
  {
    year: "2019",
    title: "swiftui and vision",
    description: "early swiftui, core ml, vision, arkit, and a lot of public experiments.",
    tags: ["swiftui", "core ml"],
  },
  {
    year: "2020",
    title: "creator economy",
    description: "medium, better programming, newsletters, traffic, curation, and platform dependency.",
    tags: ["medium", "editing"],
  },
  {
    year: "2021",
    title: "the editor",
    description: "took over better programming from zack shapiro, handed it to mihai banulescu in 2023.",
    tags: ["medium", "editing"],
  },
  {
    year: "2024",
    title: "shipping apps",
    description: "rifflet, orbits, echohunt, and a shelf of small apple apps. writing stays in the archive.",
    tags: ["apps", "ios"],
  },
];

export const writingShelves = [
  {
    name: "best work",
    description: "edited essays and projects that should represent the site first.",
    href: "/work/",
  },
  {
    name: "tutorial archive",
    description: "swiftui, vision, core ml, arkit, android, and old framework notes.",
    href: "/posts/",
  },
  {
    name: "humor and satire",
    description: "medium-era pieces that should live in a curated shelf, not dominate the homepage.",
    href: "/humor/",
  },
];

export const humorShelf = [
  {
    title: "if apps were people you knew",
    href: "/posts/If-Apps-Were-People-You-Knew-107d97eaea9/",
    note: "the cleanest local tech satire shelf-starter.",
  },
  {
    title: "if programming languages had honest slogans",
    href: "/posts/If-Programming-Languages-Had-Honest-Slogans/",
    note: "medium-era joke format, still useful as archive texture.",
  },
  {
    title: "what if brand slogans were brutally honest?",
    href: "/posts/What-if-brand-slogans-were-brutally-honest/",
    note: "belongs here, not in the main work feed.",
  },
  {
    title: "if netflix was your girlfriend",
    href: "/posts/If-Netflix-Was-Your-Girlfriend-c54d704646a9/",
    note: "keep only if the shelf is explicitly labeled as old satire.",
  },
];
