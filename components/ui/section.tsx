import React from "react";

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ id, children, className = "" }) => {
  return (
    <section id={id} className={`py-16 md:py-20 scroll-mt-20 ${className}`}>
      {children}
    </section>
  );
};

export default Section;
