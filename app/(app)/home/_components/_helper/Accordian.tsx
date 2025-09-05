"use client";
import { accordianItems } from "@/data";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React from "react";

const Accordian = () => {
  return (
    <Accordion className="w-full mx-auto text-xl" defaultExpandedKeys={["0"]}>
      {accordianItems.map((item, index) => (
        <AccordionItem
          key={index}
          value={item.title}
          aria-label={item.title}
          title={item.title}
          HeadingComponent="h2"
        >
          <p className="text-base py-3">{item.content}</p>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Accordian;
