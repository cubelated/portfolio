import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://cubelated.com"),
  title: {
    default: "Cubelated | Hanssen Budisantoso Wijaya",
    template: "%s | Cubelated",
  },
  description:
    "Portfolio of Hanssen Budisantoso Wijaya, a software engineer in Taichung building impactful mobile apps, full-stack products, and infrastructure platforms.",
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
    title: "Cubelated | Building to Impact Lives",
    description: "Software engineer building dependable products that make complex work feel simple.",
    siteName: "Cubelated",
    url: "https://cubelated.com/",
    images: [{ url: "/hanssen-profile.jpg", width: 683, height: 721, alt: "Hanssen Budisantoso Wijaya" }],
    firstName: "Hanssen",
    lastName: "Wijaya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cubelated | Building to Impact Lives",
    description: "Software engineer building dependable products that make complex work feel simple.",
    images: ["/hanssen-profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  other: { "codex-preview": "development" },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/hanssen-profile.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5fa" },
    { media: "(prefers-color-scheme: dark)", color: "#220b36" },
  ],
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
