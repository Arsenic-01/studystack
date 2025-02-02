import { AnimatedPinDemo } from '@/components/AnimatedPinDemo'
import React from 'react'
import {
  Avatar,
  AvatarImage,
} from "@/components/ui/avatar"

const AboutPage = () => {
  return (
    <div suppressHydrationWarning>
        <AnimatedPinDemo />
        <div className='py-10 text-start justify-items-center tracking-wide text-xl text-slate-950 dark:text-white/80'>
          <h2>Guided By:</h2>
          <div className='flex text-xl py-2 text-center align-middle gap-5 text-slate-950 dark:text-white/80'>
            <Avatar>
            <AvatarImage src="/talolesir.webp" alt="@shadcn" />
            </Avatar>
            <div className='py-1'>
              <h3>Prof. A.D.Talole</h3>
            </div>
          </div>
          <div className='flex text-xl text-center align-middle gap-5 text-slate-950 dark:text-white/80'>
            <Avatar>
            <AvatarImage src="/katkadesir.png" alt="@shadcn" />
            </Avatar>
            <div className='py-1'>
              <h2>Prof. G.B.Katkade (HOD)</h2>
            </div>
          </div>
        </div>
    </div>
  )
}

export default AboutPage