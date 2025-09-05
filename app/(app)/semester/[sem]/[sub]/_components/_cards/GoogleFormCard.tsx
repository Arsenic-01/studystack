// components/google_form_components/GoogleFormCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  FileText,
  Globe,
  Pencil,
  SquareArrowOutUpRight,
  User,
} from "lucide-react";
import React, { useState } from "react";
import DeleteFormLink from "../_mutations/_links/DeleteFormLink";
import EditFormLink from "../_mutations/_links/EditFormLink";

interface FormLink {
  id: string;
  url: string;
  quizName: string;
  createdBy: string;
  formType: "googleForm" | "assignment" | "other";
  semester: string;
  abbreviation: string;
}

interface User {
  name: string;
  role: string;
}

interface GoogleFormCardProps {
  form: FormLink;
  user: User | null;
  semester: string;
  abbreviation: string;
}

const linkTypeConfig = {
  googleForm: {
    icon: ClipboardList,
    label: "Google Form",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-100 dark:bg-teal-900/50",
  },
  assignment: {
    icon: FileText,
    label: "Assignment",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/50",
  },
  other: {
    icon: Globe,
    label: "Other Link",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-900/40",
  },
};

export const GoogleFormCard: React.FC<GoogleFormCardProps> = ({
  form,
  user,
  semester,
  abbreviation,
}) => {
  const config = linkTypeConfig[form.formType] || linkTypeConfig.other;
  const Icon = config.icon;
  const [isEditing, setIsEditing] = useState(false);

  const canModify = user?.name === form.createdBy || user?.role === "admin";

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-y-4 gap-x-2 p-4 border border-neutral-300 dark:border-neutral-800 rounded-lg hover:bg-muted/50">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className={`p-2 rounded-full ${config.bg}`}>
          <Icon className={`size-5 ${config.color}`} />
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold leading-tight">{form.quizName}</h3>
          </div>
          <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-2 gap-y-1">
            <User className="h-4 w-4" />
            <span>Added by {form.createdBy}</span>
            <Badge variant="secondary">{config.label}</Badge>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        {canModify && (
          <div className="flex w-full sm:w-auto gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-center"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
              Edit Link
            </Button>
            <DeleteFormLink
              id={form.id}
              semester={semester}
              abbreviation={abbreviation}
            />
          </div>
        )}
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <a
            href={form.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2"
          >
            Open <SquareArrowOutUpRight className="size-4 ml-1" />
          </a>
        </Button>
      </div>

      {isEditing && (
        <EditFormLink
          open={isEditing}
          onOpenChange={setIsEditing}
          id={form.id}
          url={form.url}
          quizName={form.quizName}
          formType={form.formType}
          abbreviation={form.abbreviation}
        />
      )}
    </div>
  );
};
