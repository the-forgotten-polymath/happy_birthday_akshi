import { chromium } from "playwright-core";

const b = await chromium.launch({ channel: "chrome", headless: true });
const p = await b.newPage({ viewport: { width: 1024, height: 700 } });
const err = [];
p.on("pageerror", (e) => err.push(e.message));
p.on("console", (m) => m.type() === "error" && err.push(m.text()));

await p.goto("http://localhost:3111/", { waitUntil: "networkidle" });
await p.waitForTimeout(2000);

const hero = (await p.locator("h1").first().innerText()).replace(/\n/g, " ");
const kicker = await p.locator("text=Chapter 22").first().isVisible();

// Scroll to the 22 section
for (let i = 0; i < 22; i++) {
  await p.mouse.wheel(0, 600);
  await p.waitForTimeout(150);
}
await p.waitForTimeout(1500);

const has22Section = await p.getByText("things about you at twenty-two").isVisible();
const cards = await p.locator('[class*="break-inside-avoid"]').count();

// Scroll to finale
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(2500);
const finaleTitle = await p.locator('[aria-label="happy 22nd"]').isVisible();
const subtitle = await p.getByText("now go own the year").isVisible();

await b.close();
console.log(
  JSON.stringify(
    { hero, kicker, has22Section, cardCount: cards, finaleTitle, subtitle, errors: err },
    null,
    2,
  ),
);
