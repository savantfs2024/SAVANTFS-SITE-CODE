// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Savant Financial Solutions — Mortgages made clear",
  description:
    "Savant helps Australians secure the right home, investment, or commercial finance—without the jargon. Personal advice, fast turnaround, and tailored options.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
