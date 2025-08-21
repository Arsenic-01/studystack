import Image from "next/image";
import Section from "../ui/section";
import { Card } from "../ui/card";
import DiscordIcon from "@/public/team/social_icons/discord.svg";
import GithubIcon from "@/public/team/social_icons/github.svg";
import LinkedinIcon from "@/public/team/social_icons/linkedin.svg";
import PortfolioIcon from "@/public/team/social_icons/portfolio.svg";

const teamMembers = [
  {
    name: "Vedant Bhor",
    role: "Project & Full-Stack Lead",
    imageUrl: "/team/user_pfp/vedant.jpeg",
    tasks: [
      "Next.js Full Stack Development",
      "Training & Tuning ML Models",
      "Model Performance Optimization",
      "Implementing Core Algorithms",
    ],
    links: {
      github: "https://github.com/Arsenic-01/",
      linkedin: "https://www.linkedin.com/in/vedant-bhor-39287828b/",
      discord: "https://discord.com/users/862682607162359819",
      portfolio: "https://vedantbhor.vercel.app/",
    },
  },
  {
    name: "Tanay Hingane",
    role: "AI & Authentication Specialist",
    imageUrl: "/team/user_pfp/tanay.jpeg",
    tasks: [
      "Appwrite Database Management",
      "User Authentication with Clerk",
      "Meal History Feature Logic",
      "User Profile Management",
    ],
    links: {
      github: "https://github.com/TanayHingane",
      linkedin: "http://www.linkedin.com/in/TanayHingane",
      discord: "https://discord.com/users/1198554997386915880",
      portfolio: "https://tanayhingane03.vercel.app/",
    },
  },
  {
    name: "Adarsh Tile",
    role: "Backend & API Lead",
    imageUrl: "/team/user_pfp/adarsh.jpeg",
    tasks: [
      "Developing FastAPI Backend",
      "ML Model & API Integration",
      "API Endpoint Management",
    ],
    links: {
      github: "https://github.com/AdarshSanskar",
      linkedin: "http://www.linkedin.com/in/tile-adarsh",
      discord: "https://discord.com/users/1235115974534103091",
    },
  },
  //   {
  //     name: "Sushrut Deshmukh",
  //     role: "Core Algorithm Lead",
  //     imageUrl: "/team/user_pfp/sushrut.jpeg",
  //     tasks: [
  //       "Suggesting Core Algorithms",
  //       "Model Performance Optimization",
  //       "Project Report Writing",
  //     ],
  //     links: {
  //       github: "https://github.com/Sushrut2007",
  //       linkedin: "http://www.linkedin.com/in/sushrut-deshmukh-7266622b6",
  //       discord: "https://discord.com/users/832471792627089448",
  //     },
  //   },
  {
    name: "Yadnesh Udar",
    role: "QA & Testing Lead",
    imageUrl: "/team/user_pfp/yadnesh.png",
    tasks: [
      "End-to-End Project Testing",
      "Unit & Integration Test Cases",
      "Overall Quality Assurance",
    ],
    links: {
      github: "https://github.com/Yadneshudar13",
      linkedin: "https://www.linkedin.com/in/yadnesh-udar-a0b9922b7",
      discord: "https://discord.com/users/1149927132290629662",
    },
  },
];

const Team = () => {
  return (
    <Section id="team" className="px-6 md:px-0">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-50">
          Meet the Team
        </h2>
        <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
          The dedicated individuals bringing StudyStack to life.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {teamMembers.map((member) => (
          <Card
            key={member.name}
            className="p-12 text-center flex flex-col items-center"
          >
            <Image
              src={member.imageUrl}
              alt={member.name}
              width={200}
              height={200}
              className="w-32 h-32 rounded-full select-none pointer-events-none"
            />
            <h3 className="mt-6 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              {member.name}
            </h3>
            <p className="mt-1 text-base font-semibold text-teal-600 dark:text-sky-300">
              {member.role}
            </p>

            <ul className="mt-6 text-left space-y-2 text-neutral-600 dark:text-neutral-300 list-disc list-inside text-sm flex-grow">
              {member.tasks.map((task) => (
                <div key={task}>- {task}</div>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 w-full flex justify-center space-x-5">
              <a
                href={member.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={GithubIcon.src}
                  alt="GitHub"
                  className="w-6 h-6 select-none pointer-events-none dark:invert"
                  width={24}
                  height={24}
                />
              </a>
              <a
                href={member.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={LinkedinIcon.src}
                  alt="LinkedIn"
                  className="w-6 h-6 select-none pointer-events-none dark:invert"
                  width={24}
                  height={24}
                />
              </a>
              <a
                href={member.links.discord}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={DiscordIcon.src}
                  alt="Discord"
                  className="w-6 h-6 select-none pointer-events-none dark:invert"
                  width={24}
                  height={24}
                />
              </a>
              {member.links.portfolio && (
                <a
                  href={member.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={PortfolioIcon.src}
                    alt="Portfolio"
                    className="w-6 h-6 select-none pointer-events-none dark:invert"
                    width={24}
                    height={24}
                  />
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default Team;
