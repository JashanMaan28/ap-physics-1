import type { Metadata } from "next";
import { Lexend, JetBrains_Mono } from "next/font/google";
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
  title: "AP Physics 1 — Fluids",
  description:
    "Interactive study material for the AP Physics 1 Fluids unit: pressure, buoyancy, continuity, and Bernoulli's equation.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
