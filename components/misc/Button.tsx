"use client";
import { useRouter } from "next/navigation";
import { RainbowButton } from "../ui/rainbow-button";

const LoginButton = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const router = useRouter();

  return (
    <RainbowButton className={className} onClick={() => router.push("/")}>
      {text}
    </RainbowButton>
  );
};

export default LoginButton;
