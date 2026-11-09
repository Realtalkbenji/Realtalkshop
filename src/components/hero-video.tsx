"use client"

import { useEffect, useRef } from "react"
import { PingPongLoop } from "@/lib/ping-pong-loop"

const SOURCES = {
  desktop: "/realtalk-hero.mp4",
  mobile: "/realtalk-hero-720.mp4",
} as const
const POSTER = "/realtalk-poster.jpg"

/** Phones and small tablets get the lighter 720p encode. */
const MOBILE_QUERY = "(max-width: 820px)"
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

/**
 * Full-bleed, forward/reverse looping hero video.
 *
 * Landscape: covers the whole viewport (object-fit: cover, centered).
 * Portrait:  the footage is 16:9 with a circular fisheye vignette, so covering
 *            a tall phone screen would slice the stall in half. Instead the
 *            video fills the top of the screen at a gentler crop and fades
 *            into black (the vignette is already near-black at its edges),
 *            leaving clean room below for the text and buttons.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduced = window.matchMedia(REDUCED_MOTION_QUERY)
    const mobile = window.matchMedia(MOBILE_QUERY)
    let loop: PingPongLoop | null = null

    const start = () => {
      if (loop) return
      const src = mobile.matches ? SOURCES.mobile : SOURCES.desktop
      // Set the source only on the client so we never download both files.
      if (!video.getAttribute("src")?.endsWith(src)) {
        video.src = src
        video.load()
      }
      loop = new PingPongLoop(video)
      loop.start()
    }

    const stop = () => {
      loop?.stop()
      loop = null
    }

    // Respect "reduce motion": show the still poster instead of a moving loop.
    const sync = () => (reduced.matches ? stop() : start())
    sync()
    reduced.addEventListener("change", sync)

    return () => {
      reduced.removeEventListener("change", sync)
      stop()
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden bg-black"
    >
      {/* Video stage: full-screen in landscape, top block in portrait. */}
      <div className="absolute inset-0 portrait:top-[8svh] portrait:bottom-auto portrait:h-[min(56svh,calc(100vw*0.85))] portrait:[mask-image:linear-gradient(to_bottom,transparent_0%,#000_16%,#000_62%,transparent_100%)]">
        <video
          ref={videoRef}
          className="size-full object-cover object-center"
          poster={POSTER}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
        />
      </div>

      {/* Readability overlay: darker where the text sits (bottom), plus a
          soft edge vignette that echoes the fisheye frame. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.5)_32%,rgba(0,0,0,0.18)_62%,rgba(0,0,0,0.3)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  )
}
