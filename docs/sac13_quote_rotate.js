"use strict";

const quotes = [
  // Written by Chat-GPT, cherry-picked by me ;-)

  "Welcome to a world where calendars finally make sense:",
  "This is what a genius-level calendar looks like:",
  "Why settle for chaos when you can have this instead:",
  "What if you could memorize an entire year’s calendar in one glance:",
  "A calendar so simple, it might put planners out of business:",
  "It's not rocket science, but it feels like it should win an award:",
  "A calendar that’s finally as predictable as your favorite sitcom:",
  "The elegant solution to a centuries-old problem:",
  "What if every month was the best month:",
  "The answer to a question you didn’t know you were asking:",
  "Imagine a world where calendars finally get it right:",
  "A calendar so intuitive, you’ll wonder why it took this long:",
  "You didn’t ask for it, but you’ll be glad it’s here:",
  "It’s not basic—it’s beautifully straightforward:",
  "What if every month was like clockwork, literally:",
  "Welcome to the calendar revolution you didn’t know you needed:",
  "Imagine a world where every month is perfectly predictable:",
  "Imagine a calendar so straightforward it could fit in a single tweet:",
  "Imagine a calendar built for clarity and precision:",
  "The calendar the world has been waiting for:",
  "The answer to a question you didn’t know you were asking:",
  "The Swiss Army knife of calendars — but simpler:",
  "It’s like someone finally hit “refresh” on the calendar system:",
  "It’s time for time to make sense again:",
  "It’s not just a calendar — it’s a flex:",
  "Good luck trying to overthink this one:",
  "Simple enough for a child, brilliant enough for a genius:",
  "Minimalism meets timekeeping:",
  "Proof that sometimes less really is more:",
  "What if organizing your life didn’t require checking the date three times? Feast your eyes on this:",
  "Say goodbye to the chaos of uneven months—this is calendar simplicity at its finest:",
  "Behold the future of timekeeping:",
  "If a calendar could be perfect, it would look exactly like this:",
  "What if every month felt the same, because it was? Say hello to sanity:",
  "The Gregorian Calendar had a good run — now it’s time for something better:",
  "This is what happens when you stop overcomplicating time and start making sense:",
  "Who knew a calendar could actually be... logical? Feast your eyes on this:",
  "The Gregorian Calendar called — it’s embarrassed:",
  "We fixed the calendar so you don’t have to:",
  "What if timekeeping didn’t need guesswork? Check this out:",
  "The 28ᵗʰ, 29ᵗʰ, 30ᵗʰ, and 31ˢᵗ walk into a bar… but not here:",
  "The Gregorian mess ends here:",
  "Tired of counting knuckles to remember month lengths? See this:",
  "Think the Gregorian Calendar makes sense? Think again:",
  "What if calendars weren’t a historical accident? Look at this:",
  "Say hello to logic, and goodbye to month-length roulette:",
  "A calendar so simple, it’s almost insulting:",
  "We took out the guesswork. You’re welcome:",
  "This calendar is so smart, it makes the Gregorian look medieval:",
  "We fixed the calendar. It wasn’t hard:",
  "Ever wish months made sense? Here you go:",
  "Timekeeping, reinvented for actual humans:",
  "Every month. Exactly the same. Finally:",
  "It’s time for a calendar upgrade you can trust:",
  "28 days, four weeks, no surprises. Perfect:",
  "Consistency, clarity, and a little genius. Here it is:",
  "Goodbye confusion, hello perfection:",
  "It’s time to leave the Gregorian mess behind:",
  "This is what the Gregorian Calendar wanted to be when it grew up:",
  "It’s like the Gregorian Calendar, but without the flaws:",
  "Why settle for 12 puzzles when you can have this masterpiece:",
  "Even your phone’s calendar app will thank you for this:",
  "Let’s ditch the Gregorian mess for good:",
  "Do we really need months with random lengths? No, we don’t:",
  "How about a calendar that’s actually easy to remember:",
  "Sick of playing 'how many days in this month'? Try this cheat sheet:",
  "History gave us a messy calendar. We redesigned it for you:",
  "It's time for a new era—one where calendars make sense:",
  "The Gregorian Calendar is an accident of history. This is by design:",
  "If calendars were designed for humans, they’d look like this:",
  "Let's fix the mess history left us with. Here's how:",
  "This calendar makes sense—because it was designed that way:",
  "We’ve been using the wrong calendar for centuries. Time for change:",
  "Simpler days are ahead. Welcome to your new calendar:",
  "Calendars don’t need to be confusing. Here’s proof:",
  "Ready for a no-nonsense calendar? This is it:",
  "This is what happens when we stop using broken calendars:",
];

const quote1 = document.getElementById("quote1");
const quote2 = document.getElementById("quote2");

let visibleQuote = 1;

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function rotateQuotes() {
  const current = visibleQuote === 1 ? quote1 : quote2;
  const next = visibleQuote === 1 ? quote2 : quote1;

  next.textContent = getRandomQuote();
  next.style.opacity = "1";
  current.style.opacity = "0";

  visibleQuote = visibleQuote === 1 ? 2 : 1;
}

quote1.textContent = getRandomQuote();
setInterval(rotateQuotes, 12000);
