"use client";
import { useEffect, useState } from "react";

const quotes = [
  {
    quote: "If you never want to be criticized, don't do anything new.",
    author: "Jeff Bezos",
  },
  {
    quote:
      "Desire is a contract you make with yourself to be unhappy until you get what you want.",
    author: "Naval Ravikant",
  },
  {
    quote:
      "Work like there is someone working 24 hours a day to take it all away from you.",
    author: "Mark Cuban",
  },
  {
    quote: "Wear your failure as a badge of honor.",
    author: "Sundar Pichai",
  },
  {
    quote: "Nobody who ever gave their best effort regretted it.",
    author: "Arnold Schwarzenegger",
  },
  {
    quote:
      "I don't believe in taking right decisions. I take decisions and then make them right.",
    author: "Ratan Tata",
  },
  {
    quote:
      "Don't just dream, dream big. And once you dream, don't just stand there, do something to realize that dream.",
    author: "Dhirubhai Ambani",
  },
  {
    quote:
      "I've failed over and over again in my life, and that's why I succeed.",
    author: "Michael Jordan",
  },
  {
    quote: "Always be hustlin'.",
    author: "Travis Kalanick",
  },
  {
    quote: "In our jobs, you're only as good as your last product.",
    author: "Bernard Arnault",
  },
];

const Quotes = () => {
  const [randomQuote, setRandomQuote] = useState(quotes[0]);

  useEffect(() => {
    // Must run client-only, post-hydration: picking randomly during render
    // would mismatch the server-rendered output.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <section id="quotes" className="flex flex-col items-center justify-center">
      <div className="shadow-line-strong/70 mt-15 flex min-w-full flex-col justify-center gap-4 rounded-lg border p-6 shadow-inner">
        <svg
          aria-hidden="true"
          width="105"
          height="78"
          className="fill-muted absolute top-20 left-6 -z-99 opacity-55 dark:opacity-30"
        >
          <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z"></path>
        </svg>
        <h2 className="text-md text-content-secondary font-mono font-medium tracking-tighter italic">
          &quot;{randomQuote.quote}&quot;
        </h2>
        <p className="text-md text-content-muted self-end font-mono tracking-tighter italic">
          ~ {randomQuote.author}
        </p>
      </div>

      <div className="h-10 w-full" />
    </section>
  );
};

export default Quotes;
