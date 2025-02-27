import { CreatorCredit } from "./creator-credit";
import HeroButton from "./misc/HeroButton";
import SelectSem from "./misc/SelectSemester";
import { Cover } from "./ui/cover";
import { Spotlight } from "./ui/Spotlight";

const Hero = () => {
  const creators = [
    {
      name: "Vedant Bhor",
      role: "Lead Developer",
      avatar: "/pfp1.jpg",
    },
    {
      name: "Tanay Hingane",
      role: "UI/UX Designer",
      avatar: "/tpfp.jpg",
    },
  ];

  const guide = [
    {
      name: "AD. Talole",
      role: "Lecturer",
    },
    {
      name: "GB. Katkade",
      role: "HOD, Computer Department",
    },
  ];

  return (
    <div
      className="pt-36 2xl:pt-48 mb-16 sm:mb-20 xl:mb-14 2xl:mb-20 flex items-center justify-center relative overflow-x-clip"
      id="hero"
    >
      <Spotlight />
      <div className="flex flex-col items-start sm:items-center justify-center gap-16 xl:gap-12 px-5 z-10">
        <div className="flex flex-col sm:items-center justify-center gap-10">
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
            <HeroButton />
          </div>
          <div className="flex flex-col items-center justify-center gap-8 bg-inherit">
            <div className="">
              <h1 className="text-left  py-1 sm:text-center text-[3.3rem] leading-none  xl:text-6xl font-bold bg-gradient-to-r dark:text-transparent  dark:from-white dark:to-neutral-400 light:from-black light:to-gray-700 bg-clip-text white:text-transparent tracking-tighter">
                All Study Resources in One Place.
              </h1>
            </div>
            <h2 className="text-lg  2xl:text-xl sm:max-w-md sm:text-center text-neutral-900/80 dark:text-neutral-50/50 dark:sm:text-white/80  ">
              <Cover className="select-none">Boost Your Marks</Cover> by using
              the right resources at the right time!
            </h2>
          </div>
        </div>
        <SelectSem />
      </div>
      <CreatorCredit guide={guide} creators={creators} />
    </div>
  );
};

export default Hero;
