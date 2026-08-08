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
  friendsSince: "2023-10-22",

  /* ------------------------------------------------------------ hero copy */
  hero: {
    kicker: "August 9th · Chapter 22",
    greetingWords: ["Happy", "22nd"],
    subtitle:
      "Twenty-two looks good on you. This is a tiny corner of the internet I built just for the occasion scroll slowly, there are surprises the whole way down.",
    scrollCue: "scroll into twenty-two",
  },

  /* --------------------------------------------------------- the big word */
  marquee: [
    "chapter twenty-two",
    "main character energy",
    "the CEO",
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
      year: "2024",
      title: "The holding hands in class",
      description:
        "Suddenly we started talking more and then we occasionaly hold our hands under the desk, eating together, spedning a little much time there .And then you got your friedns and we broke up. and then after some time again we started talking .",
      emoji: "🫱🫲",
    },
    {
      year: "2025",
      title: "First Hackathon",
      description:
        "The first ever hackathon, first ever long trip together and first ever night out!",
      emoji: "💻",
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
    title: "You always say “sunnn”",
    description:
      "No matter what you're about to say, it somehow starts with “sunnn.” At this point, it's basically your trademark.",
    emoji: "🗣️",
  },
  {
    title: "You always watch Aadu",
    description:
      "Somehow Aadu is always part of the plan. I don't even question it anymore.",
    emoji: "🎬",
  },
  {
    title: "Your love for lapping",
    description:
      "Give you the choice between almost anything and laphing, and we already know what you're choosing.",
    emoji: "🍜",
  },
  {
    title: "You will always choose non-veg",
    description:
      "Vegetarian options exist. You simply choose not to acknowledge them.",
    emoji: "🍗",
  },
  {
    title: "Coffee, but absolutely no sugar",
    description:
      "Because apparently coffee isn't supposed to taste good. Still, somehow, this is your perfect cup.",
    emoji: "☕",
  },
  {
    title: "You fight with me professionally",
    description:
      "We can turn the smallest thing into an argument, fight about it, and somehow be completely normal five minutes later.",
    emoji: "🥊",
  },
  {
    title: "You get excited over the smallest things",
    description:
      "And honestly, that's one of my favourite things about you. You make ordinary moments feel worth celebrating.",
    emoji: "✨",
  },
  {
    title: "Your bargaining is insane",
    description:
      "Watching you negotiate with someone over a few rupees is genuinely better than most entertainment.",
    emoji: "💸",
  },
  {
    title: "You make everyone comfortable",
    description:
      "You have this way of making people feel like they've known you forever. That's something special.",
    emoji: "🏡",
  },
  {
  title: "You beat me more than I ever did",
  description:
    "At this point I'm not even sure who is supposed to be fighting whom. You somehow always win.",
  emoji: "🥊",
},
{
  title: "You get irritated in 0.2 seconds",
  description:
    "One tiny inconvenience and suddenly the entire world is personally responsible.",
  emoji: "😤",
},
{
  title: "You get jealous",
  description:
    "You might deny it, but we both know exactly what happens when you get jealous.",
  emoji: "👀",
},
{
  title: "You buy enough food for ten people",
  description:
    "You order like you're feeding an entire cricket team and then eat approximately three bites. Guess who gets the rest?",
  emoji: "🍽️",
},
{
  title: "You try so hard to be cool",
  description:
    "The confidence is there. The baddie attitude is there. The fact that I know the real you makes it slightly less convincing.",
  emoji: "😎",
},
{
  title: "You try to be a baddie boy",
  description:
    "You walk around like you've got the whole world figured out. It's honestly adorable.",
  emoji: "🕶️",
},
{
  title: "You're genuinely hardworking",
  description:
    "You put in more effort than people realise, and you deserve every good thing that comes from it.",
  emoji: "💪",
},
{
  title: "You're ridiculously talented",
  description:
    "You have this annoying habit of being good at things without making a big deal about it.",
  emoji: "✨",
},
{
  title: "You're a master at being you",
  description:
    "There's really no one else who could be Akshi quite like you can. And honestly, that's enough.",
  emoji: "👑",
},
{
  title: "That smile better never change",
  description:
    "Of all the things that could change over the years, I hope that smile stays exactly the same.",
  emoji: "😊",
},
{
  title: "You're going to be successful",
  description:
    "I don't know exactly where life takes you, but I know you're going to make something incredible out of it.",
  emoji: "🚀",
},
{
  title: "I'm grateful you chose me",
  description:
    "Out of all the people in the world, somehow you decided I was worth being friends with. I'll always be grateful for that.",
  emoji: "❤️",
},
{
  title: "Somehow, you became irreplaceable",
  description:
    "Somehow, between the fights, the food, the coffee, the random talks and all the chaos, you became someone I genuinely can't imagine not having in my life. I know I'm not the one and I don't deserve you, but you are the best.",
  emoji: "❤️",
}
  ] satisfies Reason[],

  /* -------------------------------------------------------- twenty-two */
  /** 22 quick-fire facts/memories — one for every year of her life */
twentyTwo: [
  "You are capable of far more than you sometimes give yourself credit for.",

  "You are hardworking, and one day you'll look back and realise how far all that effort took you.",

  "You are talented. Don't let one bad day, one failure, or one person's opinion make you forget that.",

  "You don't have to have everything figured out at 22. You just have to keep moving.",

  "Your smile is one of the things that makes you, you. Never let the world take that away from you.",

  "You get irritated easily, you overthink sometimes, and yes, you can be dramatic — but none of that makes you any less amazing.",

  "You get excited about the smallest things. Please never lose that ability to find happiness in little moments.",

  "You have a way of making people comfortable. That's a rare quality, and you should always be proud of it.",

  "Your confidence doesn't have to be perfect. Keep showing up, even on the days when you don't feel confident.",

  "You don't need to compete with anyone. Your journey is yours, and you're already building something worth being proud of.",

  "There will be days when you feel behind. You're not. Everyone's timeline is different.",

  "Don't make yourself smaller just because someone else is uncomfortable with how brightly you shine.",

  "You deserve the same kindness you give to everyone else. Remember that.",

  "Keep being curious. Keep learning. Keep trying things that scare you.",

  "Some dreams will take longer than you expected. That doesn't make them impossible.",

  "You are allowed to change your plans. Growing up doesn't mean having one fixed destination.",

  "Celebrate yourself more. Not only when you achieve something huge, but also when you survive something difficult.",

  "There will be people who underestimate you. Let your work speak for you.",

  "Don't forget how many versions of yourself you've already outgrown. You've been growing this whole time.",

  "You are going to do incredible things. I genuinely believe that, even on the days you don't.",

  "No matter how successful you become, I hope you always remain the Akshi who gets excited over little things, says 'sunnn', fights with me, and somehow makes ordinary days memorable.",

  "And finally: 22 is not the beginning of you becoming someone else. It's another chapter of becoming even more yourself. Go make it yours.",
],

  /* ---------------------------------------------------------- gift + wish */
  gift: {
    teaser: "there's something in here for you",
    hint: "tap the box",
    // Shown after the box is opened
    revealTitle: "a promise, not a present",
    revealBody:
      "One entire day, anywhere you want, my treat, no arguments. Pick the date and I'll show up with snacks.",
    couponCode: "AKSHI-DAY-2026",
  },

  cake: {
    title: "make a wish",
    hint: "blow out the candles",
    afterTitle: "wish locked in 🤞",
    afterBody:
      "Whatever you wished for, I hope you get it. And if the universe needs a little help, don't worry — I'll remind it.",
  },

  /* --------------------------------------------------------------- letter */
letter: {
  envelopeHint: "one last thing — open it",
  greeting: `Dear ${NAME},`,
  paragraphs: [
    "I don't really know how to say all of this properly, so obviously I decided the completely normal solution was to build you an entire website.",
    "I still remember that day at Buddha Temple and how I kept insisting that you should be part of Freshers 2K23. You were very confidently like, “no yrr, I'm not interested, kya hi krenge aakr...” and then somehow you showed up that evening in a white suit, dancing with your friends. Looking back, I think that was the beginning of a lot more memories than either of us realised.",
    "Since then, somehow you've become such a normal part of my life that I can't imagine it without you. The fights, the “sunnn”, the random conversations, the lapping, the non-veg cravings, the sugarless coffee, your insane bargaining, buying enough food for everyone and then making me finish it — all of it.",
    "You irritate me, you fight with me, you beat me more than I ever beat you, and somehow I still wouldn't trade any of it. Because underneath all that chaos, you're one of the most hardworking and talented people I know. You get excited about little things, you make people comfortable, and you have a smile that I genuinely hope never changes.",
    "I know I joke around a lot, but I really mean this: I believe you're going to be successful. Maybe you don't always see it yourself, but I do. Whatever you decide to do with your life, I hope you keep going, even when things get difficult. Don't let a bad day make you question the person you're becoming.",
    "And honestly, I'm just grateful. Grateful that somewhere along the way, you decided to make me your friend. I don't always feel like I'm the person who deserves someone as good as you, but somehow I dont deserve to have you in my life.",
    "So here's to 22. More fights, more food, more coffee, more random conversations, more “sunnn”, more memories, and hopefully a lot more years of watching you become the person I already know you're capable of becoming.",
    "Happy birthday, Akshi. Stay exactly as crazy, irritating, talented, hardworking and wonderfully you as you are.",
    "You can do it and You will do It."
  ],
  signoff: "Happy birthday, you absolute legend.",
  signature: "— always, me",
},

  /* --------------------------------------------------------------- finale */
  finale: {
    title: "Happiest Birthday",
    subtitle: "go make this year ridiculously yours.",
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

