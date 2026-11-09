# REAL TALK SHOP

A single immersive homepage: full-screen fisheye video that plays forward, then
backward, forever, with the brand name, a tagline and two animated buttons on top.

Stack: Next.js (App Router) · React · Tailwind CSS v4 · Motion (`motion/react`).

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Where things live

| File | What it does |
| --- | --- |
| `src/app/page.tsx` | The only page. Video + content. |
| `src/components/hero-video.tsx` | Full-screen video layer, overlay, responsive layout, source selection. |
| `src/lib/ping-pong-loop.ts` | The forward/reverse loop controller (see the header comment). |
| `src/components/hero-content.tsx` | Brand name, tagline, staggered entrance. |
| `src/components/hero-button.tsx` | Magnetic / springy / shine button. |
| `public/realtalk-hero.mp4` | 1080p hero (desktop). |
| `public/realtalk-hero-720.mp4` | 720p hero (phones, ≤ 820px wide). |
| `public/realtalk-poster.jpg` | First-frame poster, shown while loading and for reduced-motion users. |

## Re-encoding the video

The clips are encoded for fast backwards seeking (short GOP, no B-frames). If you
swap in new footage, keep those flags:

```bash
ffmpeg -i source.mov -an -vf "scale=1920:-2,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf 25 \
  -g 8 -keyint_min 8 -sc_threshold 0 -bf 0 -movflags +faststart \
  public/realtalk-hero.mp4
```
