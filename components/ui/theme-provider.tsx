"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: any) {
  // We remove the 'mounted' logic entirely.
  // next-themes is designed to handle the injection, 
  // but it needs the suppressHydrationWarning in layout.tsx to stay quiet.
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}