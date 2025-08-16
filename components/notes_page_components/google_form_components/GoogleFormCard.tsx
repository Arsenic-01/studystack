// components/google_form_components/GoogleFormCard.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardCheck,
  FilePenLine,
  Link as LinkIcon,
  SquareArrowOutUpRight,
  User,
} from "lucide-react";
import React from "react";
import DeleteFormLink from "./DeleteFormLink";
import EditFormLink from "./EditFormLink";

// Define the shape of the 'form' and 'user' props
interface FormLink {
  id: string;
  url: string;
  quizName: string;
  createdBy: string;
  formType: "googleForm" | "assignment" | "other";
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
    icon: ClipboardCheck,
    label: "Google Form",
    color: "text-green-600 dark:text-green-500",
    bg: "bg-green-100 dark:bg-green-900/50",
  },
  assignment: {
    icon: FilePenLine,
    label: "Assignment",
    color: "text-blue-600 dark:text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/50",
  },
  other: {
    icon: LinkIcon,
    label: "Other Link",
    color: "text-slate-600 dark:text-slate-500",
    bg: "bg-slate-100 dark:bg-slate-900/50",
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

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className={`p-3 rounded-full ${config.bg}`}>
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
            <EditFormLink
              formType={form.formType}
              semester={semester}
              abbreviation={abbreviation}
              url={form.url}
              id={form.id}
              quizName={form.quizName}
            />
            <DeleteFormLink
              id={form.id}
              semester={semester}
              abbreviation={abbreviation}
            />
          </>
        )}
        <Button asChild variant="outline" className="w-full sm:w-fit">
          <a href={form.url} target="_blank" rel="noopener noreferrer">
            Open <SquareArrowOutUpRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};
