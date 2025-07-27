import HeroVideoDialog from "../../ui/magicui/hero-video-dialog";

export function HeroYouTubeVideo() {
  return (
    <div className="relative max-w-5xl mx-auto pt-10 pb-20 px-5">
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/bcyYHZSmW88"
        thumbnailSrc="/StudyStack_light.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/bcyYHZSmW88"
        thumbnailSrc="/StudyStack_dark.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}
/*
<iframe width="923" height="519" src="https://www.youtube.com/embed/bcyYHZSmW88" title="StudyStack Demo Video | ‎⁨@StudyStack01⁩  | Created By Vedant Bhor and Tanay Hingane |" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
*/
