import { IconCloud } from "../../ui/magicui/icon-cloud";

export function IconGlobe() {
  const images = [
    "/skill/Typescript.svg",
    "/skill/Appwrite.svg",
    "/skill/Docker.svg",
    "/skill/Figma.svg",
    "/skill/Github.svg",
    "/skill/Next.js.svg",
    "/skill/Node.js.svg",
    "/skill/Postman.svg",
    "/skill/ShadcnUI.svg",
    "/skill/TailwindCSS.svg",
    "/skill/Vercel.svg",
    "/skill/VSCode.svg",
    "/skill/React.svg",
    "/skill/ReactQuery.svg",
    "/skill/ReactHookForm.svg",
    "/skill/TurboRepo.svg",
    "/skill/Algolia.svg",
    "/skill/HeroUI.svg",
    "/skill/Posthog.svg",
    "/skill/Resend.svg",
    "/skill/Drive.svg",
    "skill/Tanstack.svg",
    "/skill/Zod.svg",
    "/skill/NextAuth.png",
    "/skill/JWT.svg",
    "/skill/Motion.svg",
    "/skill/Aceternity.png",
    "/skill/MagicUI.svg",
    "/skill/Sentry.svg",
  ];

  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg">
      <IconCloud images={images} className="size-full" />
    </div>
  );
}
