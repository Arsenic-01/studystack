import ContactForm from "@/components/contact_components/ContactForm";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col px-3 sm:px-5 py-28 md:py-32 items-center justify-center w-full">
      <ContactForm />
    </div>
  );
};

export default page;
