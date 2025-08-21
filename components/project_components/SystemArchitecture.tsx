"use client";

import { BarChart2, Cloud, Server, Shield, StoreIcon, Zap } from "lucide-react";
import { useState } from "react";
import { Card } from "../ui/card";
import Section from "../ui/section";

// Updated services for the StudyStack project
const services = {
  frontend: {
    title: "Frontend Application",
    description:
      "The user-facing web application built with Next.js, responsible for rendering the UI for students, teachers, and admins.",
    tech: "Technology: Next.js 15, Tailwind CSS",
  },
  "auth-service": {
    title: "Authentication Service",
    description:
      "Manages user login and registration using NextAuth, providing secure access based on PRN number and password.",
    tech: "Technology: NextAuth",
  },
  "appwrite-backend": {
    title: "Appwrite Backend",
    description:
      "The core backend service powered by Node-Appwrite, managing all database interactions for users, resources, and permissions.",
    tech: "Technology: Node-Appwrite",
  },
  // "resource-management": {
  //   title: "Resource Management",
  //   description:
  //     "Handles the creation, reading, updating, and deletion of notes, YouTube links, and external URLs uploaded by teachers.",
  //   tech: "Technology: Node-Appwrite",
  // },
  "file-storage": {
    title: "File Storage Service",
    description:
      "Utilizes the Google Drive API for robust and scalable object storage of uploaded files and notes.",
    tech: "Technology: Google Drive API",
  },
  analytics: {
    title: "Monitoring & Analytics",
    description:
      "Integrates with PostHog to track and analyze key user metrics, such as session starts and stops, which are displayed in the admin panel.",
    tech: "Technology: PostHog",
  },
  database: {
    title: "Appwrite Database",
    description:
      "The Appwrite database stores all user data, including profiles, resources, and permissions, ensuring secure and efficient data management.",
    tech: "Technology: Appwrite Database",
  },
};

type ServiceId = keyof typeof services;

const Architecture = () => {
  const [selectedService, setSelectedService] = useState<ServiceId | null>(
    null
  );

  const handleMouseOver = (id: ServiceId) => {
    setSelectedService(id);
  };

  const currentService = selectedService
    ? services[selectedService]
    : {
        title: "Hover over a service",
        description:
          "Detailed information about the selected component will appear here.",
        tech: "",
      };

  const ServiceNode = ({
    id,
    children,
    className,
    icon,
  }: {
    id: ServiceId;
    children: React.ReactNode;
    className?: string;
    icon: React.ReactNode;
  }) => (
    <div
      id={id}
      onMouseOver={() => handleMouseOver(id)}
      className={`service-node font-semibold border-2 rounded-lg p-3 w-full text-center bg-white shadow-sm cursor-pointer transition-transform duration-200 hover:scale-[1.01] ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        {icon}
        {children}
      </div>
    </div>
  );

  return (
    <Section id="architecture" className="px-6 md:px-0">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-neutral-800 dark:text-neutral-50 flex items-center justify-center ">
        StudyStack Architecture
      </h2>
      <p className="text-center text-neutral-500 dark:text-neutral-400 mx-auto mb-12">
        StudyStack is built on a robust, scalable architecture. Hover over a
        component in the diagram below to learn more about its specific role and
        technology.
      </p>
      <Card className="p-2 md:p-4 lg:p-6 md:mx-44">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 flex flex-col items-center justify-center space-y-4 border border-dashed border-slate-300 dark:border-slate-800">
            <ServiceNode
              id="frontend"
              icon={<Zap className="size-4" />}
              className="border-neutral-300 dark:border-slate-600 text-black dark:text-white bg-white dark:bg-black"
            >
              Frontend (Next.js)
            </ServiceNode>
            <div className="text-teal-500 font-bold text-2xl">↓</div>
            <ServiceNode
              id="auth-service"
              icon={<Shield className="size-4" />}
              className="border-purple-300 bg-red-50 dark:bg-black text-black dark:text-white"
            >
              Authentication (NextAuth)
            </ServiceNode>
            <div className="text-teal-500 font-bold text-2xl">↓</div>
            <ServiceNode
              id="appwrite-backend"
              icon={<Server className="size-4" />}
              className="border-blue-300 bg-blue-300 dark:bg-black text-black dark:text-white"
            >
              Appwrite Backend
            </ServiceNode>
            <div className="text-teal-500 font-bold text-2xl">↓</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-center">
              <ServiceNode
                id="file-storage"
                icon={<Cloud className="size-4" />}
                className="border-gray-300 bg-sky-50 dark:bg-black p-2 text-black dark:text-white"
              >
                Drive Storage
              </ServiceNode>
              <ServiceNode
                id="analytics"
                icon={<BarChart2 className="size-4" />}
                className="border-gray-300 bg-sky-50 dark:bg-black p-2 text-black dark:text-white"
              >
                Monitoring (PostHog)
              </ServiceNode>
            </div>
            <div className="text-teal-500 font-bold text-2xl">↓</div>
            <ServiceNode
              id="database"
              icon={<StoreIcon className="size-4" />}
              className="border-cyan-200 bg-sky-50 dark:bg-black p-2 text-black dark:text-white"
            >
              Appwrite Database
            </ServiceNode>
          </div>
          <div className="bg-teal-50 dark:bg-neutral-900 rounded-lg p-6 border border-teal-200 dark:border-neutral-800 h-full">
            <h3 className="text-xl font-bold text-teal-800 dark:text-teal-300 mb-2">
              {currentService.title}
            </h3>
            <p className="text-neutral-700 dark:text-white">
              {currentService.description}
            </p>
            <div className="mt-4 font-semibold text-sm text-neutral-600 dark:text-neutral-100">
              {currentService.tech}
            </div>
          </div>
        </div>
      </Card>
    </Section>
  );
};

export default Architecture;
