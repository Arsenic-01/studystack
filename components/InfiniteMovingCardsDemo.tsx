import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="py-32 2xl:py-44 rounded-md flex flex-col antialiased bg-white gap-10 dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <div className="flex flex-col gap-5  text-center">
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
    // Shaikh maam
    quote:
      "The StudyStack project is well-developed and highly efficient for departmental use. The two students from SY Lin have worked hard to bring this to life. Congratulations on their dedication and effort!",
    name: "Shaikh ma’am",
    title: "Lecturer",
  },
  {
    // Bijalpure maam
    quote:
      "StudyStack is an excellent blend of research, creativity, and technical skills. The well-organized structure makes it easy to use. Their analytical approach and originality are commendable. Best wishes for their continued success!",
    name: "Bijalpure ma’am",
    title: "Lecturer",
  },
  {
    //Sangale sir
    quote:
      "StudyStack has completely transformed how we access and share notes in our college. As a student, I love the clean and user-friendly interface, making it super easy to find and download study materials. No more struggling with lost PDFs or WhatsApp groups!",
    name: "Sangale sir",
    title: "Lecturer",
  },
  {
    //Bhosale maam
    quote:
      "I am truly impressed by StudyStack’s implementation. It serves as a centralized repository, making access easy for students and teachers. Vedant and Tanay’s dedication is commendable. Wishing them success in launching the project soon!",
    name: "Bhosale ma’am",
    title: "Lecturer",
  },
  {
    //Ushir maam
    quote:
      "Managing an academic platform can be overwhelming, but StudyStack’s admin panel makes it a breeze. With full control over users, notes, and content moderation, we ensure a smooth experience for students and teachers alike. The security and reliability of the platform are commendable!",
    name: "Ushir ma’am",
    title: "Lecturer",
  },
  {
    //Mahajan sir
    quote:
      "As a tech enthusiast, I appreciate how StudyStack is built using modern web technologies like Next.js and Appwrite. The site loads incredibly fast, and the performance is top-notch, even with a large number of users accessing notes simultaneously.",
    name: "Mahajan sir",
    title: "Lecturer",
  },
  {
    //Vidhate mam
    quote:
      "StudyStack isn’t just a storage space for notes—it’s a well-thought-out educational platform. With intuitive navigation, seamless authentication, and efficient state management using Zustand, it provides a next-level learning experience for students.",
    name: "Vidhate ma’am",
    title: "Lecturer",
  },
];
