import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Reset your password for StudyStack. Enter your new password and confirm it to complete the password reset process.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
