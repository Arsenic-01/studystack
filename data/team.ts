import {
  FaDiscord,
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa6";

// Define a type for our team members for better code safety
export type SocialLink = {
  name: "GitHub" | "LinkedIn" | "Email" | "Portfolio" | "Discord" | "Whatsapp";
  url: string;
  username: string;
  Icon:
    | typeof FaDiscord
    | typeof FaEnvelope
    | typeof FaGithub
    | typeof FaGlobe
    | typeof FaLinkedin
    | typeof FaWhatsapp;
};

export type TeamMember = {
  id: number;
  name:
    | "Vedant B. Bhor"
    | "Tanay K. Hingane"
    | "Adarsh S. Tile"
    | "Yadnesh Udar";
  pfp: string;
  classInfo: "TYCM-Lin 2025" | "TYCM-MAC 2025";
  quote: string;
  socials: SocialLink[];
  contributions: string[];
  contributionSplit: {
    coding: number;
    documentation: number;
    testing: number;
    research: number;
  };
};

// Consolidated team data
export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Vedant B. Bhor",
    pfp: "/vedantpfp.jpg",
    classInfo: "TYCM-Lin 2025",
    quote: "I am a dedicated Late Comer! 🕔",
    socials: [
      {
        name: "Whatsapp",
        url: "https://wa.me/919975278911",
        username: "Vedant Bhor",
        Icon: FaWhatsapp,
      },
      {
        name: "GitHub",
        url: "https://github.com/Arsenic-01/",
        username: "Arsenic-01",
        Icon: FaGithub,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/vedant-bhor-39287828b/",
        username: "Vedant Bhor",
        Icon: FaLinkedin,
      },
      {
        name: "Portfolio",
        url: "https://vedantbhor.vercel.app/",
        username: "Arsenic",
        Icon: FaGlobe,
      },
      {
        name: "Email",
        url: "mailto:vedbhor25@gmail.com",
        username: "vedbhor25@gmail.com",
        Icon: FaEnvelope,
      },
      {
        name: "Discord",
        url: "https://discord.com/users/862682607162359819",
        username: "itsmehomie",
        Icon: FaDiscord,
      },
    ],
    contributions: [
      "Engineered the complete user authentication flow using Appwrite, ensuring secure sign-up, login, and session management.",
      "Integrated Sentry for real-time error tracking and performance monitoring, enabling proactive bug fixes and improving application stability.",
      "Implemented a high-performance search functionality across all content using Algolia, dramatically improving user experience.",
      "Co-developed the admin dashboard, focusing on intuitive UI/UX for managing educational materials like quizzes and notes.",
      "Architected the backend logic for resource addition (YouTube links, notes, quizzes) with Appwrite.",
      "Led the initial frontend design and component structure for the main landing page.",
    ],
    contributionSplit: {
      coding: 75,
      documentation: 5,
      testing: 15,
      research: 30,
    },
  },
  {
    id: 2,
    name: "Tanay K. Hingane",
    pfp: "/team/user_pfp/tanay.jpeg",
    classInfo: "TYCM-Lin 2025",
    quote: "I am a dedicated Low-Battery Guy! 🪫",
    socials: [
      {
        name: "Whatsapp",
        url: "https://wa.me/918446663807",
        username: "Tanay Hingane",
        Icon: FaWhatsapp,
      },
      {
        name: "GitHub",
        url: "https://github.com/TanayHingane",
        username: "TanayHingane",
        Icon: FaGithub,
      },
      {
        name: "LinkedIn",
        url: "http://www.linkedin.com/in/TanayHingane",
        username: "Tanay Hingane",
        Icon: FaLinkedin,
      },
      {
        name: "Portfolio",
        url: "https://tanayhingane03.vercel.app/",
        username: "Victus03",
        Icon: FaGlobe,
      },
      {
        name: "Email",
        url: "mailto:tanayhingane03@gmail.com",
        username: "tanayhingane03@gmail.com",
        Icon: FaEnvelope,
      },
      {
        name: "Discord",
        url: "https://discord.com/users/1198554997386915880",
        username: "tanay.h03",
        Icon: FaDiscord,
      },
    ],
    contributions: [
      "Structured and managed the Appwrite database collections, ensuring data integrity and efficient querying.",
      "Implemented NextAuth for alternative authentication pathways and future-proofing the application's security model.",
      "Developed key UI components for the quiz and notes sections, including dynamic sorting and filtering logic.",
      "Designed and built the dedicated project portfolio section to showcase our collective work and skills.",
      "Refactored frontend components for the landing page, improving code readability and performance.",
      "Handled the logic for editing and managing abbreviation links within the admin dashboard.",
    ],
    contributionSplit: {
      coding: 15,
      documentation: 55,
      testing: 15,
      research: 30,
    },
  },
  {
    id: 3,
    name: "Adarsh S. Tile",
    pfp: "/adarshpfp.jpg",
    classInfo: "TYCM-MAC 2025",
    quote: "I am a dedicated Trip Skipper! ❌",
    socials: [
      {
        name: "Whatsapp",
        url: "https://wa.me/7588038469",
        username: "Adarsh Tile",
        Icon: FaWhatsapp,
      },
      {
        name: "GitHub",
        url: "https://github.com/AdarshSanskar",
        username: "AdarshSanskar",
        Icon: FaGithub,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/tile-adarsh",
        username: "Adarsh Tile",
        Icon: FaLinkedin,
      },
      {
        name: "Discord",
        url: "https://discord.com/users/1235115974534103091",
        username: "astile1424",
        Icon: FaDiscord,
      },
      {
        name: "Email",
        url: "mailto:astile1424@gmail.com",
        username: "astile1424@gmail.com",
        Icon: FaEnvelope,
      },
    ],
    contributions: [
      "Designed and developed the 'About Us' page from concept to implementation, creating the component you're looking at now.",
      "Re-architected the video embedding and playback components for better performance and cross-browser compatibility.",
      "Played a key role in drafting and compiling the official project report and technical documentation.",
      "Contributed to UI/UX refinements across the application to ensure a consistent and polished user experience.",
      "Assisted in debugging and resolving frontend issues identified during the development cycle.",
    ],
    contributionSplit: {
      coding: 10,
      documentation: 40,
      testing: 35,
      research: 25,
    },
  },
  {
    id: 4,
    name: "Yadnesh Udar",
    pfp: "/yadneshpfp.jpg",
    classInfo: "TYCM-MAC 2025",
    quote: "I am a dedicated CEO! 🫡",
    socials: [
      {
        name: "Whatsapp",
        url: "https://wa.me/7030075996",
        username: "Yadnesh Udar",
        Icon: FaWhatsapp,
      },
      {
        name: "GitHub",
        url: "https://github.com/Yadneshudar13",
        username: "Yadneshudar13",
        Icon: FaGithub,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/yadnesh-udar-a0b9922b7",
        username: "Yadnesh Udar",
        Icon: FaLinkedin,
      },
      {
        name: "Discord",
        url: "https://discord.com/yadnesh_udar",
        username: "yadnesh_udar.",
        Icon: FaDiscord,
      },
      {
        name: "Email",
        url: "mailto:yadneshudar@gmail.com",
        username: "yadneshudar@gmail.com",
        Icon: FaEnvelope,
      },
    ],
    contributions: [
      "Led the project management and coordination efforts, ensuring the team stayed on track with deadlines and objectives.",
      "Authored a significant portion of the project's official report and comprehensive technical documentation.",
      "Oversaw the project's overall vision and direction, facilitating communication and collaboration between team members.",
      "Contributed to ideation and feature planning during the initial stages of the project.",
      "Ensured all final deliverables met the required academic and technical standards.",
    ],
    contributionSplit: {
      coding: 0,
      documentation: 0,
      testing: 35,
      research: 15,
    },
  },
];
