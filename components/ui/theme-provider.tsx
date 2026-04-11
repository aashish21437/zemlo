"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: any) {
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client. 
  // This is the "on-switch" for the theme engine.
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // During the build and initial server render, 
  // we render children WITHOUT the provider.
  // This prevents the forbidden script injection.
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}