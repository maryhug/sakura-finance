import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  gradient?: boolean
}

export function Card({ className, glow, gradient, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "card-sakura",
        glow && "hover:shadow-[var(--shadow-glow)]",
        gradient && "bg-gradient-to-br from-sakura-50 to-petal-50",
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 p-5 pb-0", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-bold text-base text-[var(--text)] leading-tight", className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-[var(--text-subtle)]", className)} {...props} />
  )
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-4", className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center px-5 pb-5 pt-0 gap-2", className)}
      {...props}
    />
  )
}
