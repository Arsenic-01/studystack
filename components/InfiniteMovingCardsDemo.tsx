import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="py-32 2xl:py-44 rounded-md flex flex-col antialiased bg-white gap-10 dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <div className="flex flex-col gap-5  text-center">
        {" "}
        <h1 className="text-5xl 2xl:text-6xl px-5 font-bold bg-gradient-to-r dark:text-transparent  dark:from-white dark:to-neutral-400 light:from-black light:to-gray-700 bg-clip-text white:text-transparent">
          Testimonials
        </h1>
        <span className="text-lg text-neutral-600 dark:text-neutral-400">
          Supported by the best
        </span>
      </div>
      <div className="w-full max-w-4xl px-5">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>
    </div>
  );
}

const testimonials = [
  {
    //Sangale sir
    quote:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    name: "Mr. S.H.Sangale",
    title: "Lecturer",
  },
  {
    //Bhosale maam
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: "Bhosale maam",
    title: "Hamlet",
  },
  {
    //Ushir maam
    quote: "All that we see or seem is but a dream within a dream.",
    name: "Ushir maam",
    title: "A Dream Within a Dream",
  },
  {
    //Mahajan sir
    quote:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    name: "Mahajan sir",
    title: "Pride and Prejudice",
  },
  {
    //Vidhate mam
    quote:
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    name: "Vidhate mam",
    title: "Moby-Dick",
  },
];
