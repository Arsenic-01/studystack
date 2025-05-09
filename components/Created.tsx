import { IconCloudDemo } from "./IconCloudDemo";

const Created = () => {
  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-10 border border-neutral-200 dark:border-neutral-800 pb-5 sm:py-0 px-5 rounded-xl">
        <div className="text-xl font-bold tracking-tighter max-w-lg">
          <div>
            Diploma students in Computer Technology (MSBTE) struggle with
            scattered notes, multiple software requirements, and difficult
            resource retrieval on platforms like Google Classroom. Study Stack
            simplifies this by providing a centralized, secure, and organized
            space where teachers upload and students easily access study
            materials—no more endless searching. Everything you need, all in one
            place! 🚀
          </div>
        </div>
        <IconCloudDemo />
      </div>
    </div>
  );
};

export default Created;
