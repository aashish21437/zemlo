// src/app/layout.tsx
import type { Metadata } from "next";
import { ThemeProvider } from "../components/ui/theme-provider";
import "./globals.css";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Zemlo | Next-Gen Web Solutions",
  description: "High-performance applications built with Next.js and shadcn/ui.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Add suppressHydrationWarning here as well */}
      <body 
        className="antialiased min-h-screen bg-background font-sans" 
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}