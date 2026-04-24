import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { projectFilters, projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

const Projects = ({ activeFilter, onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState(activeFilter || "All");
  const sliderRef = useRef(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  useEffect(() => {
    if (!activeFilter) return;
    setSelectedFilter(activeFilter);
  }, [activeFilter]);

  const filteredProjects = useMemo(() => {
    if (selectedFilter === "All") return projects;

    return projects.filter((project) =>
      project.categories.includes(selectedFilter),
    );
  }, [selectedFilter]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  const scrollByCards = (direction) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: direction * 420, behavior: "smooth" });
  };

  return (
    <section id="projects" className="section projects-section" ref={ref}>
      <h2 className="section-title">Featured Projects</h2>
      <p className="section-subtitle">
        Building intelligent systems that solve real problems end-to-end.
      </p>

      <div className="filter-row">
        {projectFilters.map((filter) => (
          <button
            key={filter}
            className={`filter-chip ${selectedFilter === filter ? "is-active" : ""}`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <motion.div
        className="project-carousel-wrap"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55 }}
      >
        <button
          className="carousel-arrow left"
          onClick={() => scrollByCards(-1)}
          aria-label="Scroll projects left"
        >
          <FiArrowLeft />
        </button>

        <div className="project-carousel" ref={sliderRef}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <button
          className="carousel-arrow right"
          onClick={() => scrollByCards(1)}
          aria-label="Scroll projects right"
        >
          <FiArrowRight />
        </button>
      </motion.div>

      <div className="projects-footer-cta">
        <button
          className="btn btn-outline"
          onClick={() => handleFilterChange("All")}
        >
          View All Projects
        </button>
      </div>
    </section>
  );
};

export default Projects;
