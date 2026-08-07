# 🎉 Birthday Site

A scroll-driven, animation-heavy one-page birthday site built with Next.js 16,
Tailwind CSS v4 and Motion.

## Run it

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Make it yours

**Everything you need to change lives in one file: `lib/config.ts`.**

| What                    | Where in `lib/config.ts`     |
| ----------------------- | ---------------------------- |
| Name / nickname / age   | `NAME`, `nickname`, `age`    |
| Birthday + countdown    | `birthday` (`YYYY-MM-DD`)    |
| "Days of friendship"    | `friendsSince`               |
| Hero headline & subtitle| `hero`                       |
| Scrolling word strip    | `marquee`                    |
| Story timeline          | `timeline`                   |
| Photo captions          | `photos`                     |
| "Reasons you're great"  | `reasons`                    |
| Gift reveal + coupon    | `gift`                       |
| Cake / wish copy        | `cake`                       |
| The letter              | `letter`                     |
| Closing screen          | `finale`                     |

Change `NAME` at the top and it propagates everywhere, including the page title
and the letter's greeting.

### Photos

Put images in `public/photos/` and add a `src` to the matching entry in
`config.photos` — see `public/photos/README.md`. Entries without a `src` render
a coloured gradient placeholder, so nothing looks broken while you gather them.

### Music

Drop an mp3 at `public/music.mp3` and set `musicSrc: "/music.mp3"` in the
config. A play/pause button appears bottom-right. Leave it empty to hide the
button entirely. Playback is never auto-started — browsers block it, and it
startles people.

## What's on the page

1. **Hero** — kinetic headline, floating balloons, confetti cannons on load
2. **Marquee** — three rows of type that speed up and reverse with your scroll
3. **Countdown** — live flip-digit clock to the big day, plus animated counters
4. **Scroll reveal** — a paragraph that lights up word by word as you scroll
5. **Timeline** — a spine that fills as you travel down it
6. **Gallery** — sticky horizontal polaroid scroll
7. **Reasons** — 3D tilt cards with a pointer-tracking spotlight
8. **Gift box** 🎁 — tap to open; lid flies off, confetti, copyable coupon
9. **Cake** 🎂 — tap the candles, or hit the mic button and *actually blow*
10. **Letter** 💌 — wax-sealed envelope that opens into a handwritten note
11. **Finale** — canvas fireworks, balloon release, replay button

## Notes

- Every animation respects `prefers-reduced-motion`; the site degrades to a
  clean static layout rather than breaking.
- Decorative scatter uses a seeded PRNG so server and client markup match —
  no hydration mismatch, no first-paint flicker.
- The candle mic feature asks for microphone permission and falls back to
  tapping if it's denied. Audio is analysed locally and never leaves the page.
