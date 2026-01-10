import type { Metadata } from "next";
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
  title: "Geek Mini - Test Your Knowledge",
  description: "Quick knowledge games powered by Geek Protocol. Challenge yourself with daily quizzes and speed rounds!",
  keywords: ["quiz", "trivia", "knowledge", "games", "kaspa", "blockchain", "learning"],
  authors: [{ name: "Geek Protocol" }],
  openGraph: {
    title: "Geek Mini - Test Your Knowledge",
    description: "Quick knowledge games powered by Geek Protocol. Challenge yourself with daily quizzes and speed rounds!",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
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
