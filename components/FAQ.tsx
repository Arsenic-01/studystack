import React from "react";
import Accordian from "./misc/Accordian";

const FAQ = () => {
  return (
    <div className="mt-10 mb-32 flex flex-col justify-center items-center gap-20 max-w-6xl w-full mx-auto" id="faq">
      <h1 className="text-7xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
        FAQs
      </h1>
      <div className="w-full max-w-4xl  px-5">
        <Accordian />
      </div>
    </div>
  );
};

export default FAQ;
