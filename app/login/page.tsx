import LoginPage from "@/components/LoginPage";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
const page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-24 px-5">
      <Suspense fallback={<Skeleton className="w-full h-[400px]" />}>
        <LoginPage />
      </Suspense>
    </main>
  );
};

export default page;
