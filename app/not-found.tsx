import {
  NotFoundErrorMessage,
  FuzzyOverlay,
} from "@/components/not_found_components/Fuzzy";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <NotFoundErrorMessage />
      <FuzzyOverlay />
    </div>
  );
}
