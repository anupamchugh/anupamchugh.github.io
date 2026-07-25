export const siteConfig = {
  name: "Anupam Chugh",
  title: "anupam chugh - software engineer and writer",
  description:
    "started in code. got pulled into the creator economy. tried ai scaffolding. came back to human writing.",
  url: "https://anupamchugh.github.io",
  caseStyle: "lowercase",
  social: {
    twitter: "https://twitter.com/chughanupam",
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
  eyebrow: "software engineer, writer, app maker",
  headline: "started in code.",
  headlineGradient: "got pulled into the creator economy.",
  headlineSuffix: "tried ai scaffolding. came back to human writing.",
  intro:
    "i have been writing on the web since 2015: android tutorials, swiftui experiments, medium-era satire, app store projects, and now a slower public archive of the work that still feels alive.",
  primaryCta: { label: "read the writing", href: "/posts/" },
  secondaryCta: { label: "see the work", href: "/work/" },
};

export type Stat = { label: string; value: string; description?: string };

export const heroStats: Stat[] = [
  { label: "writing since", value: "2015", description: "tutorials, essays, satire" },
  { label: "open source", value: "900+", description: "stars on iowncode" },
  { label: "archive", value: "300+", description: "articles and drafts under review" },
  { label: "apps", value: "10+", description: "small shipped experiments" },
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
    name: "Find Common Ground",
    slug: "common-ground",
    description: "helps groups find overlapping saved places without sending the decision to a server.",
    status: "live",
    href: "https://apps.apple.com/us/app/find-common-ground/id6759101340",
    icon: "/app-icons/common-ground.png",
    tags: ["places", "swiftui"],
  },
  {
    name: "Playlist Hunter",
    slug: "playlist-hunter",
    description: "turns a prompt into an apple music playlist.",
    status: "live",
    href: "https://apps.apple.com/in/app/playlist-hunter/id6756028972",
    icon: "/app-icons/playlist-hunter.png",
    tags: ["music", "ai"],
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
    tags: ["rss", "reading"],
  },
  {
    name: "getNod",
    slug: "getnod",
    description: "a small app for sending a nod to someone who knows.",
    status: "live",
    href: "https://apps.apple.com/us/app/getnod/id6761169513",
    tags: ["social", "ios"],
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
  {
    name: "stockshots",
    description:
      "a trading signal surface still being built. not presented as live until the product is actually ready.",
    href: "https://github.com/anupamchugh/kite-trading-platform",
    status: "building",
    tags: ["trading", "ios"],
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
    year: "2024",
    title: "building again",
    description: "small apps, trading systems, writing tools, and experiments with ai-assisted software.",
    tags: ["apps", "ai"],
  },
  {
    year: "2026",
    title: "human writing",
    description: "less scaffolding, more ownership. public notes where the voice matters as much as the system.",
    tags: ["writing", "archive"],
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
