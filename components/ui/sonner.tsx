"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": "oklch(0.97 0.02 145)",
          "--success-border": "oklch(0.85 0.05 145)",
          "--success-text": "oklch(0.25 0.05 145)",
          "--error-bg": "oklch(0.98 0.02 25)",
          "--error-border": "oklch(0.9 0.08 25)",
          "--error-text": "oklch(0.45 0.15 25)",
          "--warning-bg": "oklch(0.98 0.06 85)",
          "--warning-border": "oklch(0.9 0.1 85)",
          "--warning-text": "oklch(0.4 0.1 85)",
          "--info-bg": "oklch(0.97 0.02 250)",
          "--info-border": "oklch(0.85 0.06 250)",
          "--info-text": "oklch(0.3 0.08 250)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
