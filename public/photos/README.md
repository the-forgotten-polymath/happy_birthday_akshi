Drop your photos in this folder.

Then open `lib/config.ts` and add a `src` to any entry in the `photos` array:

```ts
{
  src: "/photos/beach-2019.jpg",
  caption: "that unhinged birthday, 2019",
  emoji: "🎉",
  gradient: "from-amber-300 via-orange-400 to-rose-500",
  tilt: 4,
},
```

Any entry without a `src` shows a coloured placeholder instead, so the site
looks finished even before you add real pictures. Portrait images (roughly 4:5)
fit the polaroid frame best.
