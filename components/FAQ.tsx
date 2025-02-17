import React from "react";
import Accordian from "./misc/Accordian";

const FAQ = () => {
  return (
    <div
      className="pt-20 pb-36 flex flex-col justify-center items-center gap-20 max-w-6xl w-full mx-auto"
      id="faq"
    >
      <h1 className="text-5xl 2xl:text-7xl font-bold bg-gradient-to-r dark:text-transparent  dark:from-white dark:to-neutral-400 light:from-black light:to-gray-700 bg-clip-text white:text-transparent">
        FAQs
      </h1>
      <div className="w-full max-w-4xl  px-5">
        <Accordian />
      </div>
    </div>
  );
};

export default FAQ;
