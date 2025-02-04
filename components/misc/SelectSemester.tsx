"use client";
import { semester } from "@/data";
import { Select, SelectItem } from "@heroui/select";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Selection } from "@react-types/shared"; // Import Selection type
import { useRouter } from "next/navigation";

const SelectSem = () => {
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const router = useRouter();
  const handleSelectionChange = (selection: Selection) => {
    const selectedKey = Array.from(selection)[0] as string; // Extract key as string
    setSelectedSemester(selectedKey);
    console.log("Selected semester:", selectedKey);
  };

  return (
    <div className="flex justify-start items-center sm:justify-center gap-5 w-full px-2">
      <Select
        className="w-full sm:w-64"
        label="Select a semester"
        color="default"
        selectionMode="single"
        onSelectionChange={handleSelectionChange}
        autoFocus
      >
        {semester.map((sems) => (
          <SelectItem key={sems.key} value={sems.key}>
            {sems.label}
          </SelectItem>
        ))}
      </Select>
      <Button
        color="primary"
        className="flex items-center justify-center h-12 w-16 sm:w-12"
        size="icon"
        disabled={!selectedSemester}
        onClick={() => {
          router.push(`/semester/${selectedSemester}`);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-full h-full"
        >
          <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
        </svg>
      </Button>
    </div>
  );
};

export default SelectSem;
