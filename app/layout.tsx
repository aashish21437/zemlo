import type { Metadata } from "next";
import { ThemeProvider } from "../components/ui/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zemlo | Next-Gen Web Solutions",
  description: "High-performance applications built with Next.js and shadcn/ui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}