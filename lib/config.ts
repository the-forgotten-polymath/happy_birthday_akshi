/**
 * ✨ EVERYTHING YOU NEED TO PERSONALISE LIVES IN THIS FILE ✨
 *
 * Change the name, the messages, the photos and the site is yours.
 * Nothing else in the codebase needs to be touched.
 */

export type Photo = {
  /** Put your image in /public/photos and reference it as "/photos/name.jpg" */
  src?: string;
  caption: string;
  /** Shown when no `src` is provided yet */
  emoji: string;
  /** Tailwind gradient classes used for the placeholder */
  gradient: string;
  /** Slight rotation so the gallery feels like scattered polaroids */
  tilt: number;
};

export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
  emoji: string;
};

export type Reason = {
  title: string;
  description: string;
  emoji: string;
};

/** Change this one line and the whole site follows. */
const NAME = "Akshita";

export const config = {
  /* ---------------------------------------------------------------- basics */
  name: NAME,
  nickname: "Akshi",
  age: 22,
  /** Used by the countdown + the "days we've been friends" counter */
  birthday: "2026-08-09",
  friendsSince: "2023-06-12",

  /* ------------------------------------------------------------ hero copy */
  hero: {
    kicker: "August 9th · Chapter 22",
    greetingWords: ["Happy", "22nd"],
    subtitle:
      "Twenty-two looks good on you. This is a tiny corner of the internet I built just for the occasion — scroll slowly, there are surprises the whole way down.",
    scrollCue: "scroll into twenty-two",
  },

  /* --------------------------------------------------------- the big word */
  marquee: [
    "chapter twenty-two",
    "main character energy",
    "certified icon",
    "ageing like fine wine",
    "22 & thriving",
  ],

  /* ------------------------------------------------------------- timeline */
  timeline: [
    {
      year: "2023",
      title: "The day we met",
      description:
        "We both went out to Buddha Temple and had great fun there, i insisted you to be the part of Freshers 2K23 and you said \"No yrr i am not interested kya hi krenge aakr ...\" and then you came in the evening white suit dancing all with your friends",
      emoji: "🤝",
    },
    {
      year: "2018",
      title: "That road trip",
      description:
        "Six hours of the same four songs, one wrong turn, and the best day of that entire year.",
      emoji: "🚗",
    },
    {
      year: "2020",
      title: "3am phone calls",
      description:
        "The year everything was strange and you made it survivable. I still owe you for that.",
      emoji: "📞",
    },
    {
      year: "2023",
      title: "You did the scary thing",
      description:
        "You moved cities, started over, and made it look easy. I've never been prouder of anyone.",
      emoji: "🌱",
    },
    {
      year: "2026",
      title: "Today",
      description:
        "Another year of you existing loudly and brilliantly. Here's to all the ones coming.",
      emoji: "🎂",
    },
  ] satisfies TimelineEvent[],

  /* -------------------------------------------------------------- gallery */
  photos: [
    {
      caption: "the original chaos crew",
      emoji: "📸",
      gradient: "from-rose-400 via-fuchsia-500 to-indigo-500",
      tilt: -6,
    },
    {
      caption: "that unhinged birthday, 2019",
      emoji: "🎉",
      gradient: "from-amber-300 via-orange-400 to-rose-500",
      tilt: 4,
    },
    {
      caption: "golden hour, no filter needed",
      emoji: "🌅",
      gradient: "from-sky-300 via-cyan-400 to-emerald-400",
      tilt: -3,
    },
    {
      caption: "we laughed until it hurt",
      emoji: "😂",
      gradient: "from-violet-400 via-purple-500 to-fuchsia-600",
      tilt: 7,
    },
    {
      caption: "the one you told me to delete",
      emoji: "🙈",
      gradient: "from-lime-300 via-emerald-400 to-teal-500",
      tilt: -5,
    },
    {
      caption: "and here's to the next one",
      emoji: "🥂",
      gradient: "from-pink-400 via-red-400 to-amber-400",
      tilt: 3,
    },
  ] satisfies Photo[],

  /* -------------------------------------------------------------- reasons */
  reasonsTitle: "22 reasons you're irreplaceable",
  reasons: [
    {
      title: "Your laugh is contagious",
      description:
        "You start laughing and suddenly the entire room is gone. It's a superpower.",
      emoji: "😹",
    },
    {
      title: "You always pick up",
      description:
        "3am, middle of class, doesn't matter. You just answer.",
      emoji: "☎️",
    },
    {
      title: "Your playlists are unhinged",
      description:
        "Objectively chaotic. Somehow my most played. I blame you entirely.",
      emoji: "🎧",
    },
    {
      title: "You remember the tiny things",
      description:
        "Something I mentioned once, months ago. You bring it up like it was yesterday.",
      emoji: "🧠",
    },
    {
      title: "You're braver than you think",
      description:
        "You do the thing that scares you and then act like it was nothing.",
      emoji: "🦁",
    },
    {
      title: "You make any place feel like home",
      description:
        "Any room, any city. You walk in and it's instantly comfortable.",
      emoji: "🏡",
    },
  ] satisfies Reason[],

  /* -------------------------------------------------------- twenty-two */
  /** 22 quick-fire facts/memories — one for every year of her life */
  twentyTwo: [
    "You said 'no yrr i am not interested' and then showed up in the white suit anyway. Iconic.",
    "You can finish an entire plate meant for three people and still ask 'what's for dessert?'",
    "Your voice note game is unmatched — 4 minutes minimum, zero context, always at 2am.",
    "You've made me late to literally everything and I've never once been mad about it.",
    "You own more scrunchies than textbooks and somehow that's a flex.",
    "The way you dance like nobody's watching, even when the whole hall literally is.",
    "You text back in 0.3 seconds or 3 business days, no in-between.",
    "You cry at reels and then send them to me saying 'you have to watch this.'",
    "Your selfie lighting instinct is genuinely professional-grade.",
    "Every auto driver within 5km knows your bargaining voice.",
    "You can nap anywhere, anytime, in any position — certified talent.",
    "The way you say 'sunnn' when you're excited about literally anything.",
    "You've been using the same phone case since 2024 and it's held together by vibes.",
    "You know every Bollywood song ever made but forget your own timetable.",
    "Your 'just five more minutes' has never been less than forty.",
    "You still get excited about birthday eve like you're turning seven. (Never change.)",
    "You somehow make hostel mess food look aesthetic in stories.",
    "You give the best hugs — the kind that feel like you mean it.",
    "The number of times you've said 'let's go on a trip' vs actually gone is... a ratio.",
    "You make bad days feel survivable just by being around.",
    "You're somehow always cold, even in August.",
    "22 looks really, really good on you.",
  ],

  /* ---------------------------------------------------------- gift + wish */
  gift: {
    teaser: "there's something in here for you",
    hint: "tap the box",
    // Shown after the box is opened
    revealTitle: "a promise, not a present",
    revealBody:
      "One entire day, anywhere you want, my treat, no arguments. Pick the date and I'll show up with snacks.",
    couponCode: "BESTIE-DAY-2026",
  },

  cake: {
    title: "make a wish",
    hint: "blow out the candles",
    afterTitle: "wish locked in 🤞",
    afterBody: "I fully expect it to come true. The universe owes you one.",
  },

  /* --------------------------------------------------------------- letter */
  letter: {
    envelopeHint: "one last thing — open it",
    greeting: `Dear ${NAME},`,
    paragraphs: [
      "I'm not great at saying this stuff out loud, so I built a whole website instead. Seemed reasonable at the time.",
      "Thank you for every ridiculous conversation, every time you showed up without being asked, and every time you made a genuinely bad day funny. You do that effortlessly and I don't think you know how rare it is.",
      "I hope this year is kind to you. I hope you get the thing you've been quietly hoping for. And I hope you know that there's someone in your corner permanently, whether you need it or not.",
    ],
    signoff: "Happy birthday, you absolute legend.",
    signature: "— always, me",
  },

  /* --------------------------------------------------------------- finale */
  finale: {
    title: "happy 22nd",
    subtitle: "now go own the year, Akshi",
    buttonLabel: "one more time 🎊",
  },

  /**
   * Countdown gate configuration. Blocks the site until the target date.
   */
  gate: {
    targetDate: "2026-08-09T00:00:00", // August 9, 2026 at Midnight
    bypassKey: "akshi22",
  },

  /**
   * Secret Konami-style code to trigger a massive confetti explosion.
   * Type this anywhere on the page!
   */
  secretCode: "akshi",

  /**
   * Background music configuration. The player will only render if musicSrc is set.
   * For the visualizer to work perfectly, the audio must not have CORS restrictions.
   */
  musicSrc: "/Audio.mp3", // Free placeholder track
  songTitle: "Birthday Anthem",
  songArtist: "The Legends",
} as const;

export type SiteConfig = typeof config;

