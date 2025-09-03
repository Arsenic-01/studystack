"use client";

import { GoogleFormCard } from "@/components/notes_page_components/google_form_components/GoogleFormCard";
import { Button } from "@/components/ui/button";
import { getUserForms } from "@/lib/actions/Form.actions";
import { Form, SessionUser } from "@/lib/appwrite_types";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const FORMS_PER_PAGE = 3;

interface FormsTabClientProps {
  initialForms: Form[];
  totalForms: number;
  userName: string;
  user: SessionUser;
}

export default function FormsTabClient({
  initialForms,
  totalForms,
  userName,
  user,
}: FormsTabClientProps) {
  const [forms, setForms] = useState<Form[]>(initialForms);
  const [offset, setOffset] = useState(initialForms.length);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreForms = async () => {
    setIsLoading(true);
    const { documents: newForms } = await getUserForms({
      userName,
      limit: FORMS_PER_PAGE,
      offset,
    });
    setForms((prev) => [...prev, ...newForms]);
    setOffset((prev) => prev + newForms.length);
    setIsLoading(false);
  };

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
      {forms.length < totalForms && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMoreForms} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
