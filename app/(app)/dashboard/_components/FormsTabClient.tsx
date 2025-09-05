"use client";

import { GoogleFormCard } from "@/app/(app)/semester/[sem]/[sub]/_components/_cards/GoogleFormCard";
import { Button } from "@/components/ui/button";
import { getUserForms } from "@/lib/actions/Form.actions";
import { Form, SessionUser } from "@/lib/appwrite_types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const FORMS_PER_PAGE = 3;

interface FormsTabClientProps {
  initialForms: { documents: Form[]; total: number };
  userName: string;
  user: SessionUser;
}

export default function FormsTabClient({
  initialForms,
  userName,
  user,
}: FormsTabClientProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["userForms", userName],
      queryFn: async ({ pageParam = 0 }) => {
        const res = await getUserForms({
          userName,
          limit: FORMS_PER_PAGE,
          offset: pageParam,
        });
        return { ...res, offset: pageParam };
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const currentCount = lastPage.offset + lastPage.documents.length;
        if (currentCount < lastPage.total) {
          return currentCount;
        }
        return undefined;
      },
      initialData: {
        pages: [
          {
            documents: initialForms.documents,
            total: initialForms.total,
            offset: 0,
          },
        ],
        pageParams: [0],
      },
      staleTime: 5 * 60 * 1000,
    });

  const forms = data?.pages.flatMap((page) => page.documents) ?? [];

  return (
    <div>
      <div className="flex flex-col gap-4">
        {forms.map((form: Form) => (
          <GoogleFormCard
            key={form.id}
            form={form}
            user={user}
            semester={form.semester}
            abbreviation={form.abbreviation}
          />
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
