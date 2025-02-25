import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const RefreshButton = () => {
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    if (isSpinning) return; // Prevent multiple clicks triggering animation
    setIsSpinning(true);
    router.refresh();

    // Stop spinning after 1 second (adjust as needed)
    setTimeout(() => setIsSpinning(false), 1000);
  };

  return (
    <Button onClick={handleClick} size="icon" variant="secondary">
      <RefreshCcw
        className={`${
          isSpinning ? "animate-spin" : ""
        } transition-all duration-500`}
      />
    </Button>
  );
};

export default RefreshButton;
