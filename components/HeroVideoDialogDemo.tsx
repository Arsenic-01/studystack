import HeroVideoDialog from "./magicui/hero-video-dialog";

export function HeroVideoDialogDemoTopInBottomOut() {
  return (
    <div className="relative max-w-6xl mx-auto pt-10 pb-20 px-5">
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="top-in-bottom-out"
        videoSrc="/demo.mp4"
        thumbnailSrc="/StudyStackdemowhite.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="top-in-bottom-out"
        videoSrc="demo.mp4"
        thumbnailSrc="/StudyStackdemoblack.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}
