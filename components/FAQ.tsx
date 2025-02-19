import React from "react";
import Accordian from "./misc/Accordian";

const FAQ = () => {
  return (
    <div
      className="pt-20 pb-36 flex flex-col justify-center items-center gap-20 max-w-6xl w-full mx-auto"
      id="faq"
    >
      <div className="flex flex-col gap-5  text-center">
        {" "}
        <h1 className="text-5xl 2xl:text-6xl px-5 tracking-tighter font-bold bg-gradient-to-r dark:text-transparent  dark:from-white dark:to-neutral-400 light:from-black light:to-gray-700 bg-clip-text white:text-transparent">
          FAQs
        </h1>
        <span className="text-lg text-neutral-600 dark:text-neutral-400">
          Answers to Common Questions
        </span>
      </div>
      <div className="w-full max-w-4xl  px-5">
        <Accordian />
      </div>
    </div>
  );
};

export default FAQ;
