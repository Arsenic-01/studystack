import { IconCloud } from "./magicui/icon-cloud";

export function IconCloudDemo() {
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
    "/skill/shadcn.svg",
    "/skill/TailwindCSS.svg",
    "/skill/Vercel.svg",
    "/skill/visual-studio-code-icon.svg",
    "/skill/React.svg",
    "/skill/react-query.png",
    "/skill/react-hook-form.svg",
    "/skill/turbopack-hero-logo-light.svg",
    // "/skill/api.png",
  ];

  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden">
      <IconCloud images={images} />
    </div>
  );
}
