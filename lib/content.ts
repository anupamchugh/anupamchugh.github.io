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

export const apps: AppItem[] = [
  {
    name: "Rifflet",
    slug: "rifflet",
    description: "turns a short music idea into a playable piano, guitar, or ukulele lesson.",
    status: "live",
    href: "https://apps.apple.com/us/app/rifflet/id6767064984",
    icon: "/app-icons/rifflet.jpg",
    tags: ["music", "learning", "on-device"],
  },
  {
    name: "Orbits",
    slug: "common-ground",
    description: "plan your own trips and meetups. the store listing is find common ground.",
    status: "live",
    href: "https://apps.apple.com/us/app/find-common-ground/id6759101340",
    icon: "/app-icons/common-ground.png",
    tags: ["places", "swiftui"],
  },
  {
    name: "EchoHunt",
    slug: "playlist-hunter",
    description: "i play music at random hours and never knew why the algorithm picked it, so now i just ask.",
    status: "live",
    href: "https://apps.apple.com/in/app/playlist-hunter/id6756028972",
    icon: "/app-icons/playlist-hunter.png",
    tags: ["music", "ai"],
  },
  {
    name: "Pastport",
    slug: "pastport",
    description: "on-device Safari history intelligence for macOS: movements, bookings, threads, and grounded local answers.",
    status: "live",
    href: "https://github.com/anupamchugh/pastport/releases/latest",
    icon: "/app-icons/pastport.png",
    tags: ["macOS", "on-device", "Foundation Models"],
  },
  {
    name: "Flickpot",
    slug: "flickpot",
    description: "a small iOS flicking game, live on the app store.",
    status: "live",
    href: "https://apps.apple.com/us/app/flickpot/id6766531373",
    icon: "/app-icons/flickpot.png",
    tags: ["game", "ios"],
  },
  {
    name: "Flyleaf Notes",
    slug: "flyleaf",
    description: "a markdown writing desk for local folders, archives, and eventually github publishing.",
    status: "live",
    href: "https://apps.apple.com/us/app/flyleaf-notes/id6764307755",
    icon: "/app-icons/flyleaf.png",
    tags: ["writing", "markdown"],
  },

  {
    name: "ClocktowerTable",
    slug: "clocktower-table",
    description: "a storyteller console and table companion for social deduction nights.",
    status: "live",
    href: "https://apps.apple.com/us/app/clocktowertable/id6761296328",
    icon: "/app-icons/clocktower-table.png",
    tags: ["game aid", "ios"],
  },
  {
    name: "Checkmate Academy",
    slug: "checkmate-academy",
    description: "a chess learning app with lessons, puzzles, ai games, and review tools.",
    status: "live",
    href: "https://apps.apple.com/us/app/checkmate-academy/id6760925352",
    icon: "/app-icons/checkmate-academy.png",
    tags: ["chess", "learning"],
  },
  {
    name: "Feedloom",
    slug: "feedloom",
    description: "an rss reader for keeping up with links and feeds.",
    status: "live",
    href: "https://apps.apple.com/us/app/feedloom/id6761685952",
    icon: "/app-icons/feedloom.jpg",
    tags: ["rss", "reading"],
  },
  {
    name: "getNod",
    slug: "getnod",
    description: "a small app for sending a nod to someone who knows.",
    status: "live",
    href: "https://apps.apple.com/us/app/getnod/id6761169513",
    icon: "/app-icons/getnod.jpg",
    tags: ["social", "ios"],
  },
  {
    name: "Best Face Forward",
    slug: "best-face-forward",
    description: "finds the strongest face frame from a live photo, then lets you tune, save, or share it.",
    status: "live",
    href: "https://apps.apple.com/us/app/best-face-forward/id6766553501",
    icon: "/app-icons/best-face-forward.jpg",
    tags: ["photo", "vision", "on-device"],
  },
  {
    name: "Breakline Surf",
    slug: "breakline-surf",
    description: "compares visible surfing body position in your own photos and videos, privately on device.",
    status: "live",
    href: "https://apps.apple.com/us/app/breakline-surf/id6785873182",
    icon: "/app-icons/breakline-surf.jpg",
    tags: ["surfing", "vision", "on-device"],
  },
  {
    name: "DocPolish",
    slug: "docpolish",
    description: "a private document cleanup app for passports, visas, ids, receipts, and forms.",
    status: "live",
    href: "https://apps.apple.com/us/app/docpolish/id6774345224",
    icon: "/app-icons/docpolish.jpg",
    tags: ["documents", "vision", "privacy"],
  },
  {
    name: "Lineage Mirror",
    slug: "lineage-mirror",
    description: "a private reflection app for exploring family stories, inherited traits, and visible resemblance cues.",
    status: "live",
    href: "https://apps.apple.com/us/app/lineage-mirror/id6774345235",
    icon: "/app-icons/lineage-mirror.jpg",
    tags: ["reflection", "family", "on-device"],
  },
  {
    name: "Pinprint",
    slug: "pinprint",
    description: "a private trip os for collecting saved places, screenshots, tips, documents, and travel memories.",
    status: "live",
    href: "https://apps.apple.com/us/app/pinprint/id6779702946",
    icon: "/app-icons/pinprint.jpg",
    tags: ["travel", "maps", "privacy"],
  },

  {
    name: "RoamProof",
    slug: "roamproof",
    description: "helps travelers plan connectivity before a trip and record where their phone actually worked.",
    status: "live",
    href: "https://apps.apple.com/us/app/roamproof/id6782336949",
    icon: "/app-icons/roamproof.jpg",
    tags: ["travel", "connectivity", "offline"],
  },
  {
    name: "Swell Window",
    slug: "swell-window",
    description: "helps bali and indonesia fast-boat travelers read marine model conditions before they travel.",
    status: "live",
    href: "https://apps.apple.com/us/app/swell-window/id6782342627",
    icon: "/app-icons/swell-window.jpg",
    tags: ["travel", "weather", "marine"],
  },
  {
    name: "The Match Room",
    slug: "the-match-room",
    description: "helps fans, players, coaches, and analysts understand what each match result changes.",
    status: "live",
    href: "https://apps.apple.com/us/app/the-match-room/id6782396757",
    icon: "/app-icons/the-match-room.jpg",
    tags: ["sports", "fixtures", "scenarios"],
  },
];

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
