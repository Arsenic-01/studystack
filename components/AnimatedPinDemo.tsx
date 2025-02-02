"use client";
import React, { useEffect, useState } from "react";
import { PinContainer } from "./ui/3d-pin";
import Image from "next/image";

export function AnimatedPinDemo() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent mismatch

  return (
    <main className="min-h-screen flex items-center justify-center ">
      <div className="h-[40rem] w-fit flex items-center justify-center ">
        <PinContainer title="LinkedIn" href="https://twitter.com/mannupaaji">
          <div className="w-[20rem] h-[20rem] p-4 text-slate-100">
            <h3 className="text-base font-bold text-slate-100">Vedant A. Bhor</h3>
            <span className="text-slate-500">
              Customizable Tailwind CSS and Framer Motion Components.
            </span>
            {/* Image Inside PinContainer */}
          <div className="flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
            <Image
              src="/jerry.jpg"  // Update with your image path
              alt="Aceternity UI Preview"
              width={320}
              height={320}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          </div>
        </PinContainer>
      </div>

      <div className="h-[40rem] w-fit flex items-center justify-center ">
        <PinContainer title="LinkedIn" href="https://twitter.com/mannupaaji">
          <div className="w-[20rem] h-[20rem] p-4 text-slate-100/50">
            <h3 className="text-base font-bold text-slate-100">Tanay K. Hingane</h3>
            <span className="text-slate-500">
              Customizable Tailwind CSS and Framer Motion Components.
            </span>
            {/* Image Inside PinContainer */}
          <div className="flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
            <Image
              src="/tomm.jpg"  // Update with your image path
              alt="Aceternity UI Preview"
              width={320}
              height={320}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          </div>
        </PinContainer>
      </div>
    </main>
  );
}
