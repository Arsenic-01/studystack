"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React from "react";
import { accordianItems } from "../../data/index";

const Accordian = () => {
  return (
    <Accordion className="w-full max-w-4xl mx-auto">
      {accordianItems.map((item, index) => (
        <AccordionItem
          key={index}
          value={item.title}
          aria-label={item.title}
          title={item.title}
        >
          <p className="text-base py-3">{item.content}</p>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Accordian;
