import { Cpu, Zap } from "lucide-react";
import Image from "next/image";

export default function HeroProject() {
  return (
    <section className="py-16 md:py-32 mt-10 md:mt-0 ">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <h2 className="relative text-4xl font-medium">
          StudyStack: Your Learning & Resource Hub
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              StudyStack is an efficient platform for students and teachers to
              manage educational resources. It provides a seamless ecosystem for
              sharing, organizing, and accessing notes, videos, and links.
            </p>
            <p className="text-muted-foreground">
              With separate roles for students, teachers, and admins, the
              platform offers a secure, organized environment. Students can
              easily access content, teachers can upload and manage resources,
              and admins can monitor all activity and user details through a
              central dashboard.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-l-2 border-accent pl-2">
                  <Zap className="size-4" />
                  <h3 className="text-sm font-medium">Efficient</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Quickly upload and manage all your notes and resources in one
                  centralized place.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 border-l-2 border-accent pl-2">
                  <Cpu className="size-4" />
                  <h3 className="text-sm font-medium">Secure</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  User data and access are protected with a robust multi-role
                  authentication system.
                </p>
              </div>
            </div>
          </div>
          <div className="relative mt-0 sm:mt-0">
            <div className="bg-linear-to-b aspect-67/34 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="/proj_hero-dark.png"
                className="hidden rounded-[15px] dark:block"
                alt="StudyStack dashboard dark theme"
                width={706}
                height={212}
              />
              <Image
                src="/proj_hero.png"
                className="rounded-[15px] shadow dark:hidden"
                alt="StudyStack dashboard light theme"
                width={706}
                height={212}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
