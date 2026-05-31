import { Hero } from "@/components/sections/Hero";
import { ServicesIntro } from "@/components/sections/ServicesIntro";
import { Approach } from "@/components/sections/Approach";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesIntro />
      <Approach />
      <SelectedWork />
      <ContactCTA />
    </>
  );
}
