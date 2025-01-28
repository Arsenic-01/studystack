"use client";
import { useRouter } from "next/navigation";
import { RainbowButton } from "../ui/rainbow-button";

const LoginButton = ({ text }: { text: string }) => {
  const router = useRouter();

  return (
    <RainbowButton onClick={() => router.push("/login")}>{text}</RainbowButton>
  );
};

export default LoginButton;
