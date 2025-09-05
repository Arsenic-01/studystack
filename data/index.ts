// data/index.ts
import { FaGlobe, FaInstagram, FaYoutube } from "react-icons/fa6";

export const hostedAt = "https://studystack01.vercel.app";

export const semester = [
  {
    key: "1",
    label: "Semester 1",
  },
  {
    key: "2",
    label: "Semester 2",
  },
  {
    key: "3",
    label: "Semester 3",
  },
  {
    key: "4",
    label: "Semester 4",
  },
  {
    key: "5",
    label: "Semester 5",
  },
  // {
  //   key: '6',
  //   label: 'Semester 6',
  // },
];
export const accordianItems = [
  {
    title: "What is StudyStack?",
    content:
      "StudyStack is a dedicated digital ecosystem for Computer Technology (CM) students at K.K. Wagh Polytechnic, Nashik. It serves as a single, centralized hub for all academic materials, including notes, video links, and study guides.",
  },
  {
    title: "Why was StudyStack created?",
    content:
      "The project was born out of the need to solve a common student problem: disorganized and scattered study materials. StudyStack was built to streamline access to essential resources, ensuring every student has the up-to-date information they need to succeed academically.",
  },
  {
    title: "Who developed StudyStack?",
    content:
      "StudyStack is a collaborative final-year project developed by a team of dedicated students: Vedant Bhor, Tanay Hingane, Adarsh Tile, and Yadnesh Udar. The project was completed under the expert guidance of our faculty mentors, Prof. A. D. Talole and Prof. G. B. Katkade.",
  },
  {
    title: "Who is this platform for?",
    content:
      "While primarily designed for students and faculty of the Computer Technology department at K.K. Wagh Polytechnic, StudyStack is free to use for any student with valid login credentials provided by the institution.",
  },
  {
    title: "How does StudyStack work?",
    content:
      "StudyStack operates on a role-based system. Teachers and faculty can easily upload and manage subject-specific resources. Students can then log in to access this organized content anytime. It offers a user experience similar to Google Classroom but is tailored specifically for our curriculum's needs.",
  },
  {
    title: "What technologies power StudyStack?",
    content:
      "StudyStack is built on a modern, robust tech stack: \n • Frontend: Next.js & React \n • Styling: Tailwind CSS \n • Backend & Database: Appwrite (Self-hosted) \n • Authentication: NextAuth \n • Error Monitoring: Sentry \n This combination ensures a fast, secure, and reliable experience for all users.",
  },
  {
    title: "Is this project open-source?",
    content:
      "Yes! We believe in the power of collaborative development. StudyStack is an open-source project, and we welcome contributions. You can explore the full source code on GitHub: https://github.com/Arsenic-01/studystack",
  },
  {
    title: "Can I use StudyStack on multiple devices?",
    content:
      "Yes, absolutely! StudyStack is a modern web application built for flexibility. As long as you have your login credentials, you can securely access your account and all its resources from any device with a web browser, including your laptop, tablet, or smartphone.",
  },
  {
    title: "How is the content kept up-to-date?",
    content:
      "All academic materials on the platform are uploaded and managed directly by the subject teachers and authorized faculty members, ensuring that the resources are always relevant, accurate, and current with the syllabus.",
  },
];
export const mainFooterLinks = [
  {
    title: "MSBTE",
    href: "https://msbte.org.in/",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export const aboutPopoverLinks = [
  {
    title: "Our Team",
    href: "/about",
  },
  {
    title: "The Project",
    href: "/about/project",
  },
];

export const legalPopoverLinks = [
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    title: "Cookie Policy",
    href: "/cookie-policy",
  },
  {
    title: "Copyright Policy",
    href: "/copyright-policy",
  },
  {
    title: "Terms & Conditions",
    href: "/terms-and-conditions",
  },
];

export const creators = [
  {
    name: "Vedant Bhor",
    role: "Lead Developer & Project Management",
    avatar:
      "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/team/user_pfp/vedant.jpg",
  },
  {
    name: "Tanay Hingane",
    role: "Database Management & Authentication",
    avatar:
      "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/team/user_pfp/tanayh.jpg",
  },
  {
    name: "Adarsh Tile",
    role: "Project Documentation & Video Editing",
    avatar:
      "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/team/user_pfp/adarsh.jpg",
  },
  {
    name: "Yadnesh Udar",
    role: "Testing & Project Report",
    avatar:
      "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/team/user_pfp/yadnesh.jpg",
  },
];

export const guide = [
  {
    name: "AD. Talole",
    role: "Lecturer, Computer Department",
    avatar:
      "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/mentor/adt.jpg",
  },
  {
    name: "GB. Katkade",
    role: "HOD, Computer Department",
    avatar:
      "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/mentor/gbk.jpeg",
  },
];

export const footerIcons = [
  {
    href: "https://www.instagram.com/study_stack02/",
    icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: "https://www.youtube.com/@StudyStack01",
    icon: FaYoutube,
    label: "Youtube",
  },
  {
    href: "https://poly.kkwagh.edu.in/",
    icon: FaGlobe,
    label: "Website",
  },
];
