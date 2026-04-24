import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FiArrowDown, FiDownload } from "react-icons/fi";
import MLPipeline from "./MLPipeline";

const Hero = ({ onNavigate, onPipelineSelect, resumeUrl }) => {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-grid-overlay" />

      <div className="hero-content">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="hero-greeting">Hi, I&apos;m</span>
          <h1 className="hero-name">VARAD PENDKAR</h1>

          <p className="hero-roles">
            <TypeAnimation
              sequence={[
                "ML Engineer",
                2000,
                "AI Developer",
                2000,
                "Data Scientist",
                2000,
                "NLP Specialist",
                2000,
              ]}
              speed={45}
              repeat={Infinity}
            />
          </p>

          <p className="hero-tagline">
            Building intelligent systems from data to deployment with a focus on
            scalable ML pipelines and real-world impact.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn btn-primary"
              onClick={() => onNavigate("projects")}
            >
              View My Work
            </button>
            <a className="btn btn-outline" href={resumeUrl} download>
              <FiDownload />
              Download Resume
            </a>
          </div>

          <button
            className="scroll-indicator"
            onClick={() => onNavigate("about")}
            aria-label="Scroll to about section"
          >
            <FiArrowDown />
            Scroll to explore
          </button>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
        >
          <MLPipeline onSelect={onPipelineSelect} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
