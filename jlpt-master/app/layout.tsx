import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import ErrorBoundary from "@/components/error-boundary";
import { SkipLink } from "@/components/skip-link";
import { PWA } from "@/components/pwa";
import { InstallPrompt } from "@/components/install-prompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JLPT Master - Japanese Language Learning Platform",
  description: "Master Japanese Language Proficiency Test with comprehensive learning modules for vocabulary, kanji, grammar, reading, listening, and quizzes.",
  keywords: "JLPT, Japanese, language learning, vocabulary, kanji, grammar, N5, N4, N3, N2, N1",
  authors: [{ name: "JLPT Master Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JLPT Master",
  },
  icons: {
    icon: "/icon-192x192.svg",
    apple: "/icon-192x192.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SkipLink />
        <PWA />
        <InstallPrompt />
        <ErrorBoundary>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
