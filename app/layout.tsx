import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["500", "700"] });

export const metadata: Metadata = {
  title: "Prashant Sharma — Senior React Native Developer",
  description: "Senior React Native developer building iOS & Android apps, with production GenAI features.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${display.variable} antialiased`}>{children}</body>
    </html>
  );
}
