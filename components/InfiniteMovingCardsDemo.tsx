import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="py-32 2xl:py-44 rounded-md flex flex-col antialiased bg-white gap-10 dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <div className="flex flex-col gap-5  text-center">
        {" "}
        <h1 className="text-5xl 2xl:text-6xl px-5 tracking-tighter font-bold bg-gradient-to-r dark:text-transparent  dark:from-white dark:to-neutral-400 light:from-black light:to-gray-700 bg-clip-text white:text-transparent">
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
      "StudyStack has completely transformed how we access and share notes in our college. As a student, I love the clean and user-friendly interface, making it super easy to find and download study materials. No more struggling with lost PDFs or WhatsApp groups!",
    name: "Mr. S.H.Sangale",
    title: "Lecturer",
  },
  {
    //Bhosale maam
    quote:
      "As a professor, I needed a reliable platform to share notes with my students. StudyStack makes it effortless! The upload process is smooth, and I can categorize subjects easily. It has saved me hours of work, and my students appreciate the organized resources.",
    name: "Bhosale maam",
    title: "Hamlet",
  },
  {
    //Ushir maam
    quote:
      "Managing an academic platform can be overwhelming, but StudyStack’s admin panel makes it a breeze. With full control over users, notes, and content moderation, we ensure a smooth experience for students and teachers alike. The security and reliability of the platform are commendable!",
    name: "Ushir maam",
    title: "A Dream Within a Dream",
  },
  {
    //Mahajan sir
    quote:
      "As a tech enthusiast, I appreciate how StudyStack is built using modern web technologies like Next.js and Appwrite. The site loads incredibly fast, and the performance is top-notch, even with a large number of users accessing notes simultaneously.",
    name: "Mahajan sir",
    title: "Pride and Prejudice",
  },
  {
    //Vidhate mam
    quote:
      "StudyStack isn’t just a storage space for notes—it’s a well-thought-out educational platform. With intuitive navigation, seamless authentication, and efficient state management using Zustand, it provides a next-level learning experience for students.",
    name: "Vidhate mam",
    title: "Moby-Dick",
  },
];
