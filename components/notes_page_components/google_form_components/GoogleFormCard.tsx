// components/google_form_components/GoogleFormCard.tsx

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
import DeleteFormLink from "./DeleteFormLink";
import EditFormLink from "./EditFormLink";

// Define the shape of the 'form' and 'user' props
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

// Configuration for different link types
const linkTypeConfig = {
  googleForm: {
    icon: ClipboardList, // more "form-like"
    label: "Google Form",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-100 dark:bg-teal-900/50",
  },
  assignment: {
    icon: FileText, // cleaner assignment look
    label: "Assignment",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/50",
  },
  other: {
    icon: Globe, // feels more "generic link"
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

  return (
    <div className="flex text- flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-muted/50">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className={`p-2 rounded-full ${config.bg}`}>
          <Icon className={`size-5 ${config.color}`} />
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold leading-tight">{form.quizName}</h3>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Added by {form.createdBy}</span>
            <Badge variant="secondary">{config.label}</Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-fit self-end sm:self-center">
        {(user?.name === form.createdBy || user?.role === "admin") && (
          <>
            <Button
              variant="outline"
              className="w-full md:w-fit"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
              Edit Link
            </Button>{" "}
            <DeleteFormLink
              id={form.id}
              semester={semester}
              abbreviation={abbreviation}
            />
          </>
        )}
        {isEditing && (
          <EditFormLink
            open={isEditing}
            onOpenChange={setIsEditing}
            id={form.id}
            url={form.url}
            quizName={form.quizName}
            formType={form.formType}
            semester={form.semester}
            abbreviation={form.abbreviation}
          />
        )}
        <Button asChild variant="outline" className="w-full sm:w-fit">
          <a href={form.url} target="_blank" rel="noopener noreferrer">
            Open <SquareArrowOutUpRight className="size-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};
