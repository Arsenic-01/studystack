import SubjectSearch from "@/components/SubjectFilter";

const page = async ({ params }: { params: { sem: string } }) => {
  const { sem } = await params;

  return (
    <div className="flex flex-col gap-8 sm:gap-16 items-center justify-center w-full py-16 md:py-24 px-1">
      <div className="flex flex-col gap-4 items-start justify-center w-full max-w-5xl pt-10 lg:pt-5 px-5 md:px-8">
        <SubjectSearch sem={sem} />
      </div>
    </div>
  );
};

export default page;
