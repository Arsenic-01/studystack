import React from "react";

const CustomHeading = ({ text }: { text: string }) => {
  return (
    <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r dark:text-transparent  dark:from-white dark:to-neutral-400 light:from-black light:to-gray-700 bg-clip-text white:text-transparent">
      {text}
    </h1>
  );
};

export default CustomHeading;
