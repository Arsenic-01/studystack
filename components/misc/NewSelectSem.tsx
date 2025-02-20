"use client";
import { semester } from "@/data";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectSem = () => {
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex justify-start items-center sm:justify-center gap-5 w-full px-2">
      <Select
        value={selectedSemester || ""}
        onValueChange={(sem) => setSelectedSemester(sem)}
      >
        <SelectTrigger className="w-72">
          <SelectValue placeholder="Select a semester" />
        </SelectTrigger>
        <SelectContent>
          {semester.map((sems) => (
            <SelectItem key={sems.key} value={sems.key}>
              {sems.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        color="primary"
        className="flex items-center justify-center h-12 w-16 sm:w-12 rounded-xl"
        size="icon"
        disabled={!selectedSemester}
        onClick={() => {
          router.push(`/semester/${selectedSemester}`);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-full h-full invert dark:invert-0"
        >
          <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
        </svg>
      </Button>
    </div>
  );
};

export default SelectSem;
