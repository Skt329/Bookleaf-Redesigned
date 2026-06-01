import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * BookLeaf Publishing — Root Layout
 * 
 * Configures:
 * - Google Fonts (Playfair Display, DM Sans, JetBrains Mono)
 * - Global metadata for SEO
 * - Theme color for mobile browsers
 */

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bookleafpub.in"),
  title: {
    default: "BookLeaf Publishing — India's Best Self-Publishing Platform",
    template: "%s | BookLeaf Publishing",
  },
  description:
    "Publish your book with India's most trusted self-publishing platform. Featured on Shark Tank India. 12,000+ authors, 150+ countries. Paperback & eBook publishing with 80% royalty.",
  keywords: [
    "self publishing India",
    "publish my book",
    "BookLeaf",
    "self publishing platform",
    "book publishing",
    "Indian authors",
    "paperback publishing",
    "ebook publishing",
    "Shark Tank India publishing",
    "writing challenge",
    "author royalties",
  ],
  authors: [{ name: "BookLeaf Publishing" }],
  creator: "BookLeaf Publishing",
  publisher: "Libresco Feeds Pvt Ltd",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://bookleafpub.in",
    siteName: "BookLeaf Publishing",
    title: "BookLeaf Publishing — India's Best Self-Publishing Platform",
    description:
      "Publish your book with India's most trusted self-publishing platform. Featured on Shark Tank India.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BookLeaf Publishing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BookLeaf Publishing — India's Best Self-Publishing Platform",
    description:
      "Publish your book with India's most trusted self-publishing platform. Featured on Shark Tank India.",
    creator: "@bookleafpublishing",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1812" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="canonical" href="https://bookleafpub.in" />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
