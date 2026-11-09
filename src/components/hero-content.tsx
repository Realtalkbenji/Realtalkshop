"use client"

import { MotionConfig, motion } from "motion/react"
import type { Variants } from "motion/react"
import { HeroButton } from "@/components/hero-button"

const EASE = [0.22, 1, 0.36, 1] as const

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } },
}

const rise: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
}

export function HeroContent() {
  return (
    // "user" => transform/layout animations are skipped for people who ask for
    // reduced motion, while opacity changes still happen.
    <MotionConfig reducedMotion="user">
      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex min-h-svh flex-col items-center justify-end px-5 pt-16 pb-[max(2.5rem,calc(env(safe-area-inset-bottom)+1.5rem))] text-center sm:pb-14"
      >
        <motion.h1
          variants={rise}
          className="font-display text-[clamp(3.25rem,13.5vw,10rem)] leading-[0.92] tracking-[0.01em] text-balance text-white uppercase [text-shadow:0_6px_40px_rgba(0,0,0,0.55)]"
        >
          Real Talk Shop
        </motion.h1>

        <motion.p
          variants={rise}
          className="mt-4 max-w-md text-[0.95rem] leading-relaxed tracking-[0.04em] text-pretty text-white/80 sm:mt-5 sm:max-w-xl sm:text-lg"
        >
          Say it plain. Wear it loud.
        </motion.p>

        <motion.div
          variants={rise}
          className="mt-8 flex w-full max-w-xs flex-col items-center gap-2 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-5"
        >
          <HeroButton variant="solid">Shop Now</HeroButton>
          <HeroButton variant="glass">Lookbook</HeroButton>
        </motion.div>
      </motion.main>
    </MotionConfig>
  )
}
