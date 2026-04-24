import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiAward, FiBook, FiChevronDown } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa6";
import {
  achievementsPlaceholder,
  certifications,
  education,
} from "../data/certifications";

const Experience = () => {
  const [showCourses, setShowCourses] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="experience" className="section experience-section" ref={ref}>
      <h2 className="section-title">My Journey</h2>

      <motion.div
        className="timeline"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <article className="timeline-item glass-morphism">
          <div className="timeline-dot" />
          <div className="timeline-content">
            <h3>
              <FiBook /> {education.degree}
            </h3>
            <p>{education.institution}</p>
            <p>
              {education.duration} · CGPA: {education.cgpa}
            </p>
            <button
              className="text-link"
              onClick={() => setShowCourses((prev) => !prev)}
            >
              Relevant Coursework <FiChevronDown />
            </button>
            {showCourses && (
              <ul className="timeline-list">
                {education.coursework.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            )}
          </div>
        </article>

        {certifications.map((certificate) => (
          <article
            key={certificate.id}
            className="timeline-item glass-morphism"
          >
            <div className="timeline-dot" />
            <div className="timeline-content">
              <h3>
                <FiAward /> {certificate.title}
              </h3>
              <p>
                {certificate.issuer} · {certificate.platform}
              </p>
              <p>Completed: {certificate.date}</p>
              <ul className="timeline-list">
                {certificate.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                View Certificate
              </a>
            </div>
          </article>
        ))}

        <article className="timeline-item glass-morphism">
          <div className="timeline-dot" />
          <div className="timeline-content">
            <h3>
              <FaTrophy /> Achievements (Growing)
            </h3>
            <ul className="timeline-list">
              {achievementsPlaceholder.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>
      </motion.div>
    </section>
  );
};

export default Experience;
