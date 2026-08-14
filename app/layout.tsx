import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://cubelated.com"),
  title: {
    default: "Cubelated | Interactive Pixel Portfolio",
    template: "%s | Cubelated",
  },
  description:
    "Explore the interactive pixel portfolio of Hanssen Budisantoso Wijaya, a mobile and full-stack software engineer building products with purpose.",
  keywords: [
    "Hanssen Budisantoso Wijaya",
    "黃晟旺",
    "Software Engineer Taiwan",
    "Flutter Developer Taiwan",
    "Full Stack Engineer Taichung",
    "Mobile App Developer",
    "System Architecture",
  ],
  authors: [{ name: "Hanssen Budisantoso Wijaya", url: "https://github.com/cubelated" }],
  creator: "Hanssen Budisantoso Wijaya",
  publisher: "Cubelated",
  category: "technology",
  alternates: { canonical: "https://cubelated.com/" },
  openGraph: {
    type: "profile",
    locale: "en_US",
    title: "Cubelated | Interactive Pixel Portfolio",
    description: "Walk through the products, experience, and mission of software engineer Hanssen Budisantoso Wijaya.",
    siteName: "Cubelated",
    url: "https://cubelated.com/",
    images: [{ url: "/hanssen-profile.jpg", width: 683, height: 721, alt: "Hanssen Budisantoso Wijaya" }],
    firstName: "Hanssen",
    lastName: "Wijaya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cubelated | Interactive Pixel Portfolio",
    description: "A playable portfolio about building software with purpose.",
    images: ["/hanssen-profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  other: { "codex-preview": "development" },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#15121c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
