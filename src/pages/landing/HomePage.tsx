import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Modules } from "@/components/landing/Modules";
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
      <Screenshots />
      <Pricing />
      <FAQ />
      <CTASection />
    </>
  );
}
