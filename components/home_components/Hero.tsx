import { creators, guide } from "@/data";
import { CreatorCredit } from "./home_helper_components/CreatorCredit";
import HeroButton from "./home_helper_components/HeroButton";
import SelectSem from "./home_helper_components/SelectSemester";
import { Cover } from "../ui/cover";
import { Spotlight } from "./home_helper_components/Spotlight";

const Hero = () => {
  return (
    <div
      className="pt-36 2xl:pt-48 mb-16 sm:mb-20 xl:mb-14 2xl:mb-20 flex items-center justify-center relative overflow-x-clip"
      id="hero"
    >
      <Spotlight />
      <div className="flex flex-col items-start sm:items-center justify-center gap-16 xl:gap-12 px-5 z-10">
        <div className="flex flex-col sm:items-center justify-center gap-10">
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
