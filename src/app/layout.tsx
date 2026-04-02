import type { Metadata } from "next";
import { Lexend, JetBrains_Mono } from "next/font/google";
import { MistakeProvider } from "@/contexts/mistake-context";
import { ProgressProvider } from "@/contexts/progress-context";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AP Physics 1 — Complete Study Guide",
  description:
    "Interactive study app for all 8 AP Physics 1 units with simulations, practice quizzes, flashcards, and FRQ prep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ProgressProvider>
          <MistakeProvider>
            {children}
          </MistakeProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
