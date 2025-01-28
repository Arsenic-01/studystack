"use client";
import { semester } from "@/data";
import { Select, SelectItem } from "@heroui/select";
import React from "react";

const SelectSem = () => {
  return (
    <Select className="max-w-xs" label="Select a semester" color="default">
      {semester.map((sems) => (
        <SelectItem key={sems.key}>{sems.label}</SelectItem>
      ))}
    </Select>
  );
};

export default SelectSem;
