"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"
import type { Variants } from "motion/react"

type Variant = "solid" | "glass"

interface HeroButtonProps {
  children: React.ReactNode
  variant?: Variant
  onClick?: () => void
}

/** How far (fraction of the pointer offset) the button leans toward the cursor. */
const MAGNET_STRENGTH = 0.3

const SPRING = { stiffness: 220, damping: 16, mass: 0.6 }

const shine: Variants = {
  rest: { x: "-140%", transition: { duration: 0 } },
  hover: { x: "140%", transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  tap: { x: "140%", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const styles: Record<Variant, string> = {
  solid:
    "bg-white text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.45)]",
  glass:
    "border border-white/40 bg-white/10 text-white backdrop-blur-md shadow-[0_10px_40px_-14px_rgba(0,0,0,0.8)]",
}

const shineColor: Record<Variant, string> = {
  solid: "via-black/15",
  glass: "via-white/45",
}

/**
 * Premium CTA: springy scale on hover/tap, a diagonal shine sweep, and a
 * magnetic pull toward the cursor (mouse only; touch devices get the tap
 * spring + shine instead, since there is no hover).
 *
 * The magnet listens on a padded wrapper so the pull starts just before the
 * pointer actually reaches the button.
 */
export function HeroButton({
  children,
  variant = "solid",
  onClick,
}: HeroButtonProps) {
  const zoneRef = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), SPRING)
  const y = useSpring(useMotionValue(0), SPRING)

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return
    const zone = zoneRef.current
    if (!zone) return
    const rect = zone.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * MAGNET_STRENGTH)
    y.set((event.clientY - (rect.top + rect.height / 2)) * MAGNET_STRENGTH)
  }

  const release = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={zoneRef}
      onPointerMove={onPointerMove}
      onPointerLeave={release}
      onPointerCancel={release}
      className="-m-3 w-full p-3 sm:w-auto"
    >
      <motion.button
        type="button"
        onClick={onClick}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap="tap"
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.07 },
          tap: { scale: 0.94 },
        }}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
        style={{ x, y }}
        className={`relative isolate flex min-h-14 w-full cursor-pointer touch-manipulation items-center justify-center overflow-hidden rounded-full px-10 font-sans text-sm font-semibold tracking-[0.22em] uppercase select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto sm:min-w-48 ${styles[variant]}`}
      >
        <span className="relative z-10">{children}</span>
        <motion.span
          aria-hidden="true"
          variants={shine}
          className={`pointer-events-none absolute inset-y-0 left-0 z-0 w-1/2 -skew-x-[22deg] bg-gradient-to-r from-transparent ${shineColor[variant]} to-transparent`}
        />
      </motion.button>
    </div>
  )
}
