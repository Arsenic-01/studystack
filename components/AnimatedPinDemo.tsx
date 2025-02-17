"use client";
import React, { useEffect, useState } from "react";
import { PinContainer } from "./ui/3d-pin";
import Image from "next/image";
import { Button } from "./ui/button";
import { tsc, vsc } from "@/data";
import { AnimatedTooltip } from "./ui/animated-tooltip";

export function AnimatedPinDemo() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent mismatch

  return (
    <main className="min-h-screen pt-32 flex flex-col md:flex-row px-5 w-full items-center justify-center overflow-x-clip">
      <div className="flex flex-col justify-center items-center">
        <div className=" w-fit px-5 flex items-center justify-center ">
          <PinContainer title="LinkedIn" href="https://twitter.com/mannupaaji">
            <div className="w-[20rem] h-[20rem] p-4 text-slate-100">
              <h3 className="text-base font-bold text-black dark:text-slate-100">
                Vedant A. Bhor
              </h3>
              <Button variant="destructive">Backend</Button>
              <div className="flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
                <Image
                  src="/jerry.jpg" // Update with your image path
                  alt="Aceternity UI Preview"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </PinContainer>
          <div></div>
        </div>
        <div className="flex flex-row my-16">
          <AnimatedTooltip items={vsc} />
        </div>
        <div className=" w-fit px-5 flex items-center justify-center ">
          <PinContainer title="LinkedIn" href="https://twitter.com/mannupaaji">
            <div className="w-[20rem] h-[20rem] p-4 text-slate-100">
              <h3 className="text-base font-bold text-black dark:text-slate-100">
                Vedant A. Bhor
              </h3>
              <Button variant="destructive">Backend</Button>
              <div className="flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
                <Image
                  src="/jerry.jpg" // Update with your image path
                  alt="Aceternity UI Preview"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </PinContainer>
          <div></div>
        </div>
        <div className="flex flex-row my-16 gap-5">
          <AnimatedTooltip items={vsc} />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className=" w-fit flex items-center justify-center ">
          <PinContainer title="LinkedIn" href="https://twitter.com/mannupaaji">
            <div className="w-[20rem] h-[20rem] p-4 text-slate-100/50">
              <h3 className="text-base font-bold text-black dark:text-slate-100">
                Tanay K. Hingane
              </h3>
              <Button variant="destructive">Frontend</Button>
              {/* <Button variant="destructive">Ui/UX designer</Button> */}
              {/* Image Inside PinContainer */}
              <div className="flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
                <Image
                  src="/tomm.jpg" // Update with your image path
                  alt="Aceternity UI Preview"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </PinContainer>
        </div>
        <div className="flex flex-row my-16">
          <AnimatedTooltip items={tsc} />
        </div>
      </div>
    </main>
  );
}
