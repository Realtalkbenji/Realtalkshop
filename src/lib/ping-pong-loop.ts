/**
 * PingPongLoop
 * ------------
 * Plays an HTMLVideoElement forward to the end, then backwards to the start,
 * then forward again, forever.
 *
 * Why not `video.playbackRate = -1`?
 *   Negative playback rates are only honoured by Safari. Chrome, Edge and
 *   Firefox ignore them (the video simply freezes), so relying on it would
 *   break the loop for most visitors. Instead:
 *
 *   - FORWARD: native playback (`play()`), smooth and hardware accelerated.
 *   - REVERSE: the video is paused and a requestAnimationFrame loop walks
 *     `currentTime` backwards against the real-time clock. If a seek takes
 *     longer than a display frame we skip ahead on the timeline rather than
 *     slowing down, so the reverse pass always lasts exactly as long as the
 *     forward pass.
 *
 *   The hero clip is encoded with short GOPs and no B-frames
 *   (see public/realtalk-hero*.mp4) which makes those backwards seeks cheap.
 *
 * Turning points are seamless because we never seek at them: the reverse pass
 * begins from wherever forward playback stopped, and forward playback resumes
 * from wherever the reverse pass stopped.
 *
 * Edge cases handled:
 *   - duration not known yet / NaN / Infinity
 *   - `ended` firing before our end-detection (rAF throttled, slow device)
 *   - autoplay blocked (retries on the first user gesture)
 *   - tab hidden/shown (pauses, and re-bases the clock so no time jump)
 *   - the browser pausing the video on its own (e.g. iOS power saving)
 *   - huge frame gaps (dt is clamped)
 *   - repeated start()/stop() calls (React strict mode, route changes)
 */

type Direction = "forward" | "reverse";

export interface PingPongOptions {
  /** Reverse speed relative to forward speed. 1 = same speed. */
  reverseRate?: number;
  /**
   * How close to the end (seconds) counts as "finished". Roughly one frame
   * (1/24.5 s ≈ 0.041) so we turn around on the last frame, not after it.
   */
  endEpsilon?: number;
  /** Largest time step (seconds) a single animation frame may advance. */
  maxStep?: number;
}

const GESTURE_EVENTS = ["pointerdown", "touchstart", "keydown"] as const;

export class PingPongLoop {
  private readonly video: HTMLVideoElement
  private readonly reverseRate: number
  private readonly endEpsilon: number
  private readonly maxStep: number

  private direction: Direction = "forward"
  private running = false
  private rafId = 0
  private lastTick = 0
  private reverseTime = 0
  private lastPlayAttempt = 0
  private waitingForGesture = false

  constructor(video: HTMLVideoElement, options: PingPongOptions = {}) {
    this.video = video
    this.reverseRate = options.reverseRate ?? 1
    this.endEpsilon = options.endEpsilon ?? 0.05
    this.maxStep = options.maxStep ?? 0.1
  }

  start(): void {
    if (this.running) return
    this.running = true

    const v = this.video
    // Belt and braces: autoplay requires the element to be muted.
    v.muted = true
    v.defaultMuted = true
    v.loop = false
    v.playbackRate = 1

    v.addEventListener("ended", this.onEnded)
    document.addEventListener("visibilitychange", this.onVisibility)

    this.direction = "forward"
    this.attemptPlay()
    this.scheduleFrame()
  }

  stop(): void {
    if (!this.running) return
    this.running = false

    cancelAnimationFrame(this.rafId)
    this.rafId = 0
    this.removeGestureListeners()

    const v = this.video
    v.removeEventListener("ended", this.onEnded)
    document.removeEventListener("visibilitychange", this.onVisibility)
    v.pause()
  }

  // --- frame loop ---------------------------------------------------------

  private scheduleFrame(): void {
    if (!this.running || this.rafId) return
    this.lastTick = performance.now()
    this.rafId = requestAnimationFrame(this.tick)
  }

  private tick = (now: number): void => {
    this.rafId = 0
    if (!this.running || document.hidden) return
    this.rafId = requestAnimationFrame(this.tick)

    const dt = Math.min(Math.max((now - this.lastTick) / 1000, 0), this.maxStep)
    this.lastTick = now

    const v = this.video
    const duration = v.duration
    // Metadata not loaded yet (NaN) or a live/unknown stream (Infinity).
    if (!Number.isFinite(duration) || duration <= 0) return

    if (this.direction === "forward") {
      this.tickForward(duration)
    } else {
      this.tickReverse(dt)
    }
  }

  private tickForward(duration: number): void {
    const v = this.video

    if (v.ended || v.currentTime >= duration - this.endEpsilon) {
      this.beginReverse(duration)
      return
    }

    // Something paused us (power saving, a stalled play() promise…): recover.
    if (v.paused && !this.waitingForGesture) {
      this.attemptPlay()
    }
  }

  private tickReverse(dt: number): void {
    const v = this.video

    this.reverseTime -= dt * this.reverseRate

    if (this.reverseTime <= 0) {
      this.beginForward()
      return
    }

    // Don't queue seeks on top of each other; the clock keeps running so the
    // next free frame jumps to the correct, current position.
    if (v.seeking) return

    // Skip no-op seeks (display is 60Hz+, the video is ~24fps).
    if (v.currentTime - this.reverseTime < 1 / 120) return

    v.currentTime = this.reverseTime
  }

  // --- direction changes --------------------------------------------------

  private beginReverse(duration: number): void {
    const v = this.video
    v.pause()
    this.direction = "reverse"
    // Start from where forward playback actually stopped: no seek, no jump.
    this.reverseTime = Math.min(v.currentTime, duration)
    this.lastTick = performance.now()
  }

  private beginForward(): void {
    const v = this.video
    this.direction = "forward"
    // Only seek if we're not already at the start (the last reverse seek
    // normally lands within a frame of 0, and seeking would cost a frame).
    if (v.currentTime > 0.1) v.currentTime = 0
    v.playbackRate = 1
    this.attemptPlay()
  }

  // --- playback helpers ---------------------------------------------------

  private attemptPlay(): void {
    const now = performance.now()
    // Don't hammer play() every frame if the browser keeps refusing.
    if (now - this.lastPlayAttempt < 400) return
    this.lastPlayAttempt = now

    const result = this.video.play()
    if (result === undefined) return
    result.then(
      () => {
        this.waitingForGesture = false
        this.removeGestureListeners()
      },
      (error: unknown) => {
        // AbortError: a pause()/seek interrupted play() — harmless, the
        // frame loop will retry. NotAllowedError: autoplay blocked.
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          this.waitForGesture()
        }
      },
    )
  }

  private waitForGesture(): void {
    if (this.waitingForGesture) return
    this.waitingForGesture = true
    for (const type of GESTURE_EVENTS) {
      window.addEventListener(type, this.onGesture, { passive: true })
    }
  }

  private removeGestureListeners(): void {
    for (const type of GESTURE_EVENTS) {
      window.removeEventListener(type, this.onGesture)
    }
  }

  // --- event handlers -----------------------------------------------------

  private onGesture = (): void => {
    this.waitingForGesture = false
    this.removeGestureListeners()
    this.lastPlayAttempt = 0
    if (this.direction === "forward") this.attemptPlay()
  }

  /** `ended` can win the race against our rAF end-detection. */
  private onEnded = (): void => {
    if (!this.running || this.direction !== "forward") return
    const duration = this.video.duration
    if (Number.isFinite(duration) && duration > 0) this.beginReverse(duration)
  }

  private onVisibility = (): void => {
    if (!this.running) return
    if (document.hidden) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
      this.video.pause()
    } else {
      // Re-base the clock so the time we spent hidden isn't "played".
      this.lastTick = performance.now()
      if (this.direction === "forward") {
        this.lastPlayAttempt = 0
        this.attemptPlay()
      }
      this.scheduleFrame()
    }
  }
}
