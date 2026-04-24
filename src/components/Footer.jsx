import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaEnvelope, FaXTwitter } from "react-icons/fa6";

const Footer = ({ onNavigate, resumeUrl }) => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>Quick Links</h3>
          <button onClick={() => onNavigate("about")}>About</button>
          <button onClick={() => onNavigate("projects")}>Work</button>
          <button onClick={() => onNavigate("skills")}>Skills</button>
          <button onClick={() => onNavigate("contact")}>Contact</button>
        </div>

        <div>
          <h3>Social</h3>
          <a
            href="https://github.com/Varadpendkar"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/varad-pendkar-0b4974253"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedinIn /> LinkedIn
          </a>
          <a href="https://x.com/" target="_blank" rel="noreferrer">
            <FaXTwitter /> Twitter / X
          </a>
          <a href="mailto:varadpendkar@gmail.com">
            <FaEnvelope /> Email
          </a>
        </div>

        <div>
          <h3>Resources</h3>
          <a href={resumeUrl} download>
            Download Resume
          </a>
          <button onClick={() => onNavigate("projects")}>View Projects</button>
          <button onClick={() => onNavigate("contact")}>Send Message</button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Designed & Built by Varad Pendkar | © 2026</p>
        <p>Made with React, Framer Motion & ❤️</p>
      </div>
    </footer>
  );
};

export default Footer;
