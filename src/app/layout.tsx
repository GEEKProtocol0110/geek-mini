import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://geek-mini.vercel.app"),
  title: {
    default: "Geek Mini",
    template: "%s | Geek Mini",
  },
  description:
    "Fast, interactive knowledge quizzes powered by Geek Protocol. Play Daily Challenge and Speed Round.",
  applicationName: "Geek Mini",
  keywords: ["quiz", "trivia", "knowledge", "games", "kaspa", "blockchain", "learning"],
  authors: [{ name: "Geek Protocol" }],
  category: "education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Geek Mini",
    description:
      "Fast, interactive knowledge quizzes powered by Geek Protocol. Play Daily Challenge and Speed Round.",
    type: "website",
    siteName: "Geek Mini",
    url: "https://geek-mini.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geek Mini",
    description:
      "Fast, interactive knowledge quizzes powered by Geek Protocol. Play Daily Challenge and Speed Round.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
