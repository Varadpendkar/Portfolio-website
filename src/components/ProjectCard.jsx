import { FiBookOpen, FiExternalLink, FiGithub } from "react-icons/fi";

const ProjectCard = ({ project }) => {
  return (
    <article className="project-card card-hover">
      <div className="project-media" aria-hidden>
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
          />
        ) : (
          <div className="project-placeholder">
            <span>{project.title}</span>
          </div>
        )}
      </div>

      <div className="project-content">
        <h3>{project.title}</h3>
        <p>{project.fullDescription}</p>

        <div className="project-metric">
          <strong>💡 Key Metric:</strong>
          <span>{project.keyMetric}</span>
        </div>

        <div className="tech-badges">
          {project.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>

        <ul className="feature-list">
          {project.features.slice(0, 3).map((feature) => (
            <li key={feature}>✓ {feature}</li>
          ))}
        </ul>

        <div className="project-links">
          <a href={project.github} target="_blank" rel="noreferrer">
            <FiGithub /> GitHub
          </a>
          {project.demo ? (
            <a href={project.demo} target="_blank" rel="noreferrer">
              <FiExternalLink /> Demo
            </a>
          ) : (
            <span className="muted-link">
              <FiExternalLink /> Demo Soon
            </span>
          )}
          <a href={project.github} target="_blank" rel="noreferrer">
            <FiBookOpen /> Case Study
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
