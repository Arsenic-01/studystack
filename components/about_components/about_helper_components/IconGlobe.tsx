import { IconCloud } from "../../ui/magicui/icon-cloud";

export function IconGlobe() {
  const images = [
    "/skill/Typescript.svg",
    "/skill/Appwrite.svg",
    "/skill/Docker.svg",
    "/skill/Figma.svg",
    "/skill/Github.svg",
    "/skill/Javascript.svg",
    "/skill/Next.js.svg",
    "/skill/Node.js.svg",
    "/skill/Postman.svg",
    "/skill/Shadcn.svg",
    "/skill/TailwindCSS.svg",
    "/skill/Vercel.svg",
    "/skill/VSCode.svg",
    "/skill/React.svg",
    "/skill/ReactQuery.png",
    "/skill/ReactHookForm.svg",
    "/skill/TurbopackLight.svg",
    "/skill/TurbopackDark.svg",
  ];

  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg">
      <IconCloud images={images} className="size-full" />
    </div>
  );
}
