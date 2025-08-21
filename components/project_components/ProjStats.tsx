"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchAdminDashboardStats } from "@/lib/actions/Admin.actions";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";

export default function Features() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: fetchAdminDashboardStats,
  });

  const totalLinks =
    (data?.totalYoutubeLinks || 0) + (data?.totalFormLinks || 0);

  return (
    <section className="bg-white dark:bg-black py-16 md:py-32 dark:bg-transparent">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-3xl md:text-4xl font-bold">
            Key Features of StudyStack
          </h2>
          <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            StudyStack offers a comprehensive suite of features designed to
            enhance the educational experience for students and teachers alike.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                {isLoading ? (
                  <FeatureCardSkeleton />
                ) : isError ? (
                  <span className="text-red-500">Error: {error.message}</span>
                ) : (
                  <>{data?.totalUsers}</>
                )}
              </CardDecorator>
              <h3 className="mt-6 font-medium">Users</h3>
            </CardHeader>
            <CardContent>
              <p className="mt-3 text-sm">
                Manage your users with ease. View, edit, and monitor user
                activity.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                {isLoading ? (
                  <FeatureCardSkeleton />
                ) : isError ? (
                  <span className="text-red-500">Error: {error.message}</span>
                ) : (
                  <>{data?.totalNotes}</>
                )}
              </CardDecorator>
              <h3 className="mt-6 font-medium">Notes</h3>
            </CardHeader>
            <CardContent>
              <p className="mt-3 text-sm">
                Upload, manage, and share notes seamlessly. Enhance your
                educational resources.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                {isLoading ? (
                  <FeatureCardSkeleton />
                ) : isError ? (
                  <span className="text-red-500">Error: {error.message}</span>
                ) : (
                  <>{totalLinks}</>
                )}
              </CardDecorator>
              <h3 className="mt-6 font-medium">Links</h3>
            </CardHeader>
            <CardContent>
              <p className="mt-3 text-sm">
                Manage YouTube and form links efficiently. Keep your resources
                organized and accessible.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center text-5xl">
      {children}
    </div>
  </div>
);

const FeatureCardSkeleton = () => {
  return (
    <div className="relative mx-auto size-36 duration-200">
      <div className="bg-gray-200 dark:bg-gray-800 absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full" />
    </div>
  );
};
