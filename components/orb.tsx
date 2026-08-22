import { cn } from "@/lib/utils"

export function Orb({
  size = 120,
  thinking = false,
  className,
}: {
  size?: number
  thinking?: boolean
  className?: string
}) {
  const outerDots = 12
  const innerDots = 7
  const outerRadius = size / 2 - 6
  const innerRadius = size * 0.31

  return (
    <div
      aria-hidden
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
    >
      <div className="orb-glow" style={{ inset: -size * 0.28 }} />
      <div className={cn("orb-core", thinking && "orb-core--thinking")} />
      <div className={cn("orb-ring", thinking ? "orb-ring--fast" : "")}>
        {Array.from({ length: outerDots }).map((_, i) => (
          <span
            key={i}
            className="orb-dot"
            style={{
              transform: `rotate(${(360 / outerDots) * i}deg) translateY(-${outerRadius}px)`,
            }}
          />
        ))}
      </div>
      <div
        className={cn(
          "orb-ring orb-ring--reverse",
          thinking && "orb-ring--fast"
        )}
      >
        {Array.from({ length: innerDots }).map((_, i) => (
          <span
            key={i}
            className="orb-dot orb-dot--dim"
            style={{
              transform: `rotate(${(360 / innerDots) * i}deg) translateY(-${innerRadius}px)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
