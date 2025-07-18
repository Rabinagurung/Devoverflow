import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Dev OverFlow",
  description:
    "Dev Overflow is a community-driven platform to ask and answer real-world programming questions. Learn, grow, and connect with developers around the world.",
  generator: "Next.js",
  applicationName: "Dev OverFlow",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Dev Overflow",
    "programming questions",
    "developer Q&A",
    "web development",
    "JavaScript",
    "React",
    "Node.js",
    "algorithms",
    "data structures",
    "developer community",
  ],

  authors: [
    { name: "Rabina" },
    { name: "Dev Overflow Team", url: "https://devoverflow.dev/team" },
  ],

  creator: "Rabina",
  publisher: "Dev Overflow",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true, // tells bot can include this page in search results
    follow: true, // bots should follow the links on this page and crawl them too
    nocache: false, // tels bots not to store a cached version of the page
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false, // tells bot not to index any images on the page
    },
  },

  icons: {
    icon: "/images/site-logo.svg", // regular favicon
    shortcut: "/favicon.ico", // browser address bar icon
    apple: "/apple-touch-icon.png", // Apple devices
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },

  openGraph: {
    title: "Dev Overflow | Ask & Answer Programming Questions",
    description:
      "Explore coding topics with help from the global dev community.",
    url: "https://devoverflow.dev",
    siteName: "Dev Overflow",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Dev Overflow OG Banner",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image", //Optimal size for a summary_large_image is around 1200×628 px.
    title: "Dev Overflow on Twitter",
    description: "Get dev answers fast. Join the community.",
    images: ["/images/twitter-banner.png"],
    creator: "@adriandev",
  },

  // Optional: Color for Microsoft tiles and pinned sites
  other: {
    "msapplication-TileColor": "#ffffff",
    "msapplication-TileImage": "/mstile-150x150.png",
  },
};

export const viewport = {
  // Optional: Theme color for browser UI and mobile experience
  width: "device-width",
  initialScale: 1,
  themeColor: "#18181b",
};
