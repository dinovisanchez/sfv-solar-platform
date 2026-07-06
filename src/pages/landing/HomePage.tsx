import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Modules } from "@/components/landing/Modules";
import { AssistantSection } from "@/components/landing/AssistantSection";
import { Screenshots } from "@/components/landing/Screenshots";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTASection } from "@/components/landing/CTASection";

export function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Modules />
      <AssistantSection />
      <Screenshots />
      <Pricing />
      <FAQ />
      <CTASection />
    </>
  );
}
