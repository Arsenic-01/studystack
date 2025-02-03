import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import { InfiniteMovingCardsDemo } from "@/components/InfiniteMovingCardsDemo";
import { CardHoverEffectDemo } from "@/components/CardHoverEffectDemo";

export default function Home() {
  return (
    <div>
      <Hero />
      <CardHoverEffectDemo />
      <InfiniteMovingCardsDemo />
      <FAQ />
    </div>
  );
}
