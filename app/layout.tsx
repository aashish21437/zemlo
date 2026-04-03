import type { Metadata } from "next";
import "./globals.css";

// We are removing the Geist and Geist_Mono imports here 
// to stop the internal HTTP/2 network error.

export const metadata: Metadata = {
  title: "Zemlo",
  description: "Next.js App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}