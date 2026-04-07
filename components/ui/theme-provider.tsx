"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client after the first render
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // If not mounted, we render a "fragment" so the server-side HTML
  // does not contain any of the theme-provider's injected scripts.
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}