// data/index.ts
import { FaGlobe, FaInstagram, FaYoutube } from "react-icons/fa6";

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
      "StudyStack is a centralized platform for Computer Technology (CM) students at K.K. Wagh Polytechnic, Nashik, providing all necessary notes and resources in one place.",
  },
  {
    title: "Why was StudyStack created?",
    content:
      "StudyStack was designed to help students easily access essential study materials, enabling them to excel in their coursework and achieve top scores in their exams.",
  },
  {
    title: "Who developed StudyStack?",
    content:
      "StudyStack was created by students Vedant B. Bhor and Tanay K. Hingane, who share a passion for technology and education.",
  },
  {
    title: "Who can use StudyStack?",
    content:
      "StudyStack is free to use for any student enrolled in the Computer Technology course, provided they have valid login credentials.",
  },
  {
    title: "How does StudyStack work?",
    content:
      "StudyStack allows teachers and faculty to upload subject-specific notes and resources, which students can access conveniently. It functions similarly to Google Classroom but with enhanced usability.",
  },
  {
    title: "What technologies power StudyStack?",
    content:
      "StudyStack is built using Next.js for the frontend + turbopack, Tailwind CSS for styling, Appwrite for backend services, React for UI components, and Framer Motion for animations.",
  },
  {
    title: "Is StudyStack open-source?",
    content:
      "Yes! StudyStack is an open-source project. You can explore the source code on GitHub: https://github.com/Arsenic-01/studystack",
  },
  {
    title: "Can I use studystack from multiple devices?",
    content:
      "No, studystack is a single-user application. You can only use it from a single device. This is to ensure that your data is secure and easy to manage.",
  },
];

export const footerLinks = [
  {
    title: "KKWP",
    href: "https://poly.kkwagh.edu.in/",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    //    href: "https://docs.google.com/forms/d/e/1FAIpQLSeCgACy0cfy08L_CGsxputmIIqvh-aD4uUE7B-sX1oIzqwZ9g/viewform?usp=sharing",
    href: "/contact",
  },
  {
    title: "MSBTE",
    href: "https://msbte.ac.in/",
  },
];

export const creators = [
  {
    name: "Vedant Bhor",
    role: "Lead Developer",
    avatar: "/team/user_pfp/vedant.jpeg",
  },
  {
    name: "Tanay Hingane",
    role: "Fullstack Developer & Database Management",
    avatar: "/team/user_pfp/tanay.jpeg",
  },
  {
    name: "Adarsh Tile",
    role: "Frontend Developer & Project Documentation",
    avatar: "/team/user_pfp/adarsh.jpeg",
  },
  {
    name: "Yadnesh Udar",
    role: "Project Report",
    avatar: "/team/user_pfp/yadnesh.png",
  },
];

export const guide = [
  {
    name: "AD. Talole",
    role: "Lecturer",
  },
  {
    name: "GB. Katkade",
    role: "HOD, Computer Department",
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

export const gb = [
  {
    id: 1,
    name: "Mr G.B.Katkade",
    designation: "HOD(CM Dept)",
    image: "/katkadesir.png",
  },
  {
    id: 2,
    name: "Mr A.D.Talole",
    designation: "Lecturer(CM Dept)",
    image: "/talolesir.webp",
  },
];
