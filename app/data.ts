// Stand-in photos (Unsplash). Swap for your own files in public/, e.g. "/work/app1.jpg".
const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=720&q=75&auto=format&fit=crop`;

export const contact = {
  email: "prashantvashisth56@gmail.com",
  phone: "+91-7015535765",
  location: "Gurugram, India",
  linkedin: "https://www.linkedin.com/", // TODO: your profile URL
  github: "https://github.com/", // TODO: your profile URL
};

export const stats = [
  { value: 4, suffix: "+", label: "Years shipping mobile" },
  { value: 10, suffix: "K+", label: "Active users served" },
  { value: 60, suffix: "%", label: "Crash rate cut" },
  { value: 15, suffix: "+", label: "Production features" },
];

// Recent Work. Real screenshots: apps from their App Store / Play listings, sites captured from the live pages.
type Project = {
  name: string; tag: string; desc: string;
  kind: "app" | "web"; shots: string[]; image: string;
  ios?: string; android?: string; url?: string;
};
const project = (p: Omit<Project, "image">): Project => ({ ...p, image: p.shots[0] });

export const apps: Project[] = [
  project({
    name: "TVS Credit App", kind: "app", tag: "Fintech · Consumer",
    desc: "Customer lending app: loans, EMIs, statements, offers and self-service.",
    shots: ["/work/tvs-credit/1.png", "/work/tvs-credit/2.png", "/work/tvs-credit/3.png"],
    android: "https://play.google.com/store/apps/details?id=com.tvscs.tvscreditapp",
  }),
  project({
    name: "TVS Credit Dealer App", kind: "app", tag: "Fintech · B2B",
    desc: "Dealer app for disbursals, performance, reports and commission tracking.",
    shots: ["/work/tvs-dealer/1.jpg", "/work/tvs-dealer/2.jpg", "/work/tvs-dealer/3.jpg"],
    ios: "https://apps.apple.com/in/app/tvs-credit-dealer-app/id6504914044",
    android: "https://play.google.com/store/apps/details?id=com.tvscs.dealerapp",
  }),
  project({
    name: "BrokerApp", kind: "app", tag: "Real estate · Social",
    desc: "Global real-estate platform: listings, broker chat, reels and stories.",
    shots: ["/work/brokerapp/1.jpg", "/work/brokerapp/2.jpg", "/work/brokerapp/3.jpg"],
    ios: "https://apps.apple.com/in/app/brokerapp/id6480364900",
    android: "https://play.google.com/store/apps/details?id=com.brokerapp.broker",
  }),
  project({
    name: "FXCareer EU", kind: "app", tag: "Jobs · Fintech",
    desc: "Recruitment platform for Forex and Fintech jobs, for candidates and employers.",
    shots: ["/work/fxcareer/1.jpg", "/work/fxcareer/2.jpg", "/work/fxcareer/3.jpg"],
    ios: "https://apps.apple.com/in/app/fxcareer-eu/id6759370193",
    android: "https://play.google.com/store/apps/details?id=eu.fxcareer.mobile",
  }),
  project({
    name: "Opsvo", kind: "web", tag: "AI · Commerce",
    desc: "Trust layer for agentic commerce: verifies stores so AI shopping agents can buy safely.",
    shots: ["/work/opsvo/1.jpg", "/work/opsvo/2.jpg"],
    url: "https://opsvo.ai/",
  }),
  project({
    name: "Content Floww", kind: "web", tag: "Agency · Web",
    desc: "Site for a media growth partner to finance and AI companies.",
    shots: ["/work/contentfloww/1.jpg"],
    url: "https://www.contentfloww.com/",
  }),
  project({
    name: "Yours Buddy", kind: "web", tag: "Agency · Web",
    desc: "Site for a post-production and content growth studio.",
    shots: ["/work/yoursbuddy/1.jpg", "/work/yoursbuddy/2.jpg"],
    url: "https://www.yoursbuddy.in/",
  }),
];

export const experience = [
  {
    role: "Senior React Native Developer",
    company: "TVS Credit Services Ltd.",
    short: "TVS Credit",
    tags: ["React Native", "Redux", "OpenAI", "Embeddings", "Crashlytics", "CI/CD"],
    image: u("1555066931-4365d14bab8c"),
    period: "Jul 2025 — Present",
    points: [
      "Own architecture, navigation and Redux for fintech apps on iOS & Android.",
      "Cut crash rate 60% via rendering and error-handling work (Crashlytics).",
      "Shipped an OpenAI-powered FAQ chatbot and embeddings-based policy search.",
      "Own App Store / Play releases and CI/CD; promoted within 6 months.",
    ],
  },
  {
    role: "Senior React Native Developer",
    company: "Silver Stone Realty",
    short: "Silver Stone",
    tags: ["React Native", "SQLite", "Push", "Deep Links", "Native Modules"],
    image: u("1512941937669-90a1b58e7e9c"),
    period: "Sep 2023 — Jul 2025",
    points: [
      "Real-estate apps for 10,000+ active users; +35% engagement.",
      "Offline-first with SQLite, push + deep linking, custom native modules.",
      "Reduced memory usage 25% through component refactoring.",
    ],
  },
  {
    role: "React Native Developer",
    company: "YaMarkets",
    short: "YaMarkets",
    tags: ["React Native", "Real-time Data", "Component Library"],
    image: u("1590283603385-17ffb3a7f29f"),
    period: "Jan 2023 — Sep 2023",
    points: [
      "Real-time market data visualisation for 5,000+ daily traders, 99.5% uptime.",
      "Reusable library of 30+ components; 40% faster feature delivery.",
    ],
  },
  {
    role: "React Developer",
    company: "Dignifyd",
    short: "Dignifyd",
    tags: ["React.js", "Performance"],
    image: u("1498050108023-c5249f4df085"),
    period: "Oct 2022 — Jan 2023",
    points: ["React web apps for 2,000+ concurrent users; 30% faster page loads."],
  },
];

export const skills = [
  "React Native", "TypeScript", "Expo / EAS", "Redux Toolkit", "React Navigation",
  "Native Modules", "SQLite", "Firebase", "Push & Deep Links", "Jest + RNTL",
  "CI/CD", "OpenAI API", "LangGraph", "RAG / Embeddings", "MCP", "React.js",
];

// Hero cursor-follow images (landscape): live screenshots of sites you built. Cycles across the 3x2 hero grid.
export const heroImages = [
  "/work/opsvo/1.jpg",
  "/work/contentfloww/1.jpg",
  "/work/yoursbuddy/1.jpg",
  "/work/opsvo/2.jpg",
  "/work/yoursbuddy/2.jpg",
]

// Toolkit carousel cards: official logos (public/tech, from Simple Icons / LobeHub) on the brand colour.
export const toolkit = [
  { name: "React Native", kind: "Core", logos: ["react"], color: "#149eca", desc: "Four years shipping iOS and Android apps from one codebase, from architecture to store release." },
  { name: "TypeScript", kind: "Language", logos: ["typescript"], color: "#3178c6", desc: "Typed apps end to end, so refactors in large fintech codebases stay safe." },
  { name: "Redux Toolkit", kind: "State", logos: ["redux"], color: "#764abc", desc: "Predictable state and navigation for multi-step lending and trading flows." },
  { name: "Native Modules", kind: "Platform", logos: ["android", "apple"], color: "#3ddc84", desc: "Custom native modules when JavaScript alone can't reach the platform." },
  { name: "Offline-first", kind: "Data", logos: ["sqlite"], color: "#0f80cc", desc: "SQLite-backed storage so apps keep working for users without signal." },
  { name: "Firebase & Push", kind: "Engagement", logos: ["firebase"], color: "#f5a000", desc: "Push notifications, deep links and Crashlytics; crash rate cut by 60%." },
  { name: "Testing", kind: "Quality", logos: ["jest", "testinglibrary"], color: "#c21325", desc: "Jest and React Native Testing Library on the flows that matter most." },
  { name: "CI/CD & Releases", kind: "Delivery", logos: ["expo", "githubactions"], color: "#2088ff", desc: "Expo / EAS and CI pipelines; I own App Store and Play releases end to end." },
  { name: "Generative AI", kind: "AI", logos: ["openai", "langchain"], color: "#10a37f", desc: "OpenAI chatbots, embeddings search, RAG, LangGraph and MCP in production apps." },
]

// Career timeline (oldest first): jobs + degrees
export const career = [
  { date: "'22 - '23", org: "Dignifyd", title: "React Developer", desc: "React web apps for 2,000+ concurrent users, with 30% faster page loads.", meta: "Oct 2022 — Jan 2023" },
  { date: "'22 - '25", org: "Mangalayatan University", title: "BCA, Computer Science", desc: "Bachelor of Computer Applications: the foundations under everything since.", meta: "2022 — 2025" },
  { date: "'23", org: "YaMarkets", title: "React Native Developer", desc: "Real-time market data for 5,000+ daily traders at 99.5% uptime, plus a 30+ component library.", meta: "Jan 2023 — Sep 2023" },
  { date: "'23 - '25", org: "Silver Stone Realty", title: "Senior React Native Developer", desc: "Offline-first real-estate apps for 10,000+ active users; engagement up 35%.", meta: "Sep 2023 — Jul 2025" },
  { date: "'25 - Now", org: "TVS Credit", title: "Senior React Native Developer", desc: "Architecture, Redux and releases for fintech apps, with OpenAI features in production.", meta: "Jul 2025 — Present" },
  { date: "'25 - '27", org: "Chandigarh University", title: "MCA, AI & ML", desc: "Master of Computer Applications, specialising in AI and machine learning.", meta: "2025 — 2027" },
];
