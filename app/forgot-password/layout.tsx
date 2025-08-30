import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Forgot your password? Don't worry, we got you covered. Enter your PRN number and email address to reset your password.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
