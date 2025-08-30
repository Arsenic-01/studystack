// components/project_components/SystemArchitecture.tsx

"use client";

import { Card } from "@/components/ui/card"; // Use your existing Card component
import { motion } from "framer-motion"; // For smoother interaction
import {
  BarChart2,
  Cloud,
  DatabaseZap,
  GitFork,
  MonitorSmartphone,
  Server,
  Shield,
} from "lucide-react";
import { useState } from "react";

const services = {
  frontend: {
    title: "Frontend Application",
    description:
      "The user-facing web application built with Next.js, responsible for rendering the UI for students, teachers, and admins.",
    tech: "Technologies: Next.js, React, Tailwind CSS",
    icon: <MonitorSmartphone className="size-5" />,
  },
  "auth-service": {
    title: "Authentication Service",
    description:
      "Manages user login and registration using NextAuth, providing secure access based on PRN number and password.",
    tech: "Technology: NextAuth",
    icon: <Shield className="size-5" />,
  },
  "appwrite-backend": {
    title: "Appwrite Backend API",
    description:
      "The core backend API layer powered by Appwrite, handling all business logic, data validation, and interactions with other services.",
    tech: "Technologies: Appwrite, Node.js",
    icon: <Server className="size-5" />,
  },
  "file-storage": {
    title: "Google Drive Storage",
    description:
      "Utilizes the Google Drive API for robust and scalable object storage of uploaded files, notes, and other media.",
    tech: "Technology: Google Drive API",
    icon: <Cloud className="size-5" />,
  },
  analytics: {
    title: "Monitoring & Analytics",
    description:
      "Integrates with PostHog and Sentry for real-time error tracking, performance monitoring, and detailed user behavior analytics.",
    tech: "Technologies: PostHog, Sentry",
    icon: <BarChart2 className="size-5" />,
  },
  database: {
    title: "Appwrite Database",
    description:
      "The primary database managed by Appwrite, storing all user data, resource metadata, permissions, and system configurations securely.",
    tech: "Technology: Appwrite Database",
    icon: <DatabaseZap className="size-5" />,
  },
};

type ServiceId = keyof typeof services;

const ServiceNode = ({
  id,
  title,
  icon,
  onMouseOver,
  onMouseLeave,
  isActive,
}: {
  id: ServiceId;
  title: string;
  icon: React.ReactNode;
  onMouseOver: (id: ServiceId) => void;
  onMouseLeave: () => void;
  isActive: boolean;
}) => (
  <motion.div
    id={id}
    onMouseOver={() => onMouseOver(id)}
    onMouseLeave={onMouseLeave}
    className={`flex items-center gap-3 p-4 rounded-lg border
      ${
        isActive
          ? "bg-blue-600 text-white shadow-lg border-blue-600"
          : "bg-background text-foreground border border-neutral-300 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md"
      }`}
    style={{ borderWidth: 1 }}
  >
    <div
      className={`p-2 rounded-md ${
        isActive
          ? "bg-white/20"
          : "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
      }`}
    >
      {icon}
    </div>
    <span className="font-semibold text-sm md:text-base select-none pointer-events-none">
      {title}
    </span>
  </motion.div>
);

export default function SystemArchitecture() {
  const [selectedService, setSelectedService] = useState<ServiceId | null>(
    null
  );

  const handleMouseOver = (id: ServiceId) => {
    setSelectedService(id);
  };

  const handleMouseLeave = () => {
    setSelectedService(null);
  };

  const currentServiceInfo = selectedService
    ? services[selectedService]
    : {
        title: "Hover over a component to learn more",
        description:
          "Explore the intricate design of StudyStack, from its user interface to its robust backend services.",
        tech: "",
        icon: <GitFork className="size-5 text-muted-foreground" />,
      };

  return (
    <section id="architecture" className="w-full max-w-7xl py-12">
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          StudyStack System Architecture
        </h2>
        <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-400 max-w-3xl mx-auto">
          Built for scalability and reliability, our system comprises modular
          components working in harmony.
        </p>
      </div>

      <Card className="p-4 md:p-10 lg:p-12 border border-neutral-300 dark:border-neutral-800 bg-card/50 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Architecture Diagram Area */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center px-4 py-6 md:p-6 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-background/70 shadow-inner space-y-4">
            {/* Top Row: Frontend */}
            <ServiceNode
              id="frontend"
              title={services.frontend.title}
              icon={services.frontend.icon}
              onMouseOver={handleMouseOver}
              onMouseLeave={handleMouseLeave}
              isActive={selectedService === "frontend"}
            />
            <div className="h-8 w-px bg-blue-400 dark:bg-blue-600 opacity-60 flex items-center justify-center relative">
              <span className="absolute -left-6 text-xs text-muted-foreground">
                Requests
              </span>
            </div>

            {/* Middle Row: Core Backend & Auth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <ServiceNode
                id="auth-service"
                title={services["auth-service"].title}
                icon={services["auth-service"].icon}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                isActive={selectedService === "auth-service"}
              />
              <ServiceNode
                id="appwrite-backend"
                title={services["appwrite-backend"].title}
                icon={services["appwrite-backend"].icon}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                isActive={selectedService === "appwrite-backend"}
              />
            </div>
            <div className="h-8 w-px bg-blue-400 dark:bg-blue-600 opacity-60 flex items-center justify-center relative">
              <span className="absolute -left-3 text-xs text-muted-foreground">
                Data Flow
              </span>
            </div>

            {/* Bottom Row: External Services */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <ServiceNode
                id="file-storage"
                title={services["file-storage"].title}
                icon={services["file-storage"].icon}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                isActive={selectedService === "file-storage"}
              />
              <ServiceNode
                id="analytics"
                title={services.analytics.title}
                icon={services.analytics.icon}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                isActive={selectedService === "analytics"}
              />
            </div>
            <div className="h-8 w-px bg-blue-400 dark:bg-blue-600 opacity-60 flex items-center justify-center relative">
              <span className="absolute -left-6 text-xs text-muted-foreground">
                Persistent Storage
              </span>
            </div>

            {/* Database */}
            <ServiceNode
              id="database"
              title={services.database.title}
              icon={services.database.icon}
              onMouseOver={handleMouseOver}
              onMouseLeave={handleMouseLeave}
              isActive={selectedService === "database"}
            />
          </div>

          {/* Details Panel */}
          <motion.div
            key={selectedService || "default"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-muted/30 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-300 dark:border-neutral-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4 text-blue-600 dark:text-blue-400">
                {currentServiceInfo.icon}
                <h3 className="text-xl font-bold text-foreground">
                  {currentServiceInfo.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {currentServiceInfo.description}
              </p>
            </div>
            {currentServiceInfo.tech && (
              <div className="mt-6 pt-4 border-t border-neutral-300 dark:border-neutral-800">
                <p className="font-semibold text-sm text-foreground">
                  Key Technologies:
                </p>
                <p className="text-sm text-neutral-700 dark:text-neutral-400 mt-1">
                  {currentServiceInfo.tech}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </Card>
    </section>
  );
}
