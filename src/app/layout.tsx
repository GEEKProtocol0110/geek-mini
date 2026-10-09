import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://geek-mini.vercel.app"),
  title: {
    default: "Geek Mini | Learn Kaspa. Pass it on.",
    template: "%s | Geek Mini",
  },
  description:
    "Play and share quick Kaspa knowledge challenges. Geek Mini is a free learning game by Geek Protocol.",
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
      "Play and share quick Kaspa knowledge challenges. A free learning game by Geek Protocol.",
    type: "website",
    siteName: "Geek Mini",
    url: "https://geek-mini.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: "/opengraph-image", alt: "Geek Mini · Learn Kaspa. Pass it on." }],
    title: "Geek Mini",
    description:
      "Play and share quick Kaspa knowledge challenges. A free learning game by Geek Protocol.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b1014",
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
      <body>{children}</body>
    </html>
  );
}
