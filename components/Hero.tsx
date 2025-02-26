import SelectSem from "./misc/SelectSemester";
import { Cover } from "./ui/cover";
import { Spotlight } from "./ui/Spotlight";

const Hero = () => {
  return (
    <div
      className="pt-36 2xl:pt-48 mb-16 sm:mb-20 xl:mb-14 2xl:mb-20 flex items-center justify-center relative overflow-x-clip"
      id="hero"
    >
      <Spotlight />
      <div className="flex flex-col items-start sm:items-center justify-center gap-20 xl:gap-12 px-5 z-10">
        <div className="flex flex-col sm:items-center justify-center gap-10 sm:gap-14">
          {/* <div
            className={cn(
              "group rounded-full border border-black/5  text-base text-white transition-all ease-in hover:cursor-pointer bg-neutral-50 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            )}
          >
            <AnimatedShinyText className="inline-flex items-center justify-start sm:justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ For Computer Technology Students</span>
              <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </div> */}
          <div>
            <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                <span>✨ For Computer Technology Students</span>
                <svg
                  fill="none"
                  height="16"
                  viewBox="0 0 24 24"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.75 8.75L14.25 12L10.75 15.25"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 bg-inherit">
            <div className="">
              <h1 className="text-left sm:text-center text-6xl 2xl:text-[80px] font-bold bg-gradient-to-r dark:text-transparent  dark:from-white dark:to-neutral-400 light:from-black light:to-gray-700 bg-clip-text white:text-transparent tracking-tighter">
                All notes in one place.
              </h1>
            </div>
            <h2 className="text-xl  2xl:text-2xl sm:max-w-md sm:text-center text-neutral-900/80 dark:text-neutral-50/50 dark:sm:text-white/80  ">
              <Cover className="select-none">Boost Your Marks</Cover> by using
              the right Resources at the right time!
            </h2>
          </div>
        </div>
        <SelectSem />
      </div>
      {/* <DotPattern
        className={cn(
          "[mask-image:radial-gradient(200px_circle_at_center,white,transparent)]"
        )}
      /> */}
    </div>
  );
};

export default Hero;
