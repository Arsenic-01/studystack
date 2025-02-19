import HeroVideoDialog from "./magicui/hero-video-dialog";

export function HeroVideoDialogDemoTopInBottomOut() {
  return (
    <div className="relative max-w-6xl mx-auto pt-10 pb-20 px-5">
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="/light_hero.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="/dark_hero1.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}
