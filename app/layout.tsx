// src/app/layout.tsx
import type { Metadata } from "next";
import { ThemeProvider } from "../components/ui/theme-provider";
import "./globals.css";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Zemlo | Next-Gen Web Solutions",
  description: "High-performance applications built with Next.js and shadcn/ui.",
};

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // CRITICAL: suppressHydrationWarning must be here
    <html lang="en" suppressHydrationWarning>
      <head />
      {/* ALSO add it to body for extra safety in Next.js 16 */}
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}