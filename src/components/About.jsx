import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { FiArrowRight, FiBookOpen, FiTarget, FiUser } from "react-icons/fi";
import {
  FaCodeBranch,
  FaGraduationCap,
  FaLayerGroup,
  FaProjectDiagram,
} from "react-icons/fa";

const stats = [
  {
    value: "15+",
    label: "Projects",
    icon: <FaProjectDiagram />,
    detail: "Across NLP, CV, web apps, and MLOps",
  },
  {
    value: "4",
    label: "Core Domains",
    icon: <FaLayerGroup />,
    detail: "ML, NLP, Computer Vision, MLOps",
  },
  {
    value: "7.23",
    label: "CGPA",
    icon: <FaGraduationCap />,
    detail: "B.Tech AI/ML at GHRCEM Pune",
  },
  {
    value: "2026",
    label: "Graduate",
    icon: <FaCodeBranch />,
    detail: "Actively seeking AI/ML opportunities",
  },
];

const accordionContent = [
  {
    title: "Who I Am",
    icon: <FiUser />,
    body: "I’m a final-year AI/ML engineering student based in Pune, India. I enjoy turning ambiguous problems into practical machine learning products with measurable outcomes.",
  },
  {
    title: "What I Do",
    icon: <FiBookOpen />,
    body: "I build end-to-end ML systems spanning data preprocessing, feature engineering, model training, deployment APIs, and user-facing interfaces. My focus areas include NLP, computer vision, and production readiness.",
  },
  {
    title: "What I’m Looking For",
    icon: <FiTarget />,
    body: "I’m looking for entry-level AI/ML engineering roles where I can contribute to impactful products, work with strong mentors, and keep building reliable intelligent systems at scale.",
  },
];

const About = ({ resumeUrl }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="about" className="section about-section" ref={ref}>
      <h2 className="section-title">About Me</h2>

      <div className="about-layout">
        <motion.article
          className="about-panel glass-morphism"
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <div className="about-avatar">
            <span>VP</span>
            <small>AI / ML Engineer</small>
          </div>

          <div className="about-stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card card-hover">
                <span className="stat-icon">{stat.icon}</span>
                <strong>{stat.value}</strong>
                <p>{stat.label}</p>
                <small>{stat.detail}</small>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article
          className="about-panel glass-morphism"
          initial={{ opacity: 0, x: 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          {accordionContent.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.title}
                className={`about-accordion ${isOpen ? "is-open" : ""}`}
              >
                <button
                  className="about-accordion-trigger"
                  onClick={() => setOpenIndex(index)}
                >
                  <span className="about-accordion-icon">{item.icon}</span>
                  {item.title}
                </button>
                {isOpen && <p className="about-accordion-body">{item.body}</p>}
              </div>
            );
          })}

          <a href={resumeUrl} download className="text-link">
            View Full Resume
            <FiArrowRight />
          </a>
        </motion.article>
      </div>
    </section>
  );
};

export default About;
