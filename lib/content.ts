export const siteConfig = {
  name: "Anupam Chugh",
  title: "Anupam Chugh - Software Engineer & Technical Writer",
  description: "I ship code, then write about it. iOS, AI workflows, and occasionally tools that become obsolete in four days.",
  url: "https://anupamchugh.github.io",
  social: {
    twitter: "https://twitter.com/chughanupam",
    github: "https://github.com/anupamchugh",
    linkedin: "https://linkedin.com/in/anupamchugh",
  },
};

export type NavItem = { href: string; label: string };

export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/posts/", label: "Writing" },
  { href: "/projects/", label: "Projects" },
];

export type Stat = { label: string; value: string; description?: string };

export const heroStats: Stat[] = [
  { label: "Blog Posts", value: "87+", description: "Tutorials, tools, & postmortems" },
  { label: "Years Coding", value: "9+", description: "iOS, Python, TypeScript" },
  { label: "Tools Built", value: "20+", description: "Some survived. Most didn't." },
  { label: "Repos Archived", value: "3", description: "RIP Declutter (2026)" },
];

export const heroContent = {
  eyebrow: "Software Engineer • Technical Writer • Tool Archivist",
  headline: "I ship code.",
  headlineGradient: "Then write about it.",
  headlineSuffix: "Sometimes it survives.",
  intro: "Building iOS apps, AI-assisted workflows, and occasionally tools that become obsolete in four days. I turn debugging sessions into tutorials and postmortems into parodies.",
  primaryCta: { label: "Read the Blog", href: "/posts/" },
  secondaryCta: { label: "View Projects", href: "/projects/" },
};

export type Project = {
  name: string;
  description: string;
  tags: string[];
  href: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "SwiftUI Tutorials",
    description: "Comprehensive tutorials covering SwiftUI fundamentals, animations, custom components, and integration with UIKit.",
    tags: ["SwiftUI", "iOS", "Tutorial"],
    href: "/posts/?tag=swiftui",
    featured: true,
  },
  {
    name: "Core ML Explorations",
    description: "Deep dives into on-device machine learning with Create ML, Core ML, and Vision framework.",
    tags: ["Core ML", "Vision", "AI"],
    href: "/posts/?tag=coreml",
    featured: true,
  },
  {
    name: "iOS 13+ Features",
    description: "Exploring new iOS features as they launch - from Dark Mode to widgets to App Intents.",
    tags: ["iOS", "New Features"],
    href: "/posts/?tag=ios",
    featured: true,
  },
  {
    name: "If Apps Were People",
    description: "A satirical series imagining apps as characters you might know in real life.",
    tags: ["Satire", "Humor"],
    href: "/posts/if-apps-were-people/",
  },
  {
    name: "Programming Language Slogans",
    description: "Honest slogans for programming languages - from Swift's optionals to JavaScript's quirks.",
    tags: ["Satire", "Humor"],
    href: "/posts/programming-languages-honest-slogans/",
  },
  {
    name: "PencilKit & Drawing",
    description: "Tutorials on implementing drawing features with Apple's PencilKit framework.",
    tags: ["PencilKit", "Drawing", "iOS"],
    href: "/posts/?tag=pencilkit",
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
    year: "2026",
    title: "AI-Assisted Workflows",
    description: "Building tools for spec management, task tracking, and agent orchestration. Some survived. Some didn't.",
    tags: ["Claude Code", "Beads", "Shadowbook"],
  },
  {
    year: "2025",
    title: "Trading Platform & CLI Tools",
    description: "Full-stack trading platform with FastAPI, WebSockets, and custom MCP servers. 100+ skills across workflows.",
    tags: ["Python", "FastAPI", "MCP"],
  },
  {
    year: "2024",
    title: "SwiftUI & visionOS",
    description: "Deep diving into SwiftUI's evolution, App Intents, and spatial computing.",
    tags: ["SwiftUI", "visionOS"],
  },
  {
    year: "2023",
    title: "Core ML & Vision",
    description: "On-device ML, object detection, and image classification tutorials.",
    tags: ["Core ML", "Vision"],
  },
  {
    year: "2019",
    title: "SwiftUI Launch",
    description: "Early adopter of SwiftUI, writing tutorials from day one of the beta.",
    tags: ["SwiftUI", "iOS 13"],
  },
  {
    year: "2017",
    title: "iOS Journey Begins",
    description: "Started building iOS apps professionally with Swift.",
    tags: ["Swift", "iOS"],
  },
];

export const featuredTopics = [
  { name: "SwiftUI", count: 25, color: "from-blue-500 to-cyan-500" },
  { name: "Core ML", count: 12, color: "from-purple-500 to-pink-500" },
  { name: "Vision", count: 8, color: "from-green-500 to-emerald-500" },
  { name: "iOS Tips", count: 20, color: "from-orange-500 to-amber-500" },
  { name: "Satire", count: 10, color: "from-rose-500 to-red-500" },
];
