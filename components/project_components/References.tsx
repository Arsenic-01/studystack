// components/project_components/References.tsx

import { LinkIcon } from "lucide-react";

const references = [
  {
    author: "Zainab, A. N.",
    year: 2017,
    title: "E-Learning Platform and Modern Education.",
    source:
      "International Journal of e-Education, e-Business, e-Management and e-Learning",
    href: "https://www.ijeeee.org/Papers/022-Z0005.pdf",
    summary:
      "Explores the fundamental aspects of e-learning platforms and their role in contemporary education.",
  },
  {
    author: "Sandhu, R., et al.",
    year: 1996,
    title: "Role-Based Access Control Models.",
    source: "IEEE Computer",
    href: "https://csrc.nist.gov/csrc/media/projects/role-based-access-control/documents/sandhu96.pdf",
    summary:
      "A foundational paper defining the core concepts and models of Role-Based Access Control (RBAC).",
  },
  {
    author: "Al-Sammarraie, H., et al.",
    year: 2019,
    title:
      "How Student Information System Influence Students’ Trust and Satisfaction Towards the University?",
    source: "ResearchGate",
    href: "https://www.researchgate.net/publication/335131930_How_Student_Information_System_Influence_Students'_Trust_and_Satisfaction_Towards_the_University_An_Empirical_Study_in_a_Multicultural_Environment",
    summary:
      "An empirical study on how student information systems impact trust and satisfaction in a university setting.",
  },
  {
    author: "Bousrih, J., et al.",
    year: 2014,
    title: "Review of Monitoring Tools for E-Learning Platforms.",
    source: "ResearchGate",
    href: "https://www.researchgate.net/publication/263811918_Review_of_Monitoring_Tools_for_E-Learning_Platforms",
    summary:
      "A comprehensive review of various monitoring tools applicable to e-learning environments.",
  },
  {
    author: "Vercel Inc.",
    year: "Ongoing",
    title: "Next.js Documentation.",
    source: "Vercel",
    href: "https://nextjs.org/docs",
    summary:
      "Official documentation for Next.js, the React framework used for our frontend.",
  },
  {
    author: "Appwrite Team.",
    year: "Ongoing",
    title: "Appwrite: Build Fast. Scale Big. All in One Place.",
    source: "Appwrite",
    href: "https://appwrite.io/docs",
    summary:
      "Official documentation for Appwrite, our open-source backend-as-a-service platform.",
  },
];

export default function ProjectReferences() {
  return (
    <section id="references" className="w-full max-w-6xl">
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Academic & Technical Foundations
        </h2>
        <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-400 max-w-3xl mx-auto">
          Our work is deeply informed by established research, best practices,
          and robust documentation in technology and education.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-5 lg:gap-8">
        {references.map((ref, index) => (
          <div
            key={index}
            className="flex flex-col p-6 bg-card/50 border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <a
                href={ref.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-2"
              >
                {ref.title} <LinkIcon className="h-4 w-4 shrink-0" />
              </a>
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {`${ref.author} (${ref.year}). ${ref.source}.`}
            </p>
            {ref.summary && (
              <p className="text-xs text-muted-foreground italic border-t border-neutral-300 dark:border-neutral-800 pt-3 mt-auto">
                {ref.summary}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
