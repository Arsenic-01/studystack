import { Metadata } from "next";
import ContactForm from "./_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Have a question or suggestion? Fill out the form below, and we'll get back to you as soon as possible.",
};

export default function ContactPage() {
  return (
    <div className="bg-white dark:bg-black w-full">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-5 py-24 sm:py-32">
        <ContactForm />
      </div>
    </div>
  );
}
