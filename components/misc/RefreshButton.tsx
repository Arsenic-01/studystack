import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

const RefreshButton = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    if (isSpinning) return; // Prevent multiple clicks triggering animation
    setIsSpinning(true);

    // Invalidate queries
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["notes"] });

    // Refresh the router
    router.refresh();

    // Stop spinning after 1 second (adjust as needed)
    setTimeout(() => setIsSpinning(false), 1000);
  };

  return (
    <Button onClick={handleClick} size="icon" variant="outline">
      <RefreshCcw
        className={`${
          isSpinning ? "animate-spin" : ""
        } transition-all duration-500`}
      />
    </Button>
  );
};

export default RefreshButton;
