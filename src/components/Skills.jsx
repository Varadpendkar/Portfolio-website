import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { skillCategories, skillFilters } from "../data/skills";

const positions = [
  { x: 12, y: 30 },
  { x: 30, y: 10 },
  { x: 48, y: 35 },
  { x: 66, y: 12 },
  { x: 84, y: 36 },
  { x: 54, y: 68 },
];

const Skills = ({ onSelectSkill }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hovered, setHovered] = useState(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const visibleCategories = useMemo(
    () =>
      activeFilter === "All"
        ? skillCategories
        : skillCategories.filter((category) => category.name === activeFilter),
    [activeFilter],
  );

  const graphLinks = useMemo(() => {
    const links = [];
    for (let i = 0; i < visibleCategories.length; i += 1) {
      for (let j = i + 1; j < visibleCategories.length; j += 1) {
        links.push([i, j]);
      }
    }
    return links;
  }, [visibleCategories]);

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    if (filter === "All") {
      onSelectSkill("All");
      return;
    }

    const category = skillCategories.find((item) => item.name === filter);
    onSelectSkill(category?.projectFilter || filter);
  };

  return (
    <section id="skills" className="section skills-section" ref={ref}>
      <h2 className="section-title">My Tech Stack</h2>

      <div className="filter-row">
        {skillFilters.map((filter) => (
          <button
            key={filter}
            className={`filter-chip ${activeFilter === filter ? "is-active" : ""}`}
            onClick={() => handleFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <motion.div
        className="skills-network glass-morphism"
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <svg className="skills-lines" aria-hidden>
          {graphLinks.map(([source, target]) => {
            const sourcePos = positions[source % positions.length];
            const targetPos = positions[target % positions.length];

            return (
              <line
                key={`${source}-${target}`}
                x1={`${sourcePos.x}%`}
                y1={`${sourcePos.y}%`}
                x2={`${targetPos.x}%`}
                y2={`${targetPos.y}%`}
              />
            );
          })}
        </svg>

        <div className="skills-node-layer">
          {visibleCategories.map((category, index) => {
            const pos = positions[index % positions.length];
            const previewSkills = category.skills
              .slice(0, 4)
              .map((skill) => skill.name);
            const remainingSkills = Math.max(
              0,
              category.skills.length - previewSkills.length,
            );

            return (
              <motion.button
                key={category.name}
                className="skill-node"
                style={{
                  "--skill-color": category.color,
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                }}
                whileHover={{ scale: 1.1 }}
                onMouseEnter={() => setHovered(category.name)}
                onMouseLeave={() => setHovered(null)}
                onClick={() =>
                  onSelectSkill(category.projectFilter || category.name)
                }
              >
                <span>{category.name}</span>
                {hovered === category.name && (
                  <small>
                    {category.summary}
                    <br />
                    {previewSkills.join(" • ")}
                    {remainingSkills > 0 ? ` • +${remainingSkills} more` : ""}
                  </small>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default Skills;
