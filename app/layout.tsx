import type { Metadata } from "next";
import { ThemeProvider } from "../components/ui/theme-provider";
import "./globals.css";
import Footer from "@/components/ui/Footer";
import SessionWrapper from "@/components/SessionWrapper"; // Import your wrapper

export const metadata: Metadata = {
  title: "Zemlo | Next-Gen Web Solutions",
  description: "High-performance applications built with Next.js and shadcn/ui.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // CRITICAL: suppressHydrationWarning must be here for next-themes
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        {/* 1. Wrap everything in SessionWrapper first */}
        <SessionWrapper>
          {/* 2. Then the ThemeProvider */}
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <main className="grow">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}

