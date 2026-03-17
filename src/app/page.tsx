import { HeroSection } from "@/components/sections/HeroSection";
import { InterestsSection } from "@/components/sections/InterestsSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SectionDots } from "@/components/ui/SectionDots";

export default function Home() {
  return (
    <main>
      <SectionDots />
      <HeroSection />
      <InterestsSection />
      <EducationSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
    </main>
  );
}
