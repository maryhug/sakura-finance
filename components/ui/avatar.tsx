import { cn, getInitials } from "@/lib/utils"

interface AvatarProps {
  name?: string | null
  image?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClass = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" }

export function Avatar({ name, image, size = "md", className }: AvatarProps) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? "avatar"}
        className={cn("rounded-full object-cover border-2 border-[var(--border)]", sizeClass[size], className)}
      />
    )
  }
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold border-2 border-sakura-200",
        "bg-gradient-to-br from-sakura-300 to-sakura-500 text-white",
        sizeClass[size],
        className
      )}
    >
      {getInitials(name ?? "S")}
    </div>
  )
}
