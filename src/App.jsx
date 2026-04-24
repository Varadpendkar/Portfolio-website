import { lazy, Suspense, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import SocialSidebar from "./components/SocialSidebar";
import CursorTrail from "./components/CursorTrail";

const Hero = lazy(() => import("./components/Hero"));
const About = lazy(() => import("./components/About"));
const SkillConstellation = lazy(
  () => import("./components/SkillConstellation"),
);
const Projects = lazy(() => import("./components/Projects"));
const Experience = lazy(() => import("./components/Experience"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));
const PortfolioCopilot = lazy(() => import("./components/PortfolioCopilot"));

const SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
];

const App = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [projectFilter, setProjectFilter] = useState("All");
  const resumeUrl = "/resume/Varad_Pendkar_Resume.pdf";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.45,
        rootMargin: "-80px 0px -120px 0px",
      },
    );

    SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSkillDrivenFilter = (filter) => {
    setProjectFilter(filter || "All");
    scrollToSection("projects");
  };

  return (
    <div className="app-shell">
      <CursorTrail />
      <SocialSidebar />

      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        resumeUrl={resumeUrl}
      />

      <Suspense
        fallback={<div className="global-loader">Loading AI experience…</div>}
      >
        <Hero
          onNavigate={scrollToSection}
          onPipelineSelect={handleSkillDrivenFilter}
          resumeUrl={resumeUrl}
        />
        <About resumeUrl={resumeUrl} />
        <SkillConstellation />
        <Projects
          activeFilter={projectFilter}
          onFilterChange={setProjectFilter}
        />
        <Experience />
        <Contact resumeUrl={resumeUrl} />
        <Footer onNavigate={scrollToSection} resumeUrl={resumeUrl} />
        <PortfolioCopilot />
      </Suspense>
    </div>
  );
};

export default App;
