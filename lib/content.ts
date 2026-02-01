export const siteConfig = {
  name: "Anupam Chugh",
  title: "Anupam Chugh - iOS Developer & Technical Writer",
  description: "I build apps and write about them. Sometimes funny. iOS, SwiftUI, Core ML, and everything Apple.",
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
  { label: "Blog Posts", value: "84+", description: "Technical tutorials & satire" },
  { label: "Years iOS", value: "7+", description: "Building apps since Swift 2" },
  { label: "Frameworks", value: "15+", description: "SwiftUI, Core ML, Vision, ARKit..." },
  { label: "Apps Shipped", value: "10+", description: "App Store & enterprise" },
];

export const heroContent = {
  eyebrow: "iOS Developer • Technical Writer • Sometimes Comedian",
  headline: "Building apps.",
  headlineGradient: "Writing about them.",
  headlineSuffix: "Sometimes funny.",
  intro: "I explore Apple's latest frameworks and turn complex technical concepts into approachable tutorials. When I'm not coding, I write satirical takes on the tech industry.",
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
    year: "2024",
    title: "SwiftUI Mastery",
    description: "Deep diving into SwiftUI's evolution, App Intents, and visionOS development.",
    tags: ["SwiftUI", "visionOS"],
  },
  {
    year: "2023",
    title: "Core ML & Vision",
    description: "Extensive work with on-device ML, object detection, and image classification.",
    tags: ["Core ML", "Vision"],
  },
  {
    year: "2021",
    title: "SwiftUI 3.0",
    description: "Adopted async/await, new SwiftUI features, and architectural patterns.",
    tags: ["Swift", "Concurrency"],
  },
  {
    year: "2019",
    title: "SwiftUI Launch",
    description: "Early adopter of SwiftUI, writing tutorials from day one of the beta.",
    tags: ["SwiftUI", "iOS 13"],
  },
  {
    year: "2017",
    title: "iOS Development Journey",
    description: "Started building iOS apps professionally, learning Swift and the Apple ecosystem.",
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
