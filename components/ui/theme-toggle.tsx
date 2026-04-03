"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // This ensures the component only renders after the page is fully loaded
    React.useEffect(() => {
        setMounted(true)
    }, [])

    // If the page is still loading, show a transparent box to prevent layout shift
    if (!mounted) return <div className="w-9 h-9" />

    return (
        <Button
            variant="ghost"
            size="icon"
            className="flex items-center justify-center hover:bg-transparent"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
            {resolvedTheme === "dark" ? (
                <Moon className="h-[1.2rem] w-[1.2rem] text-foreground" />
            ) : (
                <Sun className="h-[1.2rem] w-[1.2rem] text-foreground" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}