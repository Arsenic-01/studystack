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
  role?: "Project Lead";
  pfp: string;
  classInfo: "TYCM-Lin 2025" | "TYCM-MAC 2025";
  quote: string;
  socials: SocialLink[];
  contributions: string[];
  contributionSplit: {
    coding: number;
    docs: number;
    testing: number;
    research: number;
    database: number;
  };
};

// Consolidated team data
export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Vedant B. Bhor",
    role: "Project Lead",
    pfp: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/team/user_pfp/vedant.jpg",
    classInfo: "TYCM-Lin 2025",
    quote: "Late? I call it ‘scheduled delay’. 🕒",
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
      "Architected the backend logic for resource addition (YouTube links, notes, quizzes) with Appwrite.",
      "Integrated Sentry for real-time error tracking and performance monitoring, enabling proactive bug fixes and improving application stability.",
      "Implemented a high-performance search functionality across all content using Algolia, dramatically improving user experience.",
      "Co-developed the admin dashboard, focusing on intuitive UI/UX for managing users and content.",
      "Integrated PostHog for advanced analytics and user behavior tracking, providing insights to drive future enhancements.",
      "Optimized the application's performance through code-splitting, lazy loading, and efficient state management.",
      "Reduced server loads by optimizing database queries and offloading intensive tasks to cloud functions.",
      "Deployed the application on Vercel, ensuring seamless CI/CD and optimal performance.",
    ],
    contributionSplit: {
      coding: 75,
      docs: 5,
      testing: 15,
      research: 30,
      database: 45,
    },
  },
  {
    id: 2,
    name: "Tanay K. Hingane",
    pfp: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/team/user_pfp/tanay.jpeg",
    classInfo: "TYCM-Lin 2025",
    quote: "Battery low, sarcasm high. 🪫",
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
      "Implemented NextAuth for user authentication pathways and future-proofing the application's security model.",
      "Designed and built the dedicated project portfolio section to showcase our collective work and skills.",
      "Refactored frontend components for the landing page, improving code readability and performance.",
      "Handled the logic for editing and managing abbreviation links within the notes page.",
      "Implemented a dynamic note sorting mechanism, enhancing accessibility and user experience across multiple subjects and semesters.",
    ],
    contributionSplit: {
      coding: 15,
      docs: 55,
      testing: 15,
      research: 30,
      database: 45,
    },
  },
  {
    id: 3,
    name: "Adarsh S. Tile",
    pfp: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/team/user_pfp/adarsh.jpg",
    classInfo: "TYCM-MAC 2025",
    quote: "Skipping plans like a pro. ❌",
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
      "Played a pivotal role in implementing the global search functionality using Algolia, enhancing user experience by enabling quick access to resources.",
      "Designed and developed the 'About Us' page from concept to implementation, creating the component you're looking at now.",
      "Re-architected the video embedding and playback components for better performance and cross-browser compatibility.",
      "Recorded and edited the demo video showcasing the application's features and user interface.",
      "Played a key role in drafting and compiling the official project report, synopsis and technical docs.",
      "Contributed to UI/UX refinements across the application to ensure a consistent and polished user experience.",
      "Assisted in debugging and resolving frontend issues identified during the development cycle.",
    ],
    contributionSplit: {
      coding: 10,
      docs: 40,
      testing: 35,
      research: 25,
      database: 10,
    },
  },
  {
    id: 4,
    name: "Yadnesh Udar",
    pfp: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/team/user_pfp/yadnesh.jpg",
    classInfo: "TYCM-MAC 2025",
    quote: "CEO – Chief Excuse Officer. 🫡",
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
      "Integration testing for the entire application, ensuring all components work seamlessly together.",
      "Conducted usability testing sessions to gather user feedback and identify areas for improvement.",
      "Collaborated with the team to create comprehensive test cases and documentation for future reference.",
      "Performed cross-browser and device testing to ensure consistent performance and appearance.",
      "Researched best practices for testing methodologies and tools to enhance the testing process.",
      "Recommended features and improvements based on testing outcomes and user feedback.",
    ],
    contributionSplit: {
      coding: 0,
      docs: 0,
      testing: 35,
      research: 15,
      database: 0,
    },
  },
];
