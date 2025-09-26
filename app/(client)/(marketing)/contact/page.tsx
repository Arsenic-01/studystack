import { Metadata } from "next";
import React from "react";
import ContactForm from "./_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact us for any queries or feedback. We will get back to you as soon as possible.",
};

const page = () => {
  return (
    <div className="flex flex-col px-3 sm:px-5 py-28 md:py-32 items-center justify-center w-full">
      <ContactForm />
    </div>
  );
};

export default page;
