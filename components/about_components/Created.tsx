import { IconGlobe } from "./about_helper_components/IconGlobe";

const Created = () => {
  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-10 border border-neutral-300 dark:border-neutral-800 pb-5 sm:py-0 px-5 rounded-xl">
        <div className="text-xl font-bold tracking-tighter max-w-lg">
          <div>
            Students often deal with notes and resources spread across different
            channels, with no single shared space to keep everything together.
            Study Stack brings study materials into one secure, organized hub
            where teachers upload and students access effortlessly. No more
            switching between platforms—everything you need, all in one place!
            🚀
          </div>
        </div>
        <IconGlobe />
      </div>
    </div>
  );
};

export default Created;
