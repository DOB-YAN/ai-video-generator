import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reapersaint AI - Free Shorts Generator",
  description: "Create unlimited 1-minute AI videos for free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}